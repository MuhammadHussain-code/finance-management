import { useMemo, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAssets } from "@/features/assets/hooks/use-assets";
import { useLatestPrices } from "@/features/assets/hooks/use-asset-prices";
import { useInvestments } from "@/features/investments/hooks/use-investments";
import { calculateReturnMetrics } from "@/features/calculations/lib/returns";
import {
  calculatePortfolioGrowthData,
  calculateSipContributionsData,
  calculateAssetAllocationData,
} from "@/features/calculations/lib/chart-data";
import { PortfolioSummary } from "@/features/dashboard/components/portfolio-summary";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { RecentInvestments } from "@/features/dashboard/components/recent-investments";
import { AssetList } from "@/features/assets/components/asset-list";

// Lazy load chart components for better initial load performance
const PortfolioGrowthChart = lazy(() =>
  import("@/components/charts/portfolio-growth-chart").then((m) => ({
    default: m.PortfolioGrowthChart,
  })),
);
const SipContributionsChart = lazy(() =>
  import("@/components/charts/sip-contributions-chart").then((m) => ({
    default: m.SipContributionsChart,
  })),
);
const AssetAllocationChart = lazy(() =>
  import("@/components/charts/asset-allocation-chart").then((m) => ({
    default: m.AssetAllocationChart,
  })),
);

function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div
      className="animate-pulse rounded-lg border bg-card"
      style={{ height: height + 80 }}
    >
      <div className="p-6">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="mt-2 h-3 w-48 rounded bg-muted" />
      </div>
      <div className="px-6 pb-6">
        <div className="h-full rounded bg-muted" style={{ height }} />
      </div>
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const assetsQuery = useAssets(user?.id);
  const investmentsQuery = useInvestments(user?.id);
  const latestPricesQuery = useLatestPrices(user?.id);

  const {
    assetsById,
    metricsByAssetId,
    portfolioTotals,
    portfolioGrowthData,
    sipContributionsData,
    assetAllocationData,
  } = useMemo(() => {
    const assets = assetsQuery.data ?? [];
    const investments = investmentsQuery.data ?? [];
    const latestPrices = latestPricesQuery.data ?? {};

    const assetsById = assets.reduce<Record<string, typeof assets[number]>>((acc, asset) => {
      acc[asset.id] = asset;
      return acc;
    }, {});

    const investmentsByAsset = investments.reduce<Record<string, typeof investments>>(
      (acc, investment) => {
        acc[investment.asset_id] = acc[investment.asset_id]
          ? [...acc[investment.asset_id], investment]
          : [investment];
        return acc;
      },
      {},
    );

    const metricsByAssetId: Record<
      string,
      { totalInvested: number; currentValue: number; returnPercentage: number | null }
    > = {};

    let totalInvested = 0;
    let currentValue = 0;

    Object.entries(investmentsByAsset).forEach(([assetId, assetInvestments]) => {
      const latestPrice = latestPrices[assetId]?.price;
      const metrics = calculateReturnMetrics(assetInvestments, latestPrice);
      metricsByAssetId[assetId] = {
        totalInvested: metrics.totalInvested,
        currentValue: metrics.currentValue,
        returnPercentage: metrics.returnPercentage,
      };
      totalInvested += metrics.totalInvested;
      currentValue += metrics.currentValue;
    });

    const absoluteReturn = currentValue - totalInvested;
    const returnPercentage =
      totalInvested > 0 ? (absoluteReturn / totalInvested) * 100 : null;

    // Calculate chart data
    const portfolioGrowthData = calculatePortfolioGrowthData(
      investments,
      latestPrices,
    );
    const sipContributionsData = calculateSipContributionsData(investments);
    const assetAllocationData = calculateAssetAllocationData(
      assets,
      investments,
      latestPrices,
    );

    return {
      assetsById,
      metricsByAssetId,
      portfolioTotals: {
        totalInvested,
        currentValue,
        absoluteReturn,
        returnPercentage,
      },
      portfolioGrowthData,
      sipContributionsData,
      assetAllocationData,
    };
  }, [assetsQuery.data, investmentsQuery.data, latestPricesQuery.data]);

  if (assetsQuery.isLoading || investmentsQuery.isLoading || latestPricesQuery.isLoading) {
    return <LoadingSpinner label="Loading portfolio" />;
  }

  if (!assetsQuery.data?.length) {
    return (
      <div className="space-y-6">
        <QuickActions />
        <EmptyState
          title="No assets yet"
          description="Create your first asset to start tracking investments."
          actionLabel="Add your first asset"
          onAction={() => navigate("/assets")}
        />
      </div>
    );
  }

  const hasInvestments = investmentsQuery.data && investmentsQuery.data.length > 0;

  return (
    <div className="space-y-6">
      {/* Top Summary Section */}
      <PortfolioSummary {...portfolioTotals} />
      <QuickActions />

      {/* Charts Section - Only show when there are investments */}
      {hasInvestments && (
        <>
          {/* Portfolio Growth Chart - Primary visual focus */}
          <Suspense fallback={<ChartSkeleton height={300} />}>
            <PortfolioGrowthChart
              data={portfolioGrowthData}
              height={300}
            />
          </Suspense>

          {/* Secondary Charts - Side by side on desktop, stacked on mobile */}
          <div className="grid gap-6 md:grid-cols-2">
            <Suspense fallback={<ChartSkeleton height={250} />}>
              <SipContributionsChart
                data={sipContributionsData}
                height={250}
              />
            </Suspense>
            <Suspense fallback={<ChartSkeleton height={250} />}>
              <AssetAllocationChart
                data={assetAllocationData}
                height={250}
              />
            </Suspense>
          </div>
        </>
      )}

      {/* Assets List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Your assets</h2>
        <AssetList assets={assetsQuery.data ?? []} metricsByAssetId={metricsByAssetId} />
      </div>

      {/* Recent Investments */}
      {hasInvestments && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Recent investments</h2>
          <RecentInvestments
            investments={investmentsQuery.data ?? []}
            assetsById={assetsById}
          />
        </div>
      )}
    </div>
  );
}

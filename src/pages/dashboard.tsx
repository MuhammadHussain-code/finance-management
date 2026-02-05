import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAssets } from "@/features/assets/hooks/use-assets";
import { useInvestments } from "@/features/investments/hooks/use-investments";
import { getTotalUnits } from "@/features/calculations/lib/investment-units";
import { calculateInvestmentsByAssetData } from "@/features/calculations/lib/chart-data";
import { PortfolioSummary } from "@/features/dashboard/components/portfolio-summary";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { RecentInvestments } from "@/features/dashboard/components/recent-investments";
import { AssetList } from "@/features/assets/components/asset-list";
import { AssetAllocationChart } from "@/components/charts/asset-allocation-chart";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const assetsQuery = useAssets(user?.id);
  const investmentsQuery = useInvestments(user?.id);

  const {
    assetsById,
    metricsByAssetId,
    portfolioTotals,
    investmentsByAssetData,
  } = useMemo(() => {
    const assets = assetsQuery.data ?? [];
    const investments = investmentsQuery.data ?? [];

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

    const metricsByAssetId: Record<string, { totalInvested: number; totalUnits: number }> = {};

    let totalInvested = 0;
    let totalUnits = 0;

    Object.entries(investmentsByAsset).forEach(([assetId, assetInvestments]) => {
      const assetTotalInvested = assetInvestments.reduce((sum, inv) => sum + inv.amount, 0);
      const assetTotalUnits = getTotalUnits(assetInvestments);
      metricsByAssetId[assetId] = {
        totalInvested: assetTotalInvested,
        totalUnits: assetTotalUnits,
      };
      totalInvested += assetTotalInvested;
      totalUnits += assetTotalUnits;
    });

    return {
      assetsById,
      metricsByAssetId,
      investmentsByAssetData: calculateInvestmentsByAssetData(assets, investments),
      portfolioTotals: {
        totalInvested,
        totalUnits,
      },
    };
  }, [assetsQuery.data, investmentsQuery.data]);

  if (assetsQuery.isLoading || investmentsQuery.isLoading) {
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

  return (
    <div className="space-y-6">
      {/* Top Summary Section */}
      <PortfolioSummary {...portfolioTotals} />
      <QuickActions />

      <AssetAllocationChart
        data={investmentsByAssetData}
        title="Investments by asset"
        description="See how your contributions are spread across your assets"
        emptyState={
          <div className="text-muted-foreground">
            <p className="text-sm">No investments yet</p>
            <p className="mt-1 text-xs">
              Add your first investment to see your asset breakdown
            </p>
          </div>
        }
      />

      {/* Assets List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Your assets</h2>
        <AssetList assets={assetsQuery.data ?? []} metricsByAssetId={metricsByAssetId} />
      </div>

      {/* Recent Investments */}
      {investmentsQuery.data?.length ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Recent investments</h2>
          <RecentInvestments
            investments={investmentsQuery.data ?? []}
            assetsById={assetsById}
          />
        </div>
      ) : null}
    </div>
  );
}

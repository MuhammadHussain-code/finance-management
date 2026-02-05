import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { AssetForm } from "@/features/assets/components/asset-form";
import { AssetList } from "@/features/assets/components/asset-list";
import { useAssets } from "@/features/assets/hooks/use-assets";
import { useLatestPrices } from "@/features/assets/hooks/use-asset-prices";
import { useInvestments } from "@/features/investments/hooks/use-investments";
import { calculateReturnMetrics } from "@/features/calculations/lib/returns";

export function AssetsPage() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const assetsQuery = useAssets(user?.id);
  const investmentsQuery = useInvestments(user?.id);
  const latestPricesQuery = useLatestPrices(user?.id);

  const metricsByAssetId = useMemo(() => {
    const investments = investmentsQuery.data ?? [];
    const latestPrices = latestPricesQuery.data ?? {};
    const investmentsByAsset = investments.reduce<Record<string, typeof investments>>(
      (acc, investment) => {
        acc[investment.asset_id] = acc[investment.asset_id]
          ? [...acc[investment.asset_id], investment]
          : [investment];
        return acc;
      },
      {},
    );

    const metrics: Record<
      string,
      { totalInvested: number; currentValue: number; returnPercentage: number | null }
    > = {};

    Object.entries(investmentsByAsset).forEach(([assetId, assetInvestments]) => {
      const latestPrice = latestPrices[assetId]?.price;
      const result = calculateReturnMetrics(assetInvestments, latestPrice);
      metrics[assetId] = {
        totalInvested: result.totalInvested,
        currentValue: result.currentValue,
        returnPercentage: result.returnPercentage,
      };
    });

    return metrics;
  }, [investmentsQuery.data, latestPricesQuery.data]);

  if (assetsQuery.isLoading || investmentsQuery.isLoading || latestPricesQuery.isLoading) {
    return <LoadingSpinner label="Loading assets" />;
  }

  const assets = assetsQuery.data ?? [];

  const handleCreate = (values: { name: string; category_id: string; symbol?: string; notes?: string }) => {
    if (!user) return;
    assetsQuery.createAsset.mutate(
      {
        user_id: user.id,
        name: values.name,
        category_id: values.category_id,
        symbol: values.symbol ?? null,
        notes: values.notes ?? null,
      },
      {
        onSuccess: () => setIsDialogOpen(false),
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Assets</h1>
          <p className="text-sm text-muted-foreground">
            Track each instrument and update its price over time.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add asset</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New asset</DialogTitle>
            </DialogHeader>
            <AssetForm onSubmit={handleCreate} isSubmitting={assetsQuery.createAsset.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      {assets.length ? (
        <AssetList assets={assets} metricsByAssetId={metricsByAssetId} />
      ) : (
        <EmptyState
          title="No assets yet"
          description="Create an asset to begin logging SIP or lump-sum investments."
          actionLabel="Add asset"
          onAction={() => setIsDialogOpen(true)}
        />
      )}
    </div>
  );
}

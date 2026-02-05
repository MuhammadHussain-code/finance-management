import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { AssetForm } from "@/features/assets/components/asset-form";
import { AssetList } from "@/features/assets/components/asset-list";
import { useAssets } from "@/features/assets/hooks/use-assets";
import { useInvestments } from "@/features/investments/hooks/use-investments";
import { getTotalUnits } from "@/features/calculations/lib/investment-units";
import { toast } from "@/components/ui/toast";

export function AssetsPage() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const assetsQuery = useAssets(user?.id);
  const investmentsQuery = useInvestments(user?.id);

  const metricsByAssetId = useMemo(() => {
    const investments = investmentsQuery.data ?? [];
    const investmentsByAsset = investments.reduce<Record<string, typeof investments>>(
      (acc, investment) => {
        acc[investment.asset_id] = acc[investment.asset_id]
          ? [...acc[investment.asset_id], investment]
          : [investment];
        return acc;
      },
      {},
    );

    const metrics: Record<string, { totalInvested: number; totalUnits: number }> = {};

    Object.entries(investmentsByAsset).forEach(([assetId, assetInvestments]) => {
      const totalInvested = assetInvestments.reduce((sum, inv) => sum + inv.amount, 0);
      const totalUnits = getTotalUnits(assetInvestments);
      metrics[assetId] = {
        totalInvested,
        totalUnits,
      };
    });

    return metrics;
  }, [investmentsQuery.data]);

  if (assetsQuery.isLoading || investmentsQuery.isLoading) {
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
        onSuccess: () => {
          setIsDialogOpen(false);
          toast.success("Asset created", "You can now add investments and prices.");
        },
      },
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground mt-1">
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

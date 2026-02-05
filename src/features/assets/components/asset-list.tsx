import type { Asset } from "@/features/assets/types";
import { AssetCard } from "@/features/assets/components/asset-card";

interface AssetListProps {
  assets: Asset[];
  metricsByAssetId: Record<
    string,
    { totalInvested: number; currentValue: number; returnPercentage: number | null }
  >;
}

export function AssetList({ assets, metricsByAssetId }: AssetListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {assets.map((asset) => {
        const metrics = metricsByAssetId[asset.id];
        return (
          <AssetCard
            key={asset.id}
            asset={asset}
            totalInvested={metrics?.totalInvested ?? 0}
            currentValue={metrics?.currentValue ?? 0}
            returnPercentage={metrics?.returnPercentage ?? null}
          />
        );
      })}
    </div>
  );
}

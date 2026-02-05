import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { InvestmentSummary } from "@/features/investments/components/investment-summary";
import { MonthlyBreakdown } from "@/features/investments/components/monthly-breakdown";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useInvestments } from "@/features/investments/hooks/use-investments";
import { useAssetPrices } from "@/features/assets/hooks/use-asset-prices";
import { PriceUpdateForm } from "@/features/assets/components/price-update-form";
import { usePortfolioMetrics } from "@/features/calculations/hooks/use-portfolio-metrics";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAssetById } from "@/features/assets/api/assets-api";
import { formatCurrency } from "@/lib/utils/format";
import { formatShortDate } from "@/lib/utils/date";
import { AssetForm } from "@/features/assets/components/asset-form";
import { useAssets } from "@/features/assets/hooks/use-assets";
import { toast } from "@/components/ui/toast";

export function AssetDetailPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);
  const assetQuery = useQuery({
    queryKey: ["asset", id],
    queryFn: () => fetchAssetById(id ?? ""),
    enabled: Boolean(id),
  });
  const assetsMutation = useAssets(user?.id);
  const investmentsQuery = useInvestments(user?.id);
  const pricesQuery = useAssetPrices(id);

  const assetInvestments = useMemo(
    () => (investmentsQuery.data ?? []).filter((item) => item.asset_id === id),
    [investmentsQuery.data, id],
  );

  const latestPrice = pricesQuery.data?.[0]?.price;
  const latestPriceDate = pricesQuery.data?.[0]?.price_date;
  const metrics = usePortfolioMetrics(assetInvestments, latestPrice);

  if (assetQuery.isLoading || investmentsQuery.isLoading || pricesQuery.isLoading) {
    return <LoadingSpinner label="Loading asset" />;
  }

  if (!assetQuery.data) {
    return <div className="text-sm text-muted-foreground">Asset not found.</div>;
  }

  const handlePriceSubmit = (values: { price: number; price_date: string }) => {
    if (!user || !id) return;
    pricesQuery.createPrice.mutate(
      {
        asset_id: id,
        user_id: user.id,
        price: values.price,
        price_date: values.price_date,
        source: "manual",
      },
      {
        onSuccess: () => {
          setIsPriceDialogOpen(false);
          toast.success("Price updated", "Latest price has been saved.");
        },
      }
    );
  };

  const handleAssetUpdate = (values: {
    name: string;
    category_id: string;
    symbol?: string;
    notes?: string;
  }) => {
    if (!id) return;
    assetsMutation.updateAsset.mutate(
      {
        id,
        payload: {
          name: values.name,
          category_id: values.category_id,
          symbol: values.symbol ?? null,
          notes: values.notes ?? null,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["asset", id] });
          toast.success("Asset updated", "Your changes have been saved.");
        },
      },
    );
  };

  const handleAssetDelete = () => {
    if (!id) return;
    if (!confirm("Delete this asset and its related investments?")) return;
    assetsMutation.deleteAsset.mutate(id, {
      onSuccess: () => {
        toast.success("Asset deleted", "All related investments were removed.");
        navigate("/assets");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-background p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{assetQuery.data.name}</h1>
            <p className="text-sm text-muted-foreground">
              {assetQuery.data.category_id.replace("_", " ")}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Dialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Update price</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update price</DialogTitle>
                </DialogHeader>
                <PriceUpdateForm
                  defaultDate={latestPriceDate}
                  onSubmit={handlePriceSubmit}
                  isSubmitting={pricesQuery.createPrice.isPending}
                />
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Edit asset</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit asset</DialogTitle>
                </DialogHeader>
                <AssetForm
                  defaultValues={{
                    name: assetQuery.data.name,
                    category_id: assetQuery.data.category_id,
                    symbol: assetQuery.data.symbol ?? undefined,
                    notes: assetQuery.data.notes ?? undefined,
                  }}
                  onSubmit={handleAssetUpdate}
                  isSubmitting={assetsMutation.updateAsset.isPending}
                  submitLabel="Update asset"
                />
              </DialogContent>
            </Dialog>
            <Button variant="destructive" onClick={handleAssetDelete}>
              Delete
            </Button>
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Current price:{" "}
          <span className="font-medium text-foreground">
            {latestPrice ? formatCurrency(latestPrice) : "Not set"}
          </span>
          {latestPriceDate ? ` · Updated ${formatShortDate(latestPriceDate)}` : null}
        </div>
      </div>

      <InvestmentSummary
        totalInvested={metrics.totalInvested}
        currentValue={metrics.currentValue}
        absoluteReturn={metrics.absoluteReturn}
        returnPercentage={metrics.returnPercentage}
        xirr={metrics.xirr}
      />

      {assetInvestments.length ? (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">SIP history</h2>
          <MonthlyBreakdown investments={assetInvestments} />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed bg-background p-6 text-sm text-muted-foreground">
          No investments recorded for this asset yet.
        </div>
      )}
    </div>
  );
}

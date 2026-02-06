import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { MonthlyBreakdown } from "@/features/investments/components/monthly-breakdown";
import { InvestmentList } from "@/features/investments/components/investment-list";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useInvestments } from "@/features/investments/hooks/use-investments";
import { useAssetPrices } from "@/features/assets/hooks/use-asset-prices";
import { PriceUpdateForm } from "@/features/assets/components/price-update-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAssetById } from "@/features/assets/api/assets-api";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import { formatShortDate } from "@/lib/utils/date";
import { AssetForm } from "@/features/assets/components/asset-form";
import { useAssets } from "@/features/assets/hooks/use-assets";
import { toast } from "@/components/ui/toast";
import { getTotalUnits } from "@/features/calculations/lib/investment-units";

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
  const totalInvested = useMemo(
    () => assetInvestments.reduce((sum, investment) => sum + investment.amount, 0),
    [assetInvestments],
  );
  const totalUnits = useMemo(() => getTotalUnits(assetInvestments), [assetInvestments]);
  const [currentValueInput, setCurrentValueInput] = useState("");
  const parsedCurrentValue = Number(currentValueInput);
  const hasCurrentValue =
    currentValueInput.trim() !== "" && Number.isFinite(parsedCurrentValue) && parsedCurrentValue >= 0;
  const pnl = hasCurrentValue ? parsedCurrentValue - totalInvested : null;
  const pnlPercent =
    hasCurrentValue && totalInvested > 0 ? (pnl ?? 0) / totalInvested * 100 : null;

  if (assetQuery.isLoading || investmentsQuery.isLoading || pricesQuery.isLoading) {
    return <LoadingSpinner label="Loading asset" />;
  }

  if (!assetQuery.data) {
    return <div className="text-sm text-muted-foreground">Asset not found.</div>;
  }

  const addInvestmentHref = id
    ? `/investments/new?assetId=${id}&returnTo=/assets/${id}`
    : "/investments/new";
  const assetsById = { [assetQuery.data.id]: assetQuery.data };

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
    currency: string;
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
          currency: values.currency,
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

  const handleInvestmentDelete = (investmentId: string) => {
    if (!confirm("Delete this investment entry?")) return;
    investmentsQuery.deleteInvestment.mutate(investmentId, {
      onSuccess: () => {
        toast.success("Investment deleted", "The entry has been removed.");
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
              {assetQuery.data.category_id.replace("_", " ")} · {assetQuery.data.currency}
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
                    currency: assetQuery.data.currency,
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
            {latestPrice ? formatCurrency(latestPrice, assetQuery.data.currency) : "Not set"}
          </span>
          {latestPriceDate ? ` · Updated ${formatShortDate(latestPriceDate)}` : null}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Investment totals</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <div className="text-muted-foreground">Total invested</div>
              <div className="text-lg font-semibold">
                <CurrencyDisplay value={totalInvested} currency={assetQuery.data.currency} />
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Total units</div>
              <div className="text-lg font-semibold">{formatNumber(totalUnits, 4)}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>PnL (on demand)</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            <div className="space-y-2">
              <label htmlFor="current_value" className="text-muted-foreground">
                Current value of your holdings
              </label>
              <Input
                id="current_value"
                name="current_value"
                type="number"
                step="0.01"
                min="0"
                value={currentValueInput}
                onChange={(event) => setCurrentValueInput(event.target.value)}
                placeholder="Enter current value"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">PnL</div>
              <div
                className={`text-lg font-semibold ${
                  pnl === null ? "" : pnl >= 0 ? "text-positive" : "text-negative"
                }`}
              >
                {pnl === null ? "—" : <CurrencyDisplay value={pnl} currency={assetQuery.data.currency} />}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">PnL %</div>
              <div className="text-lg font-semibold">
                {pnlPercent === null ? "—" : `${formatNumber(pnlPercent)}%`}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Investments</h2>
          <p className="text-sm text-muted-foreground">
            Track SIP and lump-sum entries for this asset.
          </p>
        </div>
        <Button asChild>
          <Link to={addInvestmentHref}>Add investment</Link>
        </Button>
      </div>

      {assetInvestments.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Monthly breakdown</h3>
            <MonthlyBreakdown investments={assetInvestments} currency={assetQuery.data.currency} />
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Entries</h3>
            <InvestmentList
              investments={assetInvestments}
              assetsById={assetsById}
              onDelete={handleInvestmentDelete}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed bg-background p-6 text-sm text-muted-foreground">
          No investments recorded for this asset yet.
        </div>
      )}
    </div>
  );
}

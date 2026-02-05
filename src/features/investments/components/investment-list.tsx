import { formatCurrency } from "@/lib/utils/format";
import { formatShortDate } from "@/lib/utils/date";
import type { Investment } from "@/features/investments/types";
import type { Asset } from "@/features/assets/types";
import { Button } from "@/components/ui/button";

interface InvestmentListProps {
  investments: Investment[];
  assetsById: Record<string, Asset>;
  onDelete?: (id: string) => void;
}

export function InvestmentList({ investments, assetsById, onDelete }: InvestmentListProps) {
  return (
    <div className="space-y-3">
      {investments.map((investment) => (
        <div
          key={investment.id}
          className="flex items-center justify-between gap-4 rounded-lg border bg-background p-4"
        >
          <div className="space-y-1">
            <div className="text-sm font-medium">
              {assetsById[investment.asset_id]?.name ?? "Unknown asset"}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatShortDate(investment.investment_date)} ·{" "}
              {investment.investment_type === "sip" ? "SIP" : "Lump Sum"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold">
              {formatCurrency(investment.amount, assetsById[investment.asset_id]?.currency)}
            </div>
            {investment.units ? (
              <div className="text-xs text-muted-foreground">
                {investment.units.toFixed(2)} units
              </div>
            ) : null}
          </div>
          {onDelete ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(investment.id)}
            >
              Delete
            </Button>
          ) : null}
        </div>
      ))}
    </div>
  );
}

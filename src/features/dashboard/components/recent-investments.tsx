import { formatCurrency } from "@/lib/utils/format";
import { formatShortDate } from "@/lib/utils/date";
import type { Investment } from "@/features/investments/types";
import type { Asset } from "@/features/assets/types";

interface RecentInvestmentsProps {
  investments: Investment[];
  assetsById: Record<string, Asset>;
}

export function RecentInvestments({ investments, assetsById }: RecentInvestmentsProps) {
  const recent = investments.slice(0, 4);
  return (
    <div className="space-y-3">
      {recent.map((investment) => (
        <div
          key={investment.id}
          className="flex items-center justify-between rounded-lg border bg-background p-3 text-sm"
        >
          <div>
            <div className="font-medium">
              {assetsById[investment.asset_id]?.name ?? "Unknown asset"}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatShortDate(investment.investment_date)}
            </div>
          </div>
          <div className="font-semibold">
            {formatCurrency(investment.amount, assetsById[investment.asset_id]?.currency)}
          </div>
        </div>
      ))}
    </div>
  );
}

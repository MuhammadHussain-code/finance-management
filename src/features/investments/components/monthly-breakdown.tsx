import { formatCurrency } from "@/lib/utils/format";
import { formatMonthLabel } from "@/lib/utils/date";
import type { Investment } from "@/features/investments/types";

interface MonthlyBreakdownProps {
  investments: Investment[];
  currency?: string;
}

export function MonthlyBreakdown({ investments, currency }: MonthlyBreakdownProps) {
  const grouped = investments.reduce<Record<string, Investment[]>>((acc, investment) => {
    const date = new Date(investment.investment_date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    acc[key] = acc[key] ? [...acc[key], investment] : [investment];
    return acc;
  }, {});

  const entries = Object.entries(grouped).sort(([a], [b]) => (a < b ? 1 : -1));

  return (
    <div className="space-y-4">
      {entries.map(([month, items]) => (
        <div key={month} className="rounded-lg border bg-background p-4">
          <div className="text-sm font-semibold">{formatMonthLabel(`${month}-01`)}</div>
          <div className="mt-3 space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span>{item.investment_type === "sip" ? "SIP" : "Lump Sum"}</span>
                <span className="font-medium">{formatCurrency(item.amount, currency)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

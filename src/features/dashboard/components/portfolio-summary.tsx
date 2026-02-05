import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { formatNumber } from "@/lib/utils/format";

interface PortfolioSummaryProps {
  totalInvested: number;
  currentValue: number;
  absoluteReturn: number;
  returnPercentage: number | null;
}

export function PortfolioSummary({
  totalInvested,
  currentValue,
  absoluteReturn,
  returnPercentage,
}: PortfolioSummaryProps) {
  const isPositive = absoluteReturn >= 0;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm text-muted-foreground">Total invested</div>
          <div className="text-2xl font-semibold">
            <CurrencyDisplay value={totalInvested} />
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Current value</div>
          <div className="text-2xl font-semibold">
            <CurrencyDisplay value={currentValue} />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="text-sm text-muted-foreground">Returns</div>
          <div className={`text-lg font-semibold ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
            <CurrencyDisplay value={absoluteReturn} />{" "}
            {returnPercentage !== null ? (
              <span className="text-sm font-medium">
                ({isPositive ? "+" : ""}
                {formatNumber(returnPercentage)}%)
              </span>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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
    <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Portfolio summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-3">
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Total invested</div>
          <div className="text-2xl font-bold tracking-tight">
            <CurrencyDisplay value={totalInvested} />
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Current value</div>
          <div className="text-2xl font-bold tracking-tight text-primary">
            <CurrencyDisplay value={currentValue} />
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Returns</div>
          <div className={`text-2xl font-bold tracking-tight ${isPositive ? "text-positive" : "text-negative"}`}>
            {isPositive ? "+" : ""}
            <CurrencyDisplay value={absoluteReturn} />
            {returnPercentage !== null ? (
              <span className="text-sm font-semibold ml-1.5">
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

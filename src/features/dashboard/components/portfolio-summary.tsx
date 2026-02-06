import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyDisplay } from "@/components/shared/currency-display";

interface PortfolioSummaryProps {
  totalInvested: number;
  totalUnits: number;
}

export function PortfolioSummary({
  totalInvested,
  totalUnits,
}: PortfolioSummaryProps) {
  return (
    <Card className="bg-linear-to-br from-card via-card to-primary/5 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Portfolio summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Total invested</div>
          <div className="text-2xl font-bold tracking-tight">
            <CurrencyDisplay value={totalInvested} />
          </div>
        </div>
        {/* <div className="space-y-1">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Total units</div>
          <div className="text-2xl font-bold tracking-tight text-primary">
            {formatNumber(totalUnits, 4)}
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}

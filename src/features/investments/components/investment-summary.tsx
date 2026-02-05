import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { formatNumber } from "@/lib/utils/format";

interface InvestmentSummaryProps {
  totalInvested: number;
  currentValue: number;
  absoluteReturn: number;
  returnPercentage: number | null;
  xirr: number | null;
}

export function InvestmentSummary({
  totalInvested,
  currentValue,
  absoluteReturn,
  returnPercentage,
  xirr,
}: InvestmentSummaryProps) {
  const isPositive = absoluteReturn >= 0;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm md:grid-cols-2">
        <div>
          <div className="text-muted-foreground">Total invested</div>
          <div className="text-lg font-semibold">
            <CurrencyDisplay value={totalInvested} />
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">Current value</div>
          <div className="text-lg font-semibold">
            <CurrencyDisplay value={currentValue} />
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">Absolute returns</div>
          <div className={`text-lg font-semibold ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
            <CurrencyDisplay value={absoluteReturn} />
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">Return %</div>
          <div className="text-lg font-semibold">
            {returnPercentage !== null ? `${formatNumber(returnPercentage)}%` : "—"}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">XIRR</div>
          <div className="text-lg font-semibold">
            {xirr !== null ? `${formatNumber(xirr * 100)}%` : "—"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

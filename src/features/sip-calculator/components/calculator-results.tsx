import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import type { SipResult } from "@/features/calculations/lib/sip-formula";

interface CalculatorResultsProps {
  result: SipResult;
}

export function CalculatorResults({ result }: CalculatorResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm text-muted-foreground">Total invested</div>
          <div className="text-2xl font-semibold">
            <CurrencyDisplay value={result.totalInvested} />
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Estimated returns</div>
          <div className="text-2xl font-semibold">
            <CurrencyDisplay value={result.estimatedReturns} />
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Final corpus</div>
          <div className="text-2xl font-semibold">
            <CurrencyDisplay value={result.finalCorpus} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          This is a projection only. Actual returns depend on market performance.
        </p>
      </CardContent>
    </Card>
  );
}

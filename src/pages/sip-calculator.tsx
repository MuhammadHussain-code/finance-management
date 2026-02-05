import { lazy, Suspense } from "react";
import { CalculatorForm } from "@/features/sip-calculator/components/calculator-form";
import { CalculatorResults } from "@/features/sip-calculator/components/calculator-results";
import { useSipCalculator } from "@/features/sip-calculator/hooks/use-sip-calculator";

// Lazy load chart for better initial load performance
const SipProjectionChart = lazy(() =>
  import("@/components/charts/sip-projection-chart").then((m) => ({
    default: m.SipProjectionChart,
  })),
);

function ChartSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border bg-card" style={{ height: 360 }}>
      <div className="p-6">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="mt-2 h-3 w-48 rounded bg-muted" />
      </div>
      <div className="px-6 pb-6">
        <div className="h-64 rounded bg-muted" />
      </div>
    </div>
  );
}

export function SipCalculatorPage() {
  const calculator = useSipCalculator();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">SIP calculator</h1>
        <p className="text-sm text-muted-foreground">
          Run a quick projection without saving any data.
        </p>
      </div>

      {/* Input and Results - Side by side on desktop */}
      <div className="grid gap-6 md:grid-cols-2">
        <CalculatorForm
          monthlyInvestment={calculator.monthlyInvestment}
          durationMonths={calculator.durationMonths}
          expectedAnnualReturn={calculator.expectedAnnualReturn}
          onMonthlyInvestmentChange={calculator.setMonthlyInvestment}
          onDurationMonthsChange={calculator.setDurationMonths}
          onExpectedAnnualReturnChange={calculator.setExpectedAnnualReturn}
        />
        <CalculatorResults result={calculator.result} />
      </div>

      {/* Projection Chart - Live updates as inputs change */}
      <Suspense fallback={<ChartSkeleton />}>
        <SipProjectionChart
          monthlyInvestment={calculator.monthlyInvestment}
          durationMonths={calculator.durationMonths}
          expectedAnnualReturn={calculator.expectedAnnualReturn}
          height={280}
        />
      </Suspense>

      <p className="text-center text-xs text-muted-foreground">
        This calculator provides estimates based on assumed constant returns.
        Actual market returns vary and past performance does not guarantee future results.
      </p>
    </div>
  );
}

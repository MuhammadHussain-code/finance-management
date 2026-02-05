import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Maximum monthly investment: 10 crore (100 million) */
const MAX_MONTHLY_INVESTMENT = 100_000_000;
/** Minimum monthly investment */
const MIN_MONTHLY_INVESTMENT = 500;
/** Maximum duration: 50 years (600 months) */
const MAX_DURATION_MONTHS = 600;
/** Minimum duration */
const MIN_DURATION_MONTHS = 1;
/** Maximum annual return: 50% */
const MAX_ANNUAL_RETURN_PERCENT = 50;
/** Minimum annual return */
const MIN_ANNUAL_RETURN_PERCENT = 0;

interface CalculatorFormProps {
  monthlyInvestment: number;
  durationMonths: number;
  expectedAnnualReturn: number;
  onMonthlyInvestmentChange: (value: number) => void;
  onDurationMonthsChange: (value: number) => void;
  onExpectedAnnualReturnChange: (value: number) => void;
}

/**
 * Clamps a value between min and max bounds
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function CalculatorForm({
  monthlyInvestment,
  durationMonths,
  expectedAnnualReturn,
  onMonthlyInvestmentChange,
  onDurationMonthsChange,
  onExpectedAnnualReturnChange,
}: CalculatorFormProps) {
  const handleMonthlyInvestmentChange = (value: number) => {
    if (Number.isNaN(value)) return;
    onMonthlyInvestmentChange(clamp(value, MIN_MONTHLY_INVESTMENT, MAX_MONTHLY_INVESTMENT));
  };

  const handleDurationChange = (value: number) => {
    if (Number.isNaN(value)) return;
    onDurationMonthsChange(clamp(Math.floor(value), MIN_DURATION_MONTHS, MAX_DURATION_MONTHS));
  };

  const handleReturnChange = (value: number) => {
    if (Number.isNaN(value)) return;
    const clampedPercent = clamp(value, MIN_ANNUAL_RETURN_PERCENT, MAX_ANNUAL_RETURN_PERCENT);
    onExpectedAnnualReturnChange(clampedPercent / 100);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="monthly">Monthly investment</Label>
        <Input
          id="monthly"
          type="number"
          min={MIN_MONTHLY_INVESTMENT}
          max={MAX_MONTHLY_INVESTMENT}
          value={monthlyInvestment}
          onChange={(event) => handleMonthlyInvestmentChange(Number(event.target.value))}
        />
        <p className="text-xs text-muted-foreground">
          Max: {MAX_MONTHLY_INVESTMENT.toLocaleString()}
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="duration">Duration (months)</Label>
        <Input
          id="duration"
          type="number"
          min={MIN_DURATION_MONTHS}
          max={MAX_DURATION_MONTHS}
          value={durationMonths}
          onChange={(event) => handleDurationChange(Number(event.target.value))}
        />
        <p className="text-xs text-muted-foreground">
          Max: {MAX_DURATION_MONTHS} months ({MAX_DURATION_MONTHS / 12} years)
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="return">Expected return (annual %)</Label>
        <Input
          id="return"
          type="number"
          min={MIN_ANNUAL_RETURN_PERCENT}
          max={MAX_ANNUAL_RETURN_PERCENT}
          step="0.1"
          value={(expectedAnnualReturn * 100).toFixed(2)}
          onChange={(event) => handleReturnChange(Number(event.target.value))}
        />
        <p className="text-xs text-muted-foreground">
          Max: {MAX_ANNUAL_RETURN_PERCENT}%
        </p>
      </div>
    </div>
  );
}

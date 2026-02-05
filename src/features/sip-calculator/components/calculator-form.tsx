import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CalculatorFormProps {
  monthlyInvestment: number;
  durationMonths: number;
  expectedAnnualReturn: number;
  onMonthlyInvestmentChange: (value: number) => void;
  onDurationMonthsChange: (value: number) => void;
  onExpectedAnnualReturnChange: (value: number) => void;
}

export function CalculatorForm({
  monthlyInvestment,
  durationMonths,
  expectedAnnualReturn,
  onMonthlyInvestmentChange,
  onDurationMonthsChange,
  onExpectedAnnualReturnChange,
}: CalculatorFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="monthly">Monthly investment</Label>
        <Input
          id="monthly"
          type="number"
          value={monthlyInvestment}
          onChange={(event) => onMonthlyInvestmentChange(Number(event.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="duration">Duration (months)</Label>
        <Input
          id="duration"
          type="number"
          value={durationMonths}
          onChange={(event) => onDurationMonthsChange(Number(event.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="return">Expected return (annual %)</Label>
        <Input
          id="return"
          type="number"
          step="0.1"
          value={(expectedAnnualReturn * 100).toFixed(2)}
          onChange={(event) =>
            onExpectedAnnualReturnChange(Number(event.target.value) / 100)
          }
        />
      </div>
    </div>
  );
}

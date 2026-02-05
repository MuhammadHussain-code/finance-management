import { useMemo, useState } from "react";
import { calculateSip } from "@/features/calculations/lib/sip-formula";

export function useSipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [durationMonths, setDurationMonths] = useState(120);
  const [expectedAnnualReturn, setExpectedAnnualReturn] = useState(0.12);

  const result = useMemo(
    () => calculateSip({ monthlyInvestment, durationMonths, expectedAnnualReturn }),
    [monthlyInvestment, durationMonths, expectedAnnualReturn],
  );

  return {
    monthlyInvestment,
    durationMonths,
    expectedAnnualReturn,
    setMonthlyInvestment,
    setDurationMonths,
    setExpectedAnnualReturn,
    result,
  };
}

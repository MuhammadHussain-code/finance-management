import type { Investment } from "@/features/investments/types";
import { getTotalUnits } from "@/features/calculations/lib/investment-units";

export interface ReturnMetrics {
  totalInvested: number;
  totalUnits: number;
  currentValue: number;
  absoluteReturn: number;
  returnPercentage: number | null;
}

export function calculateReturnMetrics(
  investments: Investment[],
  latestPrice?: number,
): ReturnMetrics {
  const totalInvested = investments.reduce((sum, item) => sum + item.amount, 0);
  const totalUnits = getTotalUnits(investments);
  const hasLatestPrice =
    typeof latestPrice === "number" && Number.isFinite(latestPrice) && latestPrice > 0;
  const hasValuation = hasLatestPrice && totalUnits > 0;
  const currentValue = hasValuation ? totalUnits * latestPrice : 0;
  const absoluteReturn = hasValuation ? currentValue - totalInvested : 0;
  const returnPercentage =
    hasValuation && totalInvested > 0 ? (absoluteReturn / totalInvested) * 100 : null;

  return {
    totalInvested,
    totalUnits,
    currentValue,
    absoluteReturn,
    returnPercentage,
  };
}

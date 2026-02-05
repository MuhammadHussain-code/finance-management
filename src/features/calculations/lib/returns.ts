import type { Investment } from "@/features/investments/types";

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
  const totalUnits = investments.reduce(
    (sum, item) => sum + (item.units ?? 0),
    0,
  );
  const currentValue = latestPrice ? totalUnits * latestPrice : 0;
  const absoluteReturn = currentValue - totalInvested;
  const returnPercentage =
    totalInvested > 0 ? (absoluteReturn / totalInvested) * 100 : null;

  return {
    totalInvested,
    totalUnits,
    currentValue,
    absoluteReturn,
    returnPercentage,
  };
}

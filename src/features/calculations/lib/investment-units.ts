import type { Investment } from "@/features/investments/types";

export function getInvestmentUnits(investment: Investment): number {
  if (investment.units !== null && investment.units !== undefined) {
    return Number(investment.units) || 0;
  }

  const pricePerUnit = investment.price_per_unit ?? 0;
  if (pricePerUnit > 0) {
    return investment.amount / pricePerUnit;
  }

  return 0;
}

export function getTotalUnits(investments: Investment[]): number {
  return investments.reduce((sum, investment) => sum + getInvestmentUnits(investment), 0);
}

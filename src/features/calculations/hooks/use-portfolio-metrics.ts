import { useMemo } from "react";
import { calculateReturnMetrics } from "@/features/calculations/lib/returns";
import { calculateXirr } from "@/features/calculations/lib/xirr";
import type { Investment } from "@/features/investments/types";

export function usePortfolioMetrics(investments: Investment[], latestPrice?: number) {
  return useMemo(() => {
    const metrics = calculateReturnMetrics(investments, latestPrice);
    const cashFlows = investments.map((investment) => ({
      amount: -investment.amount,
      date: new Date(investment.investment_date),
    }));

    if (metrics.currentValue > 0) {
      cashFlows.push({ amount: metrics.currentValue, date: new Date() });
    }

    const xirr = calculateXirr(cashFlows);

    return {
      ...metrics,
      xirr,
    };
  }, [investments, latestPrice]);
}

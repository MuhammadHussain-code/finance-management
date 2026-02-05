export interface CashFlow {
  amount: number;
  date: Date;
}

export function calculateXirr(cashFlows: CashFlow[], guess = 0.1) {
  if (cashFlows.length < 2) return null;

  const hasPositive = cashFlows.some((flow) => flow.amount > 0);
  const hasNegative = cashFlows.some((flow) => flow.amount < 0);
  if (!hasPositive || !hasNegative) return null;

  const startDate = cashFlows[0].date;
  const maxIterations = 100;
  const tolerance = 1e-7;
  const daysInYear = 365;

  const npv = (rate: number) =>
    cashFlows.reduce((sum, flow) => {
      const years =
        (flow.date.getTime() - startDate.getTime()) /
        (daysInYear * 24 * 60 * 60 * 1000);
      return sum + flow.amount / Math.pow(1 + rate, years);
    }, 0);

  const npvDerivative = (rate: number) =>
    cashFlows.reduce((sum, flow) => {
      const years =
        (flow.date.getTime() - startDate.getTime()) /
        (daysInYear * 24 * 60 * 60 * 1000);
      return sum - (years * flow.amount) / Math.pow(1 + rate, years + 1);
    }, 0);

  let rate = guess;
  for (let i = 0; i < maxIterations; i += 1) {
    const value = npv(rate);
    if (Math.abs(value) < tolerance) {
      return rate;
    }
    const derivative = npvDerivative(rate);
    if (derivative === 0) break;
    rate -= value / derivative;
  }

  return null;
}

import type { Investment } from "@/features/investments/types";
import type { Asset } from "@/features/assets/types";

/**
 * Chart color tokens - matches CSS variables for consistency
 */
export const chartColors = {
  invested: "var(--chart-invested)",
  value: "var(--chart-value)",
  positive: "var(--chart-positive)",
  negative: "var(--chart-negative)",
  muted: "var(--chart-muted)",
  accent1: "var(--chart-accent-1)",
  accent2: "var(--chart-accent-2)",
  accent3: "var(--chart-accent-3)",
  accent4: "var(--chart-accent-4)",
  accent5: "var(--chart-accent-5)",
} as const;

/**
 * Category colors for asset allocation chart
 */
export const categoryColors: Record<string, string> = {
  mutual_fund: chartColors.value,
  etf: chartColors.accent2,
  stock: chartColors.accent1,
  crypto: chartColors.accent3,
  other: chartColors.accent4,
};

// ============================================================================
// PORTFOLIO GROWTH DATA
// ============================================================================

export interface PortfolioGrowthDataPoint {
  month: string; // YYYY-MM format
  invested: number;
  value: number;
  gainLoss: number;
}

interface PricesByAsset {
  [assetId: string]: { price: number; price_date: string }[];
}

/**
 * Aggregates investment data into monthly portfolio growth data points.
 * Shows cumulative invested amount and estimated value over time.
 */
export function calculatePortfolioGrowthData(
  investments: Investment[],
  latestPrices: Record<string, { price: number }>,
  priceHistory?: PricesByAsset,
): PortfolioGrowthDataPoint[] {
  if (investments.length === 0) return [];

  // Sort investments by date
  const sorted = [...investments].sort(
    (a, b) =>
      new Date(a.investment_date).getTime() -
      new Date(b.investment_date).getTime(),
  );

  // Group investments by month
  const monthlyInvestments = new Map<
    string,
    { invested: number; unitsByAsset: Map<string, number> }
  >();

  for (const inv of sorted) {
    const month = inv.investment_date.slice(0, 7); // YYYY-MM
    const existing = monthlyInvestments.get(month) ?? {
      invested: 0,
      unitsByAsset: new Map<string, number>(),
    };

    existing.invested += inv.amount;
    const currentUnits = existing.unitsByAsset.get(inv.asset_id) ?? 0;
    existing.unitsByAsset.set(inv.asset_id, currentUnits + (inv.units ?? 0));
    monthlyInvestments.set(month, existing);
  }

  // Generate all months from first investment to now
  const months = Array.from(monthlyInvestments.keys()).sort();
  if (months.length === 0) return [];

  const firstMonth = months[0];
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const allMonths: string[] = [];
  let [year, month] = firstMonth.split("-").map(Number);

  while (`${year}-${String(month).padStart(2, "0")}` <= currentMonth) {
    allMonths.push(`${year}-${String(month).padStart(2, "0")}`);
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }

  // Calculate cumulative values for each month
  let cumulativeInvested = 0;
  const cumulativeUnits = new Map<string, number>();

  const result: PortfolioGrowthDataPoint[] = [];

  for (const m of allMonths) {
    const monthData = monthlyInvestments.get(m);

    if (monthData) {
      cumulativeInvested += monthData.invested;
      for (const [assetId, units] of monthData.unitsByAsset) {
        const current = cumulativeUnits.get(assetId) ?? 0;
        cumulativeUnits.set(assetId, current + units);
      }
    }

    // Calculate value using latest prices (simplified - ideally use historical prices)
    let value = 0;
    for (const [assetId, units] of cumulativeUnits) {
      // Try to find historical price for this month, otherwise use latest
      const historicalPrice = priceHistory?.[assetId]?.find(
        (p) => p.price_date.slice(0, 7) <= m,
      );
      const price = historicalPrice?.price ?? latestPrices[assetId]?.price ?? 0;
      value += units * price;
    }

    // If no price data, estimate value as invested (for early months)
    if (value === 0 && cumulativeInvested > 0) {
      value = cumulativeInvested;
    }

    result.push({
      month: m,
      invested: Math.round(cumulativeInvested * 100) / 100,
      value: Math.round(value * 100) / 100,
      gainLoss: Math.round((value - cumulativeInvested) * 100) / 100,
    });
  }

  return result;
}

// ============================================================================
// SIP CONTRIBUTIONS TIMELINE DATA
// ============================================================================

export interface SipContributionDataPoint {
  month: string; // YYYY-MM format
  amount: number;
  count: number; // Number of SIP contributions that month
}

/**
 * Aggregates SIP contributions by month for timeline visualization.
 * Empty months are included to show gaps in contributions.
 */
export function calculateSipContributionsData(
  investments: Investment[],
): SipContributionDataPoint[] {
  // Filter only SIP investments
  const sipInvestments = investments.filter(
    (inv) => inv.investment_type === "sip",
  );
  if (sipInvestments.length === 0) return [];

  // Sort by date
  const sorted = [...sipInvestments].sort(
    (a, b) =>
      new Date(a.investment_date).getTime() -
      new Date(b.investment_date).getTime(),
  );

  // Group by month
  const monthlyContributions = new Map<string, { amount: number; count: number }>();

  for (const inv of sorted) {
    const month = inv.investment_date.slice(0, 7);
    const existing = monthlyContributions.get(month) ?? { amount: 0, count: 0 };
    existing.amount += inv.amount;
    existing.count += 1;
    monthlyContributions.set(month, existing);
  }

  // Generate all months from first to last/current
  const months = Array.from(monthlyContributions.keys()).sort();
  const firstMonth = months[0];
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const allMonths: string[] = [];
  let [year, month] = firstMonth.split("-").map(Number);

  while (`${year}-${String(month).padStart(2, "0")}` <= currentMonth) {
    allMonths.push(`${year}-${String(month).padStart(2, "0")}`);
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }

  return allMonths.map((m) => ({
    month: m,
    amount: monthlyContributions.get(m)?.amount ?? 0,
    count: monthlyContributions.get(m)?.count ?? 0,
  }));
}

// ============================================================================
// ASSET ALLOCATION DATA
// ============================================================================

export interface AssetAllocationDataPoint {
  category: string;
  categoryLabel: string;
  value: number;
  percentage: number;
  color: string;
}

/**
 * Calculates asset allocation breakdown by category.
 */
export function calculateAssetAllocationData(
  assets: Asset[],
  investments: Investment[],
  latestPrices: Record<string, { price: number }>,
): AssetAllocationDataPoint[] {
  // Group investments by asset
  const investmentsByAsset = investments.reduce<Record<string, Investment[]>>(
    (acc, inv) => {
      acc[inv.asset_id] = acc[inv.asset_id] ?? [];
      acc[inv.asset_id].push(inv);
      return acc;
    },
    {},
  );

  // Calculate value by category
  const categoryValues = new Map<string, number>();
  const categoryLabels: Record<string, string> = {
    mutual_fund: "Mutual Fund",
    etf: "ETF",
    stock: "Stock",
    crypto: "Cryptocurrency",
    other: "Other",
  };

  for (const asset of assets) {
    const assetInvestments = investmentsByAsset[asset.id] ?? [];
    const totalUnits = assetInvestments.reduce(
      (sum, inv) => sum + (inv.units ?? 0),
      0,
    );
    const latestPrice = latestPrices[asset.id]?.price ?? 0;
    const value = totalUnits * latestPrice;

    if (value > 0) {
      const current = categoryValues.get(asset.category_id) ?? 0;
      categoryValues.set(asset.category_id, current + value);
    }
  }

  const totalValue = Array.from(categoryValues.values()).reduce(
    (sum, v) => sum + v,
    0,
  );
  if (totalValue === 0) return [];

  const result: AssetAllocationDataPoint[] = [];
  const colorArray = [
    chartColors.value,
    chartColors.accent2,
    chartColors.accent1,
    chartColors.accent3,
    chartColors.accent4,
    chartColors.accent5,
  ];

  let colorIndex = 0;
  for (const [category, value] of categoryValues) {
    result.push({
      category,
      categoryLabel: categoryLabels[category] ?? category,
      value: Math.round(value * 100) / 100,
      percentage: Math.round((value / totalValue) * 1000) / 10,
      color: categoryColors[category] ?? colorArray[colorIndex % colorArray.length],
    });
    colorIndex++;
  }

  // Sort by value descending
  return result.sort((a, b) => b.value - a.value);
}

// ============================================================================
// SIP CALCULATOR PROJECTION DATA
// ============================================================================

export interface SipProjectionDataPoint {
  month: number;
  invested: number;
  projected: number;
}

/**
 * Generates monthly projection data for SIP calculator visualization.
 */
export function calculateSipProjectionData(
  monthlyInvestment: number,
  durationMonths: number,
  expectedAnnualReturn: number,
): SipProjectionDataPoint[] {
  if (monthlyInvestment <= 0 || durationMonths <= 0) return [];

  const monthlyRate = expectedAnnualReturn / 12;
  const result: SipProjectionDataPoint[] = [];

  // Generate data points (monthly for first year, then quarterly/yearly for longer durations)
  const interval = durationMonths <= 24 ? 1 : durationMonths <= 60 ? 3 : 6;

  for (let month = 0; month <= durationMonths; month += interval) {
    const invested = monthlyInvestment * month;
    let projected = 0;

    if (monthlyRate === 0) {
      projected = invested;
    } else if (month > 0) {
      projected =
        monthlyInvestment *
        ((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate) *
        (1 + monthlyRate);
    }

    result.push({
      month,
      invested: Math.round(invested * 100) / 100,
      projected: Math.round(projected * 100) / 100,
    });
  }

  // Ensure we have the final month
  if (result[result.length - 1]?.month !== durationMonths) {
    const invested = monthlyInvestment * durationMonths;
    const projected =
      monthlyRate === 0
        ? invested
        : monthlyInvestment *
          ((Math.pow(1 + monthlyRate, durationMonths) - 1) / monthlyRate) *
          (1 + monthlyRate);

    result.push({
      month: durationMonths,
      invested: Math.round(invested * 100) / 100,
      projected: Math.round(projected * 100) / 100,
    });
  }

  return result;
}

// ============================================================================
// TIME RANGE FILTERING
// ============================================================================

export type TimeRange = "6M" | "1Y" | "ALL";

/**
 * Filters data points to the specified time range.
 */
export function filterByTimeRange<T extends { month: string }>(
  data: T[],
  range: TimeRange,
): T[] {
  if (range === "ALL" || data.length === 0) return data;

  const now = new Date();
  let cutoffDate: Date;

  if (range === "6M") {
    cutoffDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  } else {
    cutoffDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
  }

  const cutoffMonth = `${cutoffDate.getFullYear()}-${String(cutoffDate.getMonth() + 1).padStart(2, "0")}`;

  return data.filter((d) => d.month >= cutoffMonth);
}

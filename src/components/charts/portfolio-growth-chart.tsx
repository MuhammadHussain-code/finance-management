"use client";

import { memo, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartContainer } from "./chart-container";
import { ChartTooltip } from "./chart-tooltip";
import { formatMonthLabel } from "@/lib/utils/date";
import { TimeRangeToggle } from "./time-range-toggle";
import {
  chartColors,
  filterByTimeRange,
  type PortfolioGrowthDataPoint,
  type TimeRange,
} from "@/features/calculations/lib/chart-data";
import { formatCurrency, formatCompactNumber } from "@/lib/utils/format";

interface PortfolioGrowthChartProps {
  data: PortfolioGrowthDataPoint[];
  className?: string;
  height?: number;
}

/**
 * Line chart showing portfolio growth over time.
 * Displays total invested vs current value with gain/loss indication.
 */
export const PortfolioGrowthChart = memo(function PortfolioGrowthChart({
  data,
  className,
  height = 300,
}: PortfolioGrowthChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("ALL");

  const filteredData = useMemo(
    () => filterByTimeRange(data, timeRange),
    [data, timeRange],
  );

  const isEmpty = filteredData.length === 0;

  return (
    <ChartContainer
      title="Portfolio growth"
      description="Track your investment growth over time"
      className={className}
      height={height}
      isEmpty={isEmpty}
      emptyState={
        <div className="text-muted-foreground">
          <p className="text-sm">No investment data yet</p>
          <p className="mt-1 text-xs">
            Add your first investment to see growth trends
          </p>
        </div>
      }
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-end mb-2">
          <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--chart-muted)"
                opacity={0.5}
              />
              <XAxis
                dataKey="month"
                tickFormatter={(month) => {
                  const [, m] = month.split("-");
                  return new Date(2000, Number(m) - 1).toLocaleDateString(
                    "en-US",
                    { month: "short" },
                  );
                }}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={(value) => formatCompactNumber(value)}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                width={50}
              />
              <Tooltip
                content={({ active, payload, label }) => (
                  <ChartTooltip
                    active={active}
                    payload={payload as ChartTooltip["payload"]}
                    label={label}
                    labelFormatter={formatMonthLabel}
                    additionalContent={(p) => {
                      if (!p || p.length < 2) return null;
                      const invested = p.find((e) => e.dataKey === "invested")?.value ?? 0;
                      const value = p.find((e) => e.dataKey === "value")?.value ?? 0;
                      const gainLoss = value - invested;
                      const isPositive = gainLoss >= 0;
                      return (
                        <p
                          className={`text-sm font-medium ${isPositive ? "text-chart-positive" : "text-chart-negative"}`}
                          style={{
                            color: isPositive
                              ? "var(--chart-positive)"
                              : "var(--chart-negative)",
                          }}
                        >
                          {isPositive ? "+" : ""}
                          {formatCurrency(gainLoss)} (
                          {invested > 0
                            ? `${isPositive ? "+" : ""}${((gainLoss / invested) * 100).toFixed(1)}%`
                            : "0%"}
                          )
                        </p>
                      );
                    }}
                  />
                )}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) =>
                  value === "invested" ? "Total Invested" : "Current Value"
                }
              />
              <Line
                type="monotone"
                dataKey="invested"
                name="invested"
                stroke={chartColors.invested}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                animationDuration={300}
              />
              <Line
                type="monotone"
                dataKey="value"
                name="value"
                stroke={chartColors.value}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0 }}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ChartContainer>
  );
});

// Type helper for ChartTooltip payload
type ChartTooltip = {
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
};

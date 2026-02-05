"use client";

import { memo, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartContainer } from "./chart-container";
import { ChartTooltip } from "./chart-tooltip";
import { formatMonthLabel } from "@/lib/utils/date";
import {
  chartColors,
  type SipContributionDataPoint,
} from "@/features/calculations/lib/chart-data";
import { formatCompactNumber } from "@/lib/utils/format";

interface SipContributionsChartProps {
  data: SipContributionDataPoint[];
  className?: string;
  height?: number;
}

/**
 * Bar chart showing SIP contributions over time.
 * Highlights gaps in contribution consistency.
 */
export const SipContributionsChart = memo(function SipContributionsChart({
  data,
  className,
  height = 250,
}: SipContributionsChartProps) {
  // Limit to last 12 months for better visibility
  const displayData = useMemo(() => {
    return data.slice(-12);
  }, [data]);

  const isEmpty = displayData.length === 0;
  const hasGaps = displayData.some((d) => d.amount === 0);

  return (
    <ChartContainer
      title="SIP contributions"
      description={
        hasGaps
          ? "Some months have gaps in contributions"
          : "Monthly SIP investment timeline"
      }
      className={className}
      height={height}
      isEmpty={isEmpty}
      emptyState={
        <div className="text-muted-foreground">
          <p className="text-sm">No SIP contributions yet</p>
          <p className="mt-1 text-xs">
            Add SIP investments to track your consistency
          </p>
        </div>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={displayData}
          margin={{ top: 10, right: 5, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--chart-muted)"
            opacity={0.5}
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tickFormatter={(month) => {
              const [, m] = month.split("-");
              return new Date(2000, Number(m) - 1).toLocaleDateString("en-US", {
                month: "short",
              });
            }}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(value) => formatCompactNumber(value)}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            width={45}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltip
                active={active}
                payload={payload as ChartTooltipPayload}
                label={label}
                labelFormatter={formatMonthLabel}
                additionalContent={(p) => {
                  const count = (p?.[0] as unknown as { payload?: { count?: number } })?.payload?.count ?? 0;
                  if (count === 0) {
                    return (
                      <p className="text-xs text-muted-foreground">
                        No SIP this month
                      </p>
                    );
                  }
                  return (
                    <p className="text-xs text-muted-foreground">
                      {count} contribution{count > 1 ? "s" : ""}
                    </p>
                  );
                }}
              />
            )}
            cursor={{ fill: "var(--chart-muted)", opacity: 0.3 }}
          />
          <Bar
            dataKey="amount"
            name="SIP Amount"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
            animationDuration={300}
          >
            {displayData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.amount === 0 ? chartColors.muted : chartColors.value
                }
                opacity={entry.amount === 0 ? 0.3 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
});

type ChartTooltipPayload = Array<{
  name: string;
  value: number;
  color: string;
  dataKey: string;
}>;

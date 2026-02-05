"use client";

import { memo, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartContainer } from "./chart-container";
import { ChartTooltip } from "./chart-tooltip";
import {
  chartColors,
  calculateSipProjectionData,
} from "@/features/calculations/lib/chart-data";
import { formatCurrency, formatCompactNumber } from "@/lib/utils/format";

interface SipProjectionChartProps {
  monthlyInvestment: number;
  durationMonths: number;
  expectedAnnualReturn: number;
  className?: string;
  height?: number;
}

/**
 * Area chart showing SIP projection over time.
 * Updates live as calculator inputs change.
 * Non-persistent, educational visualization.
 */
export const SipProjectionChart = memo(function SipProjectionChart({
  monthlyInvestment,
  durationMonths,
  expectedAnnualReturn,
  className,
  height = 280,
}: SipProjectionChartProps) {
  const data = useMemo(
    () =>
      calculateSipProjectionData(
        monthlyInvestment,
        durationMonths,
        expectedAnnualReturn,
      ),
    [monthlyInvestment, durationMonths, expectedAnnualReturn],
  );

  const isEmpty = data.length === 0;

  // Format month number to years/months label
  const formatMonthAxis = (month: number): string => {
    if (month === 0) return "0";
    if (month % 12 === 0) return `${month / 12}Y`;
    if (durationMonths <= 24) return `${month}M`;
    return `${Math.floor(month / 12)}Y`;
  };

  return (
    <ChartContainer
      title="Projection chart"
      description="Estimated growth over time"
      className={className}
      height={height}
      isEmpty={isEmpty}
      emptyState={
        <div className="text-muted-foreground">
          <p className="text-sm">Enter values to see projection</p>
        </div>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 5, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={chartColors.invested}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={chartColors.invested}
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={chartColors.value}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={chartColors.value}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--chart-muted)"
            opacity={0.5}
          />
          <XAxis
            dataKey="month"
            tickFormatter={formatMonthAxis}
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
            width={55}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltip
                active={active}
                payload={payload as ChartTooltipPayload}
                label={String(label)}
                labelFormatter={(month) => {
                  const m = Number(month);
                  if (m === 0) return "Start";
                  const years = Math.floor(m / 12);
                  const months = m % 12;
                  if (years === 0) return `${months} month${months > 1 ? "s" : ""}`;
                  if (months === 0) return `${years} year${years > 1 ? "s" : ""}`;
                  return `${years}Y ${months}M`;
                }}
                additionalContent={(p) => {
                  if (!p || p.length < 2) return null;
                  const invested =
                    p.find((e) => e.dataKey === "invested")?.value ?? 0;
                  const projected =
                    p.find((e) => e.dataKey === "projected")?.value ?? 0;
                  const returns = projected - invested;
                  return (
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--chart-positive)" }}
                    >
                      Est. Returns: {formatCurrency(returns)}
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
              value === "invested" ? "Total Invested" : "Projected Value"
            }
          />
          <Area
            type="monotone"
            dataKey="invested"
            name="invested"
            stroke={chartColors.invested}
            strokeWidth={2}
            fill="url(#colorInvested)"
            animationDuration={300}
          />
          <Area
            type="monotone"
            dataKey="projected"
            name="projected"
            stroke={chartColors.value}
            strokeWidth={2.5}
            fill="url(#colorProjected)"
            animationDuration={300}
          />
        </AreaChart>
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

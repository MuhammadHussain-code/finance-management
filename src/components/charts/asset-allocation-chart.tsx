"use client";

import { memo, type ReactNode } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { ChartContainer } from "./chart-container";
import type { AssetAllocationDataPoint } from "@/features/calculations/lib/chart-data";
import { formatCurrency } from "@/lib/utils/format";

interface AssetAllocationChartProps {
  data: AssetAllocationDataPoint[];
  className?: string;
  height?: number;
  title?: string;
  description?: string;
  emptyState?: ReactNode;
}

// Custom tooltip component - defined outside to avoid recreation during render
function AllocationTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: AssetAllocationDataPoint }>;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0].payload;
  return (
    <div
      className="rounded-lg border bg-background p-3 shadow-lg"
      role="tooltip"
    >
      <div className="flex items-center gap-2">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: item.color }}
        />
        <span className="font-medium">{item.categoryLabel}</span>
      </div>
      <div className="mt-2 space-y-1 text-sm">
        <p>
          <span className="text-muted-foreground">Value:</span>{" "}
          <span className="font-medium">{formatCurrency(item.value)}</span>
        </p>
        <p>
          <span className="text-muted-foreground">Allocation:</span>{" "}
          <span className="font-medium">{item.percentage.toFixed(1)}%</span>
        </p>
      </div>
    </div>
  );
}

// Custom legend component - defined outside to avoid recreation during render
function AllocationLegend({
  payload,
}: {
  payload?: Array<{ value: string; color: string; payload: AssetAllocationDataPoint }>;
}) {
  if (!payload) return null;

  return (
    <ul className="flex flex-col gap-2 text-sm">
      {payload.map((entry, index) => (
        <li key={`legend-${index}`} className="flex items-center gap-2">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="truncate text-muted-foreground">
            {entry.value}
          </span>
          <span className="ml-auto font-medium">
            {entry.payload.percentage.toFixed(1)}%
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Donut chart showing asset allocation by category.
 * Includes legend with percentages and absolute values.
 */
export const AssetAllocationChart = memo(function AssetAllocationChart({
  data,
  className,
  height = 250,
  title,
  description,
  emptyState,
}: AssetAllocationChartProps) {
  const isEmpty = data.length === 0;
  const resolvedTitle = title ?? "Asset allocation";
  const resolvedDescription = description ?? "Portfolio composition by category";
  const resolvedEmptyState = emptyState ?? (
    <div className="text-muted-foreground">
      <p className="text-sm">No allocation data yet</p>
      <p className="mt-1 text-xs">
        Add investments with current prices to see allocation
      </p>
    </div>
  );

  return (
    <ChartContainer
      title={resolvedTitle}
      description={resolvedDescription}
      className={className}
      height={height}
      isEmpty={isEmpty}
      emptyState={resolvedEmptyState}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="35%"
            cy="50%"
            innerRadius="50%"
            outerRadius="80%"
            paddingAngle={2}
            dataKey="value"
            nameKey="categoryLabel"
            animationDuration={300}
            stroke="var(--background)"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<AllocationTooltip />} />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            content={<AllocationLegend />}
            wrapperStyle={{
              paddingLeft: "20px",
              width: "45%",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
});

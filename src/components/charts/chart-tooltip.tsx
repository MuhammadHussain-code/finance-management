"use client";

import { memo } from "react";
import { formatCurrency } from "@/lib/utils/format";

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string | number;
  /** Custom label formatter */
  labelFormatter?: (label: string) => string;
  /** Custom value formatter */
  valueFormatter?: (value: number, name: string) => string;
  /** Additional content to show */
  additionalContent?: (payload: ChartTooltipProps["payload"]) => React.ReactNode;
}

/**
 * Custom tooltip component for charts with finance-grade styling.
 * Accessible and touch-friendly.
 */
export const ChartTooltip = memo(function ChartTooltip({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
  additionalContent,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const normalizedLabel = label ?? "";
  const formattedLabel = labelFormatter
    ? labelFormatter(String(normalizedLabel))
    : label !== undefined
      ? String(label)
      : undefined;

  return (
    <div
      className="rounded-lg border bg-background p-3 shadow-lg"
      role="tooltip"
      aria-live="polite"
    >
      {formattedLabel && (
        <p className="mb-2 text-sm font-medium text-foreground">
          {formattedLabel}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => {
          const formattedValue = valueFormatter
            ? valueFormatter(entry.value, entry.name)
            : formatCurrency(entry.value);

          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: entry.color }}
                aria-hidden="true"
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">{formattedValue}</span>
            </div>
          );
        })}
      </div>
      {additionalContent && (
        <div className="mt-2 border-t pt-2">{additionalContent(payload)}</div>
      )}
    </div>
  );
});

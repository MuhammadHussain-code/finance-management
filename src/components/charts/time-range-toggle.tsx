"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { TimeRange } from "@/features/calculations/lib/chart-data";

interface TimeRangeToggleProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  className?: string;
}

const ranges: { value: TimeRange; label: string }[] = [
  { value: "6M", label: "6M" },
  { value: "1Y", label: "1Y" },
  { value: "ALL", label: "All" },
];

/**
 * Toggle button group for selecting chart time range.
 */
export const TimeRangeToggle = memo(function TimeRangeToggle({
  value,
  onChange,
  className,
}: TimeRangeToggleProps) {
  return (
    <div
      className={cn("flex gap-1 rounded-lg bg-muted p-1", className)}
      role="group"
      aria-label="Time range"
    >
      {ranges.map((range) => (
        <Button
          key={range.value}
          variant="ghost"
          size="sm"
          onClick={() => onChange(range.value)}
          className={cn(
            "h-7 px-3 text-xs font-medium transition-all",
            value === range.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
          aria-pressed={value === range.value}
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
});

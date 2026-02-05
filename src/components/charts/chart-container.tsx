"use client";

import { memo, type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

interface ChartContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  /** Height in pixels for the chart area */
  height?: number;
  /** Empty state content when there's no data */
  emptyState?: ReactNode;
  /** Whether data is empty */
  isEmpty?: boolean;
}

/**
 * Reusable chart container with consistent styling.
 * Provides card wrapper, title, and empty state handling.
 */
export const ChartContainer = memo(function ChartContainer({
  title,
  description,
  children,
  className,
  height = 300,
  emptyState,
  isEmpty = false,
}: ChartContainerProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {isEmpty && emptyState ? (
          <div
            className="flex items-center justify-center text-center"
            style={{ height }}
          >
            {emptyState}
          </div>
        ) : (
          <div style={{ height }} className="w-full">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

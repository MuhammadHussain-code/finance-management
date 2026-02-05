import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface CurrencyDisplayProps {
  value: number;
  currency?: string | null;
  className?: string;
}

export function CurrencyDisplay({ value, currency, className }: CurrencyDisplayProps) {
  return <span className={cn("tabular-nums", className)}>{formatCurrency(value, currency)}</span>;
}

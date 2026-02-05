import { formatCurrency } from "@/lib/utils/format";

interface CurrencyDisplayProps {
  value: number;
  currency?: string;
  className?: string;
}

export function CurrencyDisplay({ value, currency, className }: CurrencyDisplayProps) {
  return <span className={className}>{formatCurrency(value, currency)}</span>;
}

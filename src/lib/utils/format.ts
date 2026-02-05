export function formatCurrency(
  value: number,
  currency?: string | null,
  locale: string = "en-IN",
) {
  const normalizedCurrency = (currency ?? "INR").trim();
  if (!normalizedCurrency) {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 2,
    }).format(value);
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: normalizedCurrency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    const needsSpace = /[A-Za-z]$/.test(normalizedCurrency);
    const prefix = normalizedCurrency + (needsSpace ? " " : "");
    const absFormatted = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(Math.abs(value));
    const sign = value < 0 ? "-" : "";
    return `${sign}${prefix}${absFormatted}`;
  }
}

export function formatNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits,
  }).format(value);
}

/**
 * Format number in compact notation for chart axes.
 * e.g., 1000 -> "1K", 1000000 -> "10L" (Indian notation)
 */
export function formatCompactNumber(value: number): string {
  if (value === 0) return "0";
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  
  // Indian numbering system
  if (absValue >= 10000000) {
    return `${sign}${(absValue / 10000000).toFixed(absValue >= 100000000 ? 0 : 1)}Cr`;
  }
  if (absValue >= 100000) {
    return `${sign}${(absValue / 100000).toFixed(absValue >= 1000000 ? 0 : 1)}L`;
  }
  if (absValue >= 1000) {
    return `${sign}${(absValue / 1000).toFixed(absValue >= 10000 ? 0 : 1)}K`;
  }
  
  return formatNumber(value, 0);
}

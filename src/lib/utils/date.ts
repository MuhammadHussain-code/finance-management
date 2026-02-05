export function formatShortDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Formats a date or YYYY-MM string to "Mon YYYY" format
 */
export function formatMonthLabel(value: string | Date) {
  // Handle YYYY-MM format (e.g., "2026-02")
  if (typeof value === "string" && /^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

export function toIsoDate(value: Date) {
  return value.toISOString().split("T")[0];
}

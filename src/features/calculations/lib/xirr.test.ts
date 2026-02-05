import { describe, expect, it } from "vitest";
import { calculateXirr } from "@/features/calculations/lib/xirr";

describe("calculateXirr", () => {
  it("returns null when cash flows are insufficient", () => {
    expect(calculateXirr([{ amount: -1000, date: new Date() }])).toBeNull();
  });

  it("returns a reasonable rate for simple cash flows", () => {
    const result = calculateXirr([
      { amount: -1000, date: new Date("2024-01-01") },
      { amount: 1200, date: new Date("2025-01-01") },
    ]);
    expect(result).not.toBeNull();
    if (result) {
      expect(result).toBeGreaterThan(0);
    }
  });
});

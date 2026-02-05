import { describe, expect, it } from "vitest";
import { calculateSip } from "@/features/calculations/lib/sip-formula";

describe("calculateSip", () => {
  it("returns zero when inputs are invalid", () => {
    const result = calculateSip({
      monthlyInvestment: 0,
      durationMonths: 0,
      expectedAnnualReturn: 0.1,
    });
    expect(result.finalCorpus).toBe(0);
  });

  it("calculates a positive corpus for valid inputs", () => {
    const result = calculateSip({
      monthlyInvestment: 10000,
      durationMonths: 120,
      expectedAnnualReturn: 0.12,
    });
    expect(result.finalCorpus).toBeGreaterThan(result.totalInvested);
  });
});

export interface SipInput {
  monthlyInvestment: number;
  durationMonths: number;
  expectedAnnualReturn: number;
}

export interface SipResult {
  totalInvested: number;
  estimatedReturns: number;
  finalCorpus: number;
}

/** Maximum safe value for calculations to prevent overflow */
const MAX_SAFE_VALUE = Number.MAX_SAFE_INTEGER;

/**
 * Calculates SIP (Systematic Investment Plan) projections
 * @param input - SIP parameters including monthly investment, duration, and expected return
 * @returns Calculated total invested, estimated returns, and final corpus
 */
export function calculateSip(input: SipInput): SipResult {
  const { monthlyInvestment, durationMonths, expectedAnnualReturn } = input;
  const monthlyRate = expectedAnnualReturn / 12;

  if (durationMonths <= 0 || monthlyInvestment <= 0) {
    return {
      totalInvested: 0,
      estimatedReturns: 0,
      finalCorpus: 0,
    };
  }

  const totalInvested = monthlyInvestment * durationMonths;

  if (monthlyRate === 0) {
    return {
      totalInvested,
      estimatedReturns: 0,
      finalCorpus: totalInvested,
    };
  }

  const futureValue =
    monthlyInvestment *
    ((Math.pow(1 + monthlyRate, durationMonths) - 1) / monthlyRate) *
    (1 + monthlyRate);

  // Guard against overflow or invalid calculations
  if (!Number.isFinite(futureValue) || futureValue > MAX_SAFE_VALUE) {
    return {
      totalInvested: Math.min(totalInvested, MAX_SAFE_VALUE),
      estimatedReturns: MAX_SAFE_VALUE - Math.min(totalInvested, MAX_SAFE_VALUE),
      finalCorpus: MAX_SAFE_VALUE,
    };
  }

  return {
    totalInvested,
    estimatedReturns: futureValue - totalInvested,
    finalCorpus: futureValue,
  };
}

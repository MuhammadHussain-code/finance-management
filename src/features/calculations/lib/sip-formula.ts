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

  if (monthlyRate === 0) {
    const totalInvested = monthlyInvestment * durationMonths;
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

  const totalInvested = monthlyInvestment * durationMonths;

  return {
    totalInvested,
    estimatedReturns: futureValue - totalInvested,
    finalCorpus: futureValue,
  };
}

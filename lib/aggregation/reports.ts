import { ReportStats } from "@/types/report";

/**
 * Calculates robust statistical metrics for reported amounts.
 * Uses exact median to prevent extreme outlier distortion.
 */
export function calculateReportStats(amounts: number[]): ReportStats {
  if (!amounts || amounts.length === 0) {
    return {
      medianAmount: 0,
      minAmount: 0,
      maxAmount: 0,
      reportCount: 0,
      insufficientData: true,
    };
  }

  // Sort amounts in ascending order
  const sorted = [...amounts].sort((a, b) => a - b);
  const count = sorted.length;
  const minAmount = sorted[0];
  const maxAmount = sorted[count - 1];

  // Calculate Median
  let medianAmount: number;
  const half = Math.floor(count / 2);
  if (count % 2 === 0) {
    medianAmount = Math.round((sorted[half - 1] + sorted[half]) / 2);
  } else {
    medianAmount = Math.round(sorted[half]);
  }

  return {
    medianAmount,
    minAmount: Math.round(minAmount),
    maxAmount: Math.round(maxAmount),
    reportCount: count,
    insufficientData: count < 3,
  };
}

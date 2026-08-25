"use client";

import { useEffect, useState } from "react";
import { Offence } from "@/types/offence";
import { OFFENCE_TO_SERVICE_SLUG } from "@/lib/data/service-mapping";

export interface EnrichedOffence extends Offence {
  dbTypical: number;
  dbMin: number;
  dbMax: number;
  dbReportCount: number;
  dbConfidence: string;
  serviceId?: string;
}

interface ServiceStatsResponse {
  success: boolean;
  serviceStats: Record<
    string,
    {
      name: string;
      slug: string;
      categorySlug: string;
      categoryName: string;
      initialEstimate: {
        amount: number;
        minAmount: number | null;
        maxAmount: number | null;
        methodology: string;
        confidence: string;
        observationCount: number;
      } | null;
      reportStats: {
        medianAmount: number;
        minAmount: number;
        maxAmount: number;
        reportCount: number;
        insufficientData?: boolean;
      };
      mergedStats: {
        typical: number;
        min: number;
        max: number;
        reportCount: number;
        confidence: string;
      };
    }
  >;
}

/**
 * Merge OFFENCES editorial content with DB-backed stats.
 * Returns enriched offences with DB stats when available.
 */
export function mergeOffencesWithDbStats(
  offences: Offence[],
  serviceStats: ServiceStatsResponse["serviceStats"]
): EnrichedOffence[] {
  return offences.map((offence) => {
    const serviceSlug = OFFENCE_TO_SERVICE_SLUG[offence.slug];
    const dbStat = serviceSlug ? serviceStats[serviceSlug] : null;

    if (!dbStat) {
      return {
        ...offence,
        dbTypical: offence.reportedAmount.typical,
        dbMin: offence.reportedAmount.min,
        dbMax: offence.reportedAmount.max,
        dbReportCount: offence.reports,
        dbConfidence: offence.confidence,
      };
    }

    return {
      ...offence,
      dbTypical: dbStat.mergedStats.typical,
      dbMin: dbStat.mergedStats.min,
      dbMax: dbStat.mergedStats.max,
      dbReportCount: dbStat.mergedStats.reportCount,
      dbConfidence: dbStat.mergedStats.confidence,
      serviceId: dbStat.slug,
    };
  });
}

/**
 * Hook to fetch all service stats from the API and merge with OFFENCES.
 * Returns enriched offences with DB-backed stats.
 * During loading, returns empty enriched array (no static monetary values).
 * On error, returns empty enriched array (no fallback to static).
 */
export function useEnrichedOffences(offences: Offence[]): {
  enriched: EnrichedOffence[];
  isLoading: boolean;
  error: string | null;
} {
  const [serviceStats, setServiceStats] = useState<
    ServiceStatsResponse["serviceStats"] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const res = await fetch("/api/reports");
        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }
        const data: ServiceStatsResponse = await res.json();
        if (!cancelled && data.success && data.serviceStats) {
          setServiceStats(data.serviceStats);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to fetch stats");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, []);

  // Only return enriched data when DB stats are loaded
  // During loading or error, return empty array (components show loading/error state)
  const enriched = serviceStats ? mergeOffencesWithDbStats(offences, serviceStats) : [];

  return { enriched, isLoading, error };
}

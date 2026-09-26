import { db } from "@/lib/db";
import { reports, services, categories, initialEstimates } from "@/lib/db/schema";
import { calculateReportStats } from "@/lib/aggregation/reports";
import { eq, and, desc, inArray } from "drizzle-orm";

export interface ServiceDbData {
  service: {
    id: string;
    name: string;
    slug: string;
    categorySlug: string;
    categoryName: string;
  };
  initialEstimate: {
    amount: number;
    minAmount: number | null;
    maxAmount: number | null;
    methodology: string;
    confidence: string;
    observationCount: number;
  } | null;
  stats: {
    typical: number;
    min: number;
    max: number;
    reportCount: number;
    confidence: string;
    insufficientData: boolean;
  };
}

/**
 * Fetch service data from the database for a given service slug.
 * Used by server components (e.g., offence detail page) to get DB-backed stats.
 *
 * Returns null if the service is not found in the database.
 */
export async function fetchServiceDbData(
  serviceSlug: string
): Promise<ServiceDbData | null> {
  try {
    const serviceRows = await db
      .select({
        id: services.id,
        name: services.name,
        slug: services.slug,
        categoryId: services.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(services)
      .innerJoin(categories, eq(services.categoryId, categories.id))
      .where(eq(services.slug, serviceSlug))
      .limit(1);

    const serviceRow = serviceRows[0];
    if (!serviceRow) {
      return null;
    }

    const estimateRows = await db
      .select()
      .from(initialEstimates)
      .where(eq(initialEstimates.serviceId, serviceRow.id))
      .limit(1);

    const initialEstimate = estimateRows[0] || null;

    const dbReports = await db
      .select()
      .from(reports)
      .where(
        and(eq(reports.status, "approved"), eq(reports.serviceId, serviceRow.id))
      )
      .orderBy(desc(reports.createdAt));

    const numericAmounts = dbReports.map((r) => parseFloat(r.amount));
    const reportStats = calculateReportStats(numericAmounts);

    const stats = mergeEstimate(initialEstimate, reportStats);

    return {
      service: {
        id: serviceRow.id,
        name: serviceRow.name,
        slug: serviceRow.slug,
        categorySlug: serviceRow.categorySlug,
        categoryName: serviceRow.categoryName,
      },
      initialEstimate: initialEstimate
        ? {
            amount: parseFloat(String(initialEstimate.amount)),
            minAmount: initialEstimate.minAmount
              ? parseFloat(String(initialEstimate.minAmount))
              : null,
            maxAmount: initialEstimate.maxAmount
              ? parseFloat(String(initialEstimate.maxAmount))
              : null,
            methodology: initialEstimate.methodology,
            confidence: initialEstimate.confidence,
            observationCount: Number(initialEstimate.observationCount),
          }
        : null,
      stats,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch related services from the database for a given category.
 * Returns services in the same category (excluding the current service).
 */
export async function fetchRelatedServicesDbData(
  categorySlug: string,
  excludeServiceSlug: string,
  limit: number = 3
): Promise<ServiceDbData[]> {
  try {
    const serviceRows = await db
      .select({
        id: services.id,
        name: services.name,
        slug: services.slug,
        categoryId: services.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(services)
      .innerJoin(categories, eq(services.categoryId, categories.id))
      .where(
        and(
          eq(categories.slug, categorySlug),
          eq(services.active, true)
        )
      );

    const filteredServices = serviceRows.filter(
      (s) => s.slug !== excludeServiceSlug
    ).slice(0, limit);

    if (filteredServices.length === 0) {
      return [];
    }

    const serviceIds = filteredServices.map((s) => s.id);

    const estimateRows = await db
      .select()
      .from(initialEstimates)
      .where(inArray(initialEstimates.serviceId, serviceIds));

    const estimateByServiceId = new Map(
      estimateRows.map((e) => [e.serviceId, e])
    );

    const dbReports = await db
      .select()
      .from(reports)
      .where(
        and(
          eq(reports.status, "approved"),
          inArray(reports.serviceId, serviceIds)
        )
      );

    const reportsByServiceId = new Map<string, typeof dbReports>();
    for (const r of dbReports) {
      const existing = reportsByServiceId.get(r.serviceId) || [];
      existing.push(r);
      reportsByServiceId.set(r.serviceId, existing);
    }

    const relatedData: ServiceDbData[] = [];

    for (const svc of filteredServices) {
      const initialEstimate = estimateByServiceId.get(svc.id) || null;
      const serviceReports = reportsByServiceId.get(svc.id) || [];
      const numericAmounts = serviceReports.map((r) => parseFloat(r.amount));
      const reportStats = calculateReportStats(numericAmounts);
      const stats = mergeEstimate(initialEstimate, reportStats);

      relatedData.push({
        service: {
          id: svc.id,
          name: svc.name,
          slug: svc.slug,
          categorySlug: svc.categorySlug,
          categoryName: svc.categoryName,
        },
        initialEstimate: initialEstimate
          ? {
              amount: parseFloat(String(initialEstimate.amount)),
              minAmount: initialEstimate.minAmount
                ? parseFloat(String(initialEstimate.minAmount))
                : null,
              maxAmount: initialEstimate.maxAmount
                ? parseFloat(String(initialEstimate.maxAmount))
                : null,
              methodology: initialEstimate.methodology,
              confidence: initialEstimate.confidence,
              observationCount: Number(initialEstimate.observationCount),
            }
          : null,
        stats,
      });
    }

    return relatedData;
  } catch {
    return [];
  }
}

function mergeEstimate(
  initialEstimate: {
    amount: { toString(): string };
    minAmount?: { toString(): string } | null;
    maxAmount?: { toString(): string } | null;
    confidence: string;
  } | null,
  reportStats: {
    medianAmount: number;
    minAmount: number;
    maxAmount: number;
    reportCount: number;
    insufficientData?: boolean;
  }
): ServiceDbData["stats"] {
  if (!initialEstimate) {
    return {
      typical: reportStats.medianAmount,
      min: reportStats.minAmount,
      max: reportStats.maxAmount,
      reportCount: reportStats.reportCount,
      confidence: "low",
      insufficientData: reportStats.insufficientData ?? true,
    };
  }

  const estAmount = parseFloat(String(initialEstimate.amount));
  const estMin = initialEstimate.minAmount
    ? parseFloat(String(initialEstimate.minAmount))
    : estAmount;
  const estMax = initialEstimate.maxAmount
    ? parseFloat(String(initialEstimate.maxAmount))
    : estAmount;

  if (reportStats.reportCount === 0) {
    return {
      typical: estAmount,
      min: estMin,
      max: estMax,
      reportCount: 0,
      confidence: initialEstimate.confidence,
      insufficientData: true,
    };
  }

  const typical = reportStats.medianAmount > 0 ? reportStats.medianAmount : estAmount;
  const min = Math.min(estMin, reportStats.minAmount);
  const max = Math.max(estMax, reportStats.maxAmount);

  return {
    typical,
    min,
    max,
    reportCount: reportStats.reportCount,
    confidence: initialEstimate.confidence,
    insufficientData: reportStats.reportCount < 3,
  };
}

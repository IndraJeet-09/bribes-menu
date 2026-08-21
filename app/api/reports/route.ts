import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reports, services, categories, initialEstimates } from "@/lib/db/schema";
import { reportSubmissionSchema } from "@/lib/validation/report";
import { reportQuerySchema } from "@/lib/validation/query";
import { moderationSchema } from "@/lib/validation/moderation";
import { detectPIIAndSpam } from "@/lib/security/detect-pii";
import { sanitizeString } from "@/lib/security/sanitize";
import { hashClientIdentifier, checkRateLimit } from "@/lib/security/rate-limit";
import { verifyModerationSecret } from "@/lib/security/authorization";
import { calculateReportStats } from "@/lib/aggregation/reports";
import { eq, and, sql, desc, lt } from "drizzle-orm";

const MAX_BODY_SIZE_BYTES = 10 * 1024; // 10 KB

function jsonResponse(data: unknown, status = 200, headers?: Record<string, string>) {
  return NextResponse.json(data, { status, headers });
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Merge initial estimate data with approved report statistics.
 * Initial estimate is the starting value; reports refine it.
 */
function mergeEstimateWithReportStats(
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
): {
  typical: number;
  min: number;
  max: number;
  reportCount: number;
  confidence: string;
  insufficientData: boolean;
} {
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
  const totalReports = reportStats.reportCount;

  return {
    typical,
    min,
    max,
    reportCount: totalReports,
    confidence: initialEstimate.confidence,
    insufficientData: totalReports < 3,
  };
}

/**
 * POST /api/reports
 * Submit a new anonymous report.
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return jsonResponse(
        { success: false, error: "Content-Type must be application/json." },
        400
      );
    }

    const rawBody = await req.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_SIZE_BYTES) {
      return jsonResponse(
        { success: false, error: "Payload too large. Maximum size is 10KB." },
        413
      );
    }

    let bodyJson: unknown;
    try {
      bodyJson = JSON.parse(rawBody);
    } catch {
      return jsonResponse(
        { success: false, error: "Invalid JSON format." },
        400
      );
    }

    const validationResult = reportSubmissionSchema.safeParse(bodyJson);
    if (!validationResult.success) {
      const issue = validationResult.error.issues[0];
      return jsonResponse(
        {
          success: false,
          error: "Validation failed.",
          details: `${issue.path.join(".")}: ${issue.message}`,
        },
        400
      );
    }

    const data = validationResult.data;

    if (data.description) {
      const piiCheck = detectPIIAndSpam(data.description);
      if (piiCheck.hasPIIOrSuspicious) {
        return jsonResponse(
          {
            success: false,
            error: "Content check failed.",
            details: piiCheck.reason,
          },
          400
        );
      }
    }

    const sanitizedDescription = data.description ? sanitizeString(data.description) : null;

    const clientIp = getClientIp(req);
    const hashedId = hashClientIdentifier(clientIp);
    const rateLimit = checkRateLimit(hashedId);
    if (!rateLimit.allowed) {
      return jsonResponse(
        {
          success: false,
          error: "Rate limit exceeded.",
          details: rateLimit.reason,
        },
        429,
        { "Retry-After": String(rateLimit.retryAfterSeconds || 60) }
      );
    }

    let serviceRecord = null;
    const foundServices = await db
      .select()
      .from(services)
      .where(and(eq(services.id, data.serviceId), eq(services.active, true)))
      .limit(1);

    serviceRecord = foundServices[0] || null;

    if (!serviceRecord) {
      return jsonResponse(
        {
          success: false,
          error: "Invalid or inactive serviceId.",
        },
        400
      );
    }

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const existingDuplicates = await db
      .select()
      .from(reports)
      .where(
        and(
          eq(reports.serviceId, data.serviceId),
          eq(reports.amount, String(data.amount)),
          eq(reports.city, data.city),
          eq(reports.state, data.state),
          eq(reports.incidentMonth, data.incidentMonth),
          sql`${reports.createdAt} > ${fifteenMinutesAgo}`
        )
      )
      .limit(1);

    if (existingDuplicates.length > 0) {
      return jsonResponse(
        {
          success: false,
          error: "Duplicate submission detected. Please wait before re-submitting.",
        },
        409
      );
    }

    const sourceRecordId = `user-${data.serviceId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await db.insert(reports).values({
      serviceId: data.serviceId,
      amount: String(data.amount),
      currency: "INR",
      paid: data.paid,
      paymentMode: data.paymentMode,
      city: data.city,
      state: data.state,
      incidentMonth: data.incidentMonth,
      officialRole: data.officialRole || null,
      description: sanitizedDescription,
      status: "pending",
      source: "crowdsourced",
      sourceRecordId,
    });

    return jsonResponse(
      {
        success: true,
        message: "Report submitted for review.",
      },
      201
    );
  } catch (error) {
    console.error("POST /api/reports internal error:", error);
    return jsonResponse(
      { success: false, error: "An unexpected server error occurred." },
      500
    );
  }
}

/**
 * GET /api/reports
 * Fetch approved reports and aggregate statistics for frontend.
 *
 * When `service` query param is provided (service slug):
 *   - Returns reports filtered by that service
 *   - Includes initial estimate for the service
 *   - Returns merged stats (initial estimate + approved reports)
 *
 * When no `service` param:
 *   - Returns per-service stats for all services (for homepage/browse)
 *   - Includes initial estimates for all services
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const queryObj = Object.fromEntries(url.searchParams.entries());

    const validationResult = reportQuerySchema.safeParse(queryObj);
    if (!validationResult.success) {
      return jsonResponse(
        {
          success: false,
          error: "Invalid query parameters.",
          details: validationResult.error.issues[0].message,
        },
        400
      );
    }

    const { service, category, city, state, limit, cursor } = validationResult.data;

    if (service) {
      return await handleSingleServiceQuery(service, city, state, limit, cursor);
    }

    return await handleAllServicesQuery(category, city, state);
  } catch (error) {
    console.error("GET /api/reports internal error:", error);
    return jsonResponse(
      { success: false, error: "An unexpected server error occurred." },
      500
    );
  }
}

async function handleSingleServiceQuery(
  serviceSlug: string,
  city?: string,
  state?: string,
  limit: number = 20,
  cursor?: string
) {
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
    return jsonResponse(
      { success: false, error: `Service not found: ${serviceSlug}` },
      404
    );
  }

  const estimateRows = await db
    .select()
    .from(initialEstimates)
    .where(eq(initialEstimates.serviceId, serviceRow.id))
    .limit(1);

  const initialEstimate = estimateRows[0] || null;

  const conditions = [
    eq(reports.status, "approved"),
    eq(reports.serviceId, serviceRow.id),
  ];

  if (city) {
    conditions.push(eq(reports.city, city));
  }
  if (state) {
    conditions.push(eq(reports.state, state));
  }
  if (cursor) {
    conditions.push(lt(reports.id, cursor));
  }

  const dbReports = await db
    .select()
    .from(reports)
    .where(and(...conditions))
    .orderBy(desc(reports.createdAt))
    .limit(limit + 1);

  const hasMore = dbReports.length > limit;
  const resultItems = hasMore ? dbReports.slice(0, limit) : dbReports;
  const nextCursor = hasMore ? resultItems[resultItems.length - 1].id : null;

  const numericAmounts = resultItems.map((r) => parseFloat(r.amount));
  const reportStats = calculateReportStats(numericAmounts);

  const stats = mergeEstimateWithReportStats(initialEstimate, reportStats);

  return jsonResponse({
    success: true,
    reports: resultItems,
    stats,
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
    service: {
      id: serviceRow.id,
      name: serviceRow.name,
      slug: serviceRow.slug,
      categorySlug: serviceRow.categorySlug,
      categoryName: serviceRow.categoryName,
    },
    pagination: {
      nextCursor,
    },
  });
}

async function handleAllServicesQuery(
  category?: string,
  city?: string,
  state?: string
) {
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
    .where(eq(services.active, true));

  const allEstimates = await db.select().from(initialEstimates);

  const estimateByServiceId = new Map(
    allEstimates.map((e) => [e.serviceId, e])
  );

  const reportConditions = [eq(reports.status, "approved")];
  if (city) {
    reportConditions.push(eq(reports.city, city));
  }
  if (state) {
    reportConditions.push(eq(reports.state, state));
  }

  const allReports = await db
    .select({
      serviceId: reports.serviceId,
      amount: reports.amount,
    })
    .from(reports)
    .where(and(...reportConditions));

  const amountsByService = new Map<string, number[]>();
  for (const r of allReports) {
    const existing = amountsByService.get(r.serviceId) || [];
    existing.push(parseFloat(r.amount));
    amountsByService.set(r.serviceId, existing);
  }

  const serviceStats: Record<
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
  > = {};

  for (const svc of serviceRows) {
    const estimate = estimateByServiceId.get(svc.id) || null;
    const amounts = amountsByService.get(svc.id) || [];
    const reportStats = calculateReportStats(amounts);

    const merged = mergeEstimateWithReportStats(estimate, reportStats);

    serviceStats[svc.slug] = {
      name: svc.name,
      slug: svc.slug,
      categorySlug: svc.categorySlug,
      categoryName: svc.categoryName,
      initialEstimate: estimate
        ? {
            amount: parseFloat(String(estimate.amount)),
            minAmount: estimate.minAmount
              ? parseFloat(String(estimate.minAmount))
              : null,
            maxAmount: estimate.maxAmount
              ? parseFloat(String(estimate.maxAmount))
              : null,
            methodology: estimate.methodology,
            confidence: estimate.confidence,
            observationCount: Number(estimate.observationCount),
          }
        : null,
      reportStats,
      mergedStats: {
        typical: merged.typical,
        min: merged.min,
        max: merged.max,
        reportCount: merged.reportCount,
        confidence: merged.confidence,
      },
    };
  }

  if (category) {
    const filtered: typeof serviceStats = {};
    for (const [slug, stats] of Object.entries(serviceStats)) {
      if (stats.categorySlug === category) {
        filtered[slug] = stats;
      }
    }
    return jsonResponse({
      success: true,
      serviceStats: filtered,
      pagination: { nextCursor: null },
    });
  }

  return jsonResponse({
    success: true,
    serviceStats,
    pagination: { nextCursor: null },
  });
}

/**
 * PATCH /api/reports
 * Moderator / Admin moderation action (approve or reject a report).
 */
export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const bearerSecret = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const customHeaderSecret = req.headers.get("x-moderation-secret");

    const providedSecret = bearerSecret || customHeaderSecret;

    if (!verifyModerationSecret(providedSecret)) {
      return jsonResponse(
        { success: false, error: "Unauthorized moderation access." },
        401
      );
    }

    const rawBody = await req.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_SIZE_BYTES) {
      return jsonResponse(
        { success: false, error: "Payload too large." },
        413
      );
    }

    let bodyJson: unknown;
    try {
      bodyJson = JSON.parse(rawBody);
    } catch {
      return jsonResponse(
        { success: false, error: "Invalid JSON format." },
        400
      );
    }

    const validationResult = moderationSchema.safeParse(bodyJson);
    if (!validationResult.success) {
      return jsonResponse(
        {
          success: false,
          error: "Validation failed.",
          details: validationResult.error.issues[0].message,
        },
        400
      );
    }

    const { reportId, action } = validationResult.data;
    const newStatus = action === "approve" ? "approved" : "rejected";

    const updated = await db
      .update(reports)
      .set({
        status: newStatus,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(reports.id, reportId))
      .returning();

    if (updated.length === 0) {
      return jsonResponse(
        { success: false, error: "Report not found." },
        404
      );
    }

    return jsonResponse({
      success: true,
      message: `Report ${reportId} status updated to ${newStatus}.`,
    });
  } catch (error) {
    console.error("PATCH /api/reports internal error:", error);
    return jsonResponse(
      { success: false, error: "An unexpected server error occurred." },
      500
    );
  }
}

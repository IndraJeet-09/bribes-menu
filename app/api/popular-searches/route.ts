import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reports, services } from "@/lib/db/schema";
import { eq, desc, sql, count, and } from "drizzle-orm";

function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "8", 10);

    const popularServices = await db
      .select({
        serviceId: services.id,
        serviceName: services.name,
        serviceSlug: services.slug,
        reportCount: count(reports.id),
      })
      .from(services)
      .leftJoin(reports, and(eq(reports.serviceId, services.id), eq(reports.status, "approved")))
      .where(eq(services.active, true))
      .groupBy(services.id, services.name, services.slug)
      .orderBy(desc(count(reports.id)))
      .limit(limit);

    const searchTerms = popularServices
      .filter((s) => s.reportCount > 0)
      .map((s) => s.serviceName)
      .slice(0, limit);

    // If no reports yet, fall back to some common terms
    const fallbackTerms = [
      "No helmet",
      "No licence",
      "Police verification",
      "GST",
      "Overspeeding",
      "Illegal parking",
      "Red light",
      "Wrong side",
    ];

    return jsonResponse({
      success: true,
      popularSearches: searchTerms.length > 0 ? searchTerms : fallbackTerms.slice(0, limit),
    });
  } catch (error) {
    console.error("GET /api/popular-searches error:", error);
    return jsonResponse(
      { success: false, error: "An unexpected server error occurred." },
      500
    );
  }
}
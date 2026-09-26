import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { services, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export async function GET(req: NextRequest) {
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
      .where(eq(services.active, true));

    return jsonResponse({
      success: true,
      services: serviceRows,
    });
  } catch (error) {
    console.error("GET /api/services error:", error);
    return jsonResponse(
      { success: false, error: "An unexpected server error occurred." },
      500
    );
  }
}
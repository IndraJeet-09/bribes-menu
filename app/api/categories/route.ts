import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export async function GET(req: NextRequest) {
  try {
    const categoryRows = await db
      .select()
      .from(categories);

    return jsonResponse({
      success: true,
      categories: categoryRows,
    });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return jsonResponse(
      { success: false, error: "An unexpected server error occurred." },
      500
    );
  }
}
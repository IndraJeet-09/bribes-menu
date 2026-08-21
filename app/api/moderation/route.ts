import { NextRequest, NextResponse } from "next/server";
import { verifyModerationSecret } from "@/lib/security/authorization";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const reportId = formData.get("reportId") as string;
    const action = formData.get("action") as "approve" | "reject";
    const secret = formData.get("secret") as string;

    if (!reportId || !action || !secret) {
      return NextResponse.redirect(
        new URL("/moderation?error=Missing required fields", req.url)
      );
    }

    if (!verifyModerationSecret(secret)) {
      return NextResponse.redirect(
        new URL("/moderation?error=Unauthorized moderation access", req.url)
      );
    }

    const res = await fetch(new URL("/api/reports", req.url), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({ reportId, action }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return NextResponse.redirect(
        new URL(`/moderation?error=${encodeURIComponent(data.details || data.error || "Moderation failed")}`, req.url)
      );
    }

    return NextResponse.redirect(
      new URL("/moderation?success=1", req.url)
    );
  } catch (error) {
    console.error("POST /api/moderation internal error:", error);
    return NextResponse.redirect(
      new URL("/moderation?error=An unexpected server error occurred", req.url)
    );
  }
}
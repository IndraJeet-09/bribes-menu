"use server";

import { db } from "@/lib/db";
import { reports } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifyModerationSecret } from "@/lib/security/authorization";
import { cookies } from "next/headers";

export async function moderateReport(reportId: string, action: "approve" | "reject"): Promise<{ success: boolean; message: string }> {
  const cookieStore = await cookies();
  const moderationSecret = cookieStore.get("moderation_auth")?.value ?? null;

  if (!verifyModerationSecret(moderationSecret)) {
    return { success: false, message: "Unauthorized moderation access." };
  }

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
    return { success: false, message: "Report not found." };
  }

  return { success: true, message: `Report ${reportId} status updated to ${newStatus}.` };
}

export async function loginModerator(secret: string): Promise<{ success: boolean; message: string }> {
  if (!verifyModerationSecret(secret)) {
    return { success: false, message: "Invalid moderation secret." };
  }

  const cookieStore = await cookies();
  cookieStore.set("moderation_auth", secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return { success: true, message: "Logged in successfully." };
}

export async function loginAction(formData: FormData): Promise<void> {
  const secret = formData.get("secret") as string;
  await loginModerator(secret);
}

export async function logoutAction(): Promise<void> {
  await logoutModerator();
}

export async function logoutModerator(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  cookieStore.delete("moderation_auth");
  return { success: true };
}

export async function checkModerationAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const moderationSecret = cookieStore.get("moderation_auth")?.value ?? null;
  return verifyModerationSecret(moderationSecret);
}

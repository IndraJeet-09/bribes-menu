import { db } from "@/lib/db";
import { reports, services, categories } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { verifyModerationSecret } from "@/lib/security/authorization";
import { headers } from "next/headers";

interface ModerationReport {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceSlug: string;
  amount: string;
  paid: boolean;
  paymentMode: string;
  city: string;
  state: string;
  incidentMonth: string;
  officialRole: string | null;
  description: string | null;
  source: string;
  sourceType: string;
  createdAt: string;
}

async function fetchPendingReports(): Promise<ModerationReport[]> {
  const dbReports = await db
    .select({
      id: reports.id,
      serviceId: reports.serviceId,
      amount: reports.amount,
      paid: reports.paid,
      paymentMode: reports.paymentMode,
      city: reports.city,
      state: reports.state,
      incidentMonth: reports.incidentMonth,
      officialRole: reports.officialRole,
      description: reports.description,
      source: reports.source,
      sourceType: reports.sourceType,
      createdAt: reports.createdAt,
      serviceName: services.name,
      serviceSlug: services.slug,
    })
    .from(reports)
    .innerJoin(services, eq(reports.serviceId, services.id))
    .where(eq(reports.status, "pending"))
    .orderBy(desc(reports.createdAt));

  return dbReports as ModerationReport[];
}

async function moderateReport(reportId: string, action: "approve" | "reject"): Promise<{ success: boolean; message: string }> {
  const headersList = await headers();
  const authHeader = headersList.get("authorization") || "";
  const bearerSecret = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const customHeaderSecret = headersList.get("x-moderation-secret");
  const providedSecret = bearerSecret || customHeaderSecret;

  if (!verifyModerationSecret(providedSecret)) {
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

export default async function ModerationPage() {
  const pendingReports = await fetchPendingReports();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="space-y-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-muted">
            MODERATION QUEUE
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground mt-2">
            Pending Reports
          </h1>
          <p className="font-sans text-sm text-muted mt-1">
            {pendingReports.length} report{pendingReports.length !== 1 ? "s" : ""} awaiting review
          </p>
        </div>

        {pendingReports.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-12 text-center">
            <div className="font-serif text-2xl font-bold text-foreground mb-2">
              No pending reports
            </div>
            <p className="font-sans text-muted">
              All reports have been reviewed. Great work!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReportCard({ report }: { report: ModerationReport }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-muted">
            {report.serviceName}
          </span>
          <span className="font-mono text-[10px] text-muted ml-2">
            ({report.serviceSlug})
          </span>
        </div>
        <span className="font-mono text-xs px-2 py-1 rounded bg-amber-100 text-amber-800 border border-amber-200">
          PENDING
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="font-mono text-[10px] uppercase text-muted block mb-0.5">Amount</span>
          <span className="font-serif text-lg font-bold text-foreground">₹{Number(report.amount).toLocaleString()}</span>
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase text-muted block mb-0.5">Paid</span>
          <span className="font-mono text-sm text-foreground">{report.paid ? "Yes" : "No"}</span>
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase text-muted block mb-0.5">Payment Mode</span>
          <span className="font-mono text-sm text-foreground capitalize">{report.paymentMode.replace("_", " ")}</span>
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase text-muted block mb-0.5">City / State</span>
          <span className="font-mono text-sm text-foreground">{report.city}, {report.state}</span>
        </div>
        <div className="sm:col-span-2">
          <span className="font-mono text-[10px] uppercase text-muted block mb-0.5">Incident Month</span>
          <span className="font-mono text-sm text-foreground">{report.incidentMonth}</span>
        </div>
        <div className="sm:col-span-2">
          <span className="font-mono text-[10px] uppercase text-muted block mb-0.5">Official Role</span>
          <span className="font-mono text-sm text-foreground">{report.officialRole || "Not specified"}</span>
        </div>
        <div className="sm:col-span-2">
          <span className="font-mono text-[10px] uppercase text-muted block mb-0.5">Source</span>
          <span className="font-mono text-sm text-foreground">{report.source} ({report.sourceType})</span>
        </div>
        <div className="sm:col-span-4">
          <span className="font-mono text-[10px] uppercase text-muted block mb-0.5">Description</span>
          <p className="font-sans text-sm text-muted-dark whitespace-pre-wrap">{report.description || "No description provided"}</p>
        </div>
        <div className="sm:col-span-4">
          <span className="font-mono text-[10px] uppercase text-muted block mb-0.5">Submitted</span>
          <span className="font-mono text-sm text-foreground">{new Date(report.createdAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <form action="/api/moderation" method="POST" className="flex-1">
          <input type="hidden" name="reportId" value={report.id} />
          <input type="hidden" name="action" value="approve" />
          <input type="hidden" name="secret" value={process.env.MODERATION_SECRET || ""} />
          <button
            type="submit"
            className="w-full sm:w-auto font-mono text-xs font-semibold py-2.5 px-4 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            APPROVE
          </button>
        </form>
        <form action="/api/moderation" method="POST" className="flex-1">
          <input type="hidden" name="reportId" value={report.id} />
          <input type="hidden" name="action" value="reject" />
          <input type="hidden" name="secret" value={process.env.MODERATION_SECRET || ""} />
          <button
            type="submit"
            className="w-full sm:w-auto font-mono text-xs font-semibold py-2.5 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            REJECT
          </button>
        </form>
      </div>
    </div>
  );
}
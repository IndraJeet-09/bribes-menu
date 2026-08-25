import { db } from "@/lib/db";
import { reports, services, categories } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { moderateReport, checkModerationAuth, loginAction, logoutAction } from "./actions";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

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

export default async function ModerationPage() {
  const isAuthed = await checkModerationAuth();
  const pendingReports = isAuthed ? await fetchPendingReports() : [];

  if (!isAuthed) {
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
          </div>
          <ModerationLoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          <form action={logoutAction}>
            <button
              type="submit"
              className="font-mono text-xs font-semibold py-2 px-4 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
            >
              LOGOUT
            </button>
          </form>
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

function ModerationLoginForm() {
  return (
    <form action={loginAction} className="rounded-xl border border-border bg-surface p-6 max-w-md mx-auto mt-8 space-y-4">
      <div className="font-serif text-xl font-bold text-center">
        Moderator Authentication Required
      </div>
      <p className="font-sans text-sm text-muted text-center">
        Enter the moderation secret to access the queue.
      </p>
      <div className="space-y-3">
        <label className="block space-y-1">
          <span className="font-mono text-xs uppercase text-muted">Moderation Secret</span>
          <input
            type="password"
            name="secret"
            autoComplete="off"
            required
            className="w-full px-3 py-2 rounded border border-border bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter moderation secret"
          />
        </label>
        <button
          type="submit"
          className="w-full font-mono text-xs font-semibold py-2.5 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          ACCESS QUEUE
        </button>
      </div>
    </form>
  );
}

async function approveAction(reportId: string, formData: FormData) {
  "use server";
  await moderateReport(reportId, "approve");
  revalidatePath("/moderation");
}

async function rejectAction(reportId: string, formData: FormData) {
  "use server";
  await moderateReport(reportId, "reject");
  revalidatePath("/moderation");
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
        <form action={approveAction.bind(null, report.id)}>
          <button
            type="submit"
            className="w-full sm:w-auto font-mono text-xs font-semibold py-2.5 px-4 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            APPROVE
          </button>
        </form>
        <form action={rejectAction.bind(null, report.id)}>
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
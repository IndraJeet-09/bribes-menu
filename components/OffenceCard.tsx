import Link from "next/link";
import { Offence } from "@/types/offence";
import { EnrichedOffence } from "@/lib/data/enriched-offences";
import { formatINR } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface OffenceCardProps {
  offence: Offence | EnrichedOffence;
  isLoading?: boolean;
}

export function OffenceCard({ offence, isLoading }: OffenceCardProps) {
  const { slug, title, category, location } = offence;

  const hasDbData = "dbTypical" in offence;
  const typical = hasDbData ? offence.dbTypical : offence.reportedAmount.typical;
  const min = hasDbData ? offence.dbMin : offence.reportedAmount.min;
  const max = hasDbData ? offence.dbMax : offence.reportedAmount.max;
  const reportCount = hasDbData ? offence.dbReportCount : offence.reports;
  const hasEstimate = typical > 0;

  // Show skeleton while DB data is loading
  if (isLoading) {
    return (
      <div className="group relative flex flex-col justify-between rounded-lg border border-border bg-surface p-5 sm:p-6 animate-pulse">
        <div>
          <div className="flex items-center justify-between gap-2 pb-3">
            <div className="h-4 w-20 rounded bg-neutral-200" />
            <div className="h-4 w-4 rounded bg-neutral-200" />
          </div>
          <div className="h-6 w-3/4 rounded bg-neutral-200 mb-2" />
          <div className="h-4 w-full rounded bg-neutral-200" />
        </div>
        <div className="pt-6 mt-4 border-t border-border/60">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <div className="h-8 w-24 rounded bg-neutral-200" />
              <div className="h-3 w-20 rounded bg-neutral-200 mt-0.5" />
            </div>
            <div className="text-right">
              <div className="h-4 w-28 rounded bg-neutral-200" />
              <div className="h-3 w-24 rounded bg-neutral-200 mt-0.5" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/40">
            <div className="h-3 w-16 rounded bg-neutral-200" />
            <div className="h-3 w-24 rounded bg-neutral-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/offence/${slug}`}
      className="group relative flex flex-col justify-between rounded-lg border border-border bg-surface p-5 sm:p-6 transition-all duration-200 hover:border-foreground/60 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] active:scale-[0.995]"
    >
      {/* Top Header: Category & Arrow */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-3">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted group-hover:text-foreground transition-colors">
            {category}
          </span>
          <span className="flex items-center text-muted group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-snug group-hover:underline decoration-1 underline-offset-4">
          {title}
        </h3>

        {/* Humorous snippet */}
        <p className="font-sans text-xs text-muted mt-2 line-clamp-2 italic">
          &ldquo;{offence.humorousQuote}&rdquo;
        </p>
      </div>

      {/* Amount & Metadata Bottom Section */}
      <div className="pt-6 mt-4 border-t border-border/60">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            {hasEstimate ? (
              <>
                <div className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {formatINR(typical)}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted mt-0.5">
                  TYPICAL REPORTED
                </div>
              </>
            ) : (
              <>
                <div className="font-mono text-sm font-medium text-muted-dark italic">
                  Estimate pending
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted mt-0.5">
                  AWAITING DATA
                </div>
              </>
            )}
          </div>

          <div className="text-right">
            {hasEstimate ? (
              <>
                <div className="font-mono text-xs font-medium text-muted-dark">
                  {formatINR(min)} — {formatINR(max)}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted mt-0.5">
                  REPORTED RANGE
                </div>
              </>
            ) : (
              <div className="font-mono text-[10px] text-muted italic">
                No data yet
              </div>
            )}
          </div>
        </div>

        {/* Footer info: Reports & Location */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/40 font-mono text-[11px] text-muted">
          <span>{reportCount} reports</span>
          {location && location.length > 0 && (
            <span className="truncate max-w-[180px] sm:max-w-[200px] text-right">
              {location.slice(0, 2).join(" · ")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

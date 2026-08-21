import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { OFFENCES } from "@/data/offences";
import { formatINR } from "@/lib/utils";
import { AmountVisualizer } from "@/components/AmountVisualizer";
import { ShareButton } from "@/components/ShareButton";
import { OffenceCard } from "@/components/OffenceCard";
import { ReportCTA } from "@/components/ReportCTA";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ShieldCheck,
  Info,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return OFFENCES.map((offence) => ({
    slug: offence.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const offence = OFFENCES.find((o) => o.slug === slug);

  if (!offence) {
    return {
      title: "Offence Not Found | The Unofficial Fine Menu",
    };
  }

  return {
    title: `${offence.title} — Unofficial Fine & Rate Estimates (${formatINR(offence.reportedAmount.typical)})`,
    description: `Reported typical amount of ${formatINR(offence.reportedAmount.typical)} (Range: ${formatINR(offence.reportedAmount.min)} - ${formatINR(offence.reportedAmount.max)}) for ${offence.title}. Crowdsourced anecdotal estimates.`,
  };
}

export default async function OffenceDetailPage({ params }: Props) {
  const { slug } = await params;
  const offence = OFFENCES.find((o) => o.slug === slug);

  if (!offence) {
    notFound();
  }

  const {
    title,
    category,
    description,
    humorousQuote,
    reportedAmount,
    reports,
    confidence,
    location,
    lastUpdated,
    tipsOrContext,
    aliases,
  } = offence;

  // Find related offences in the same category (or other categories if fewer than 2)
  const relatedOffences = OFFENCES.filter(
    (o) => o.id !== offence.id && (o.category === offence.category || true)
  ).slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10">
      {/* Back Navigation & Breadcrumb */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div className="flex items-center gap-2 font-mono text-xs text-muted">
          <Link
            href="/browse"
            className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>DIRECTORY</span>
          </Link>
          <ChevronRight className="h-3 w-3 opacity-40" />
          <Link
            href={`/browse?category=${category}`}
            className="uppercase hover:text-foreground transition-colors"
          >
            {category}
          </Link>
        </div>

        <ShareButton title={title} />
      </div>

      {/* Main Title & Sarcastic Quote */}
      <div className="space-y-4">
        <div className="inline-block font-mono text-xs uppercase tracking-widest px-2.5 py-1 rounded bg-neutral-200/70 text-foreground font-semibold">
          {category}
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
          {title}
        </h1>

        <p className="font-sans text-base sm:text-lg text-muted-dark leading-relaxed">
          {description}
        </p>

        {/* Humorous Quote Callout */}
        <div className="relative border-l-2 border-foreground pl-4 py-2 my-4 bg-surface/50 rounded-r-lg">
          <p className="font-serif text-lg sm:text-xl italic text-foreground leading-snug">
            "{humorousQuote}"
          </p>
        </div>
      </div>

      {/* Dominant Reported Amount Hero Card */}
      <div className="rounded-2xl border-2 border-foreground bg-surface p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-border">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-muted block mb-1">
              TYPICAL REPORTED AMOUNT
            </span>
            <div className="font-serif text-5xl sm:text-7xl font-bold tracking-tight text-foreground">
              {formatINR(reportedAmount.typical)}
            </div>
            <div className="font-mono text-xs text-muted mt-1">
              Crowdsourced median from {reports} verified anecdotes
            </div>
          </div>

          <div className="sm:text-right font-mono">
            <span className="text-xs uppercase tracking-widest text-muted block mb-1">
              REPORTED RANGE
            </span>
            <div className="text-xl sm:text-2xl font-bold text-muted-dark">
              {formatINR(reportedAmount.min)} — {formatINR(reportedAmount.max)}
            </div>
            <div className="text-[11px] text-muted mt-0.5">
              Subject to location & negotiation
            </div>
          </div>
        </div>

        {/* Range Visualizer Distribution */}
        <div>
          <AmountVisualizer reportedAmount={reportedAmount} />
        </div>
      </div>

      {/* Metadata & Key Factors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Reports Count */}
        <div className="rounded-lg border border-border bg-surface p-4 space-y-1">
          <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase text-muted">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>SAMPLE VOLUME</span>
          </div>
          <div className="font-serif text-2xl font-bold text-foreground">
            {reports} reports
          </div>
          <div className="font-mono text-[10px] text-muted">
            Confidence: <span className="uppercase font-semibold text-foreground">{confidence}</span>
          </div>
        </div>

        {/* Locations */}
        <div className="rounded-lg border border-border bg-surface p-4 space-y-1">
          <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase text-muted">
            <MapPin className="h-3.5 w-3.5" />
            <span>CITIES REPORTED</span>
          </div>
          <div className="font-mono text-xs font-semibold text-foreground truncate">
            {location && location.length > 0 ? location.slice(0, 3).join(", ") : "PAN-India"}
          </div>
          <div className="font-mono text-[10px] text-muted truncate">
            {location && location.length > 3 ? `+ ${location.slice(3).join(", ")}` : "Various jurisdictions"}
          </div>
        </div>

        {/* Last Updated */}
        <div className="rounded-lg border border-border bg-surface p-4 space-y-1">
          <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase text-muted">
            <Calendar className="h-3.5 w-3.5" />
            <span>LAST LOGGED</span>
          </div>
          <div className="font-mono text-sm font-semibold text-foreground">
            {new Date(lastUpdated).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="font-mono text-[10px] text-muted">
            Edition 2026 index
          </div>
        </div>
      </div>

      {/* Contextual Street Breakdown & Tips */}
      {tipsOrContext && (
        <div className="rounded-xl border border-border bg-surface p-6 space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
            <Info className="h-4 w-4" />
            <span className="font-semibold text-foreground">SITUATIONAL CONTEXT & OBSERVATIONS</span>
          </div>
          <p className="font-sans text-sm text-muted-dark leading-relaxed">
            {tipsOrContext}
          </p>
        </div>
      )}

      {/* Report CTA Banner */}
      <ReportCTA defaultServiceId={offence.id} />

      {/* Common Aliases & Keywords */}
      <div className="pt-4 border-t border-border/80">
        <div className="font-mono text-[11px] uppercase tracking-wider text-muted mb-2 font-medium">
          COMMONLY SEARCHED AS:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {aliases.map((alias) => (
            <span
              key={alias}
              className="font-mono text-xs px-2.5 py-1 rounded bg-neutral-100 border border-border/60 text-muted-dark"
            >
              {alias}
            </span>
          ))}
        </div>
      </div>

      {/* Related Offences */}
      {relatedOffences.length > 0 && (
        <div className="pt-10 border-t border-border space-y-6">
          <div className="flex items-center justify-between">
            <div className="font-serif text-2xl font-bold text-foreground">
              Related Situations
            </div>
            <Link
              href={`/browse?category=${category}`}
              className="font-mono text-xs text-muted hover:text-foreground transition-colors"
            >
              VIEW ALL {category.toUpperCase()} →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedOffences.map((rel) => (
              <OffenceCard key={rel.id} offence={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Discreet Legal & Entertainment Notice */}
      <div className="p-4 rounded-lg bg-neutral-100/70 border border-border text-center font-mono text-[11px] text-muted">
        Reminder: All figures on this page represent crowdsourced informal reports and are provided for educational and entertainment context only.
      </div>
    </div>
  );
}

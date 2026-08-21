import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background pt-12 pb-16 transition-colors">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-border/60">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-lg font-bold tracking-tight text-foreground">
                THE FINE MENU
              </span>
              <span className="font-mono text-[10px] uppercase text-muted tracking-widest">
                EDITION 2026
              </span>
            </div>
            <p className="font-sans text-xs text-muted mt-1 italic">
              "You know what you did. We know what people say it costs."
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-muted">
            <Link href="/" className="hover:text-foreground transition-colors">
              HOME
            </Link>
            <Link href="/browse" className="hover:text-foreground transition-colors">
              DIRECTORY
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              ABOUT & METHODOLOGY
            </Link>
          </div>
        </div>

        {/* Discreet Legal & Satirical Disclaimer */}
        <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] leading-relaxed text-muted/80">
              <strong className="font-semibold text-foreground/80">DISCLAIMER:</strong>{" "}
              Unofficial, crowdsourced, and compiled strictly for entertainment & informational context. 
              These figures are not official government challans, statutory fees, or guarantees. 
              Do not treat them as legal advice or instructions to offer or settle any bribe.
            </p>
          </div>

          <div className="font-mono text-[11px] text-muted whitespace-nowrap">
            <span>BHOPAL · DELHI · MUMBAI · BENGALURU</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

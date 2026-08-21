"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { ReportModal } from "./ReportModal";

interface ReportCTAProps {
  defaultServiceId?: string;
  className?: string;
}

export function ReportCTA({ defaultServiceId, className = "" }: ReportCTAProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border border-border bg-surface shadow-xs ${className}`}>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-0.5">
            CONTRIBUTE TO DATASET
          </span>
          <h4 className="font-serif text-lg font-bold text-foreground">
            Can't find your situation or have a recent experience?
          </h4>
          <p className="font-sans text-xs text-muted">
            Submit an anonymous report to help improve crowdsourced estimates across India.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="shrink-0 inline-flex items-center gap-2 font-mono text-xs font-semibold px-4 py-2.5 rounded-lg border border-foreground bg-foreground text-background hover:bg-neutral-800 transition-all duration-150 active:scale-95"
        >
          <PlusCircle className="h-4 w-4" />
          <span>REPORT WHAT HAPPENED →</span>
        </button>
      </div>

      <ReportModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultServiceId={defaultServiceId}
      />
    </>
  );
}

import { Offence } from "@/types/offence";
import { OffenceCard } from "@/components/OffenceCard";

interface OffenceGridProps {
  offences: Offence[];
  onReset?: () => void;
}

export function OffenceGrid({ offences, onReset }: OffenceGridProps) {
  if (offences.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-dashed border-border p-12 sm:p-16 text-center my-8 bg-surface/50">
        <div className="max-w-md mx-auto space-y-3">
          <div className="font-mono text-xs uppercase tracking-widest text-muted">
            0 MATCHES FOUND
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Nothing found.
          </h3>
          <p className="font-sans text-sm sm:text-base text-muted leading-relaxed">
            Either you're innocent, or we haven't added your problem yet.
          </p>
          {onReset && (
            <div className="pt-3">
              <button
                type="button"
                onClick={onReset}
                className="font-mono text-xs px-4 py-2 rounded-full border border-foreground bg-foreground text-background hover:bg-neutral-800 transition-colors"
              >
                RESET FILTERS
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {offences.map((offence) => (
        <OffenceCard key={offence.id} offence={offence} />
      ))}
    </div>
  );
}

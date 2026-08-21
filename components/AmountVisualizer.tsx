import { ReportedAmount } from "@/types/offence";
import { formatINR } from "@/lib/utils";

interface AmountVisualizerProps {
  reportedAmount: ReportedAmount;
  compact?: boolean;
}

export function AmountVisualizer({ reportedAmount, compact = false }: AmountVisualizerProps) {
  const { min, max, typical } = reportedAmount;
  
  // Calculate relative position of typical between min and max (in percentage)
  const range = max - min;
  const percentage = range > 0 ? Math.min(Math.max(((typical - min) / range) * 100, 10), 90) : 50;

  if (compact) {
    return (
      <div className="w-full space-y-1">
        <div className="flex items-center justify-between font-mono text-[11px] text-muted">
          <span>Min {formatINR(min)}</span>
          <span className="font-semibold text-foreground">Typical {formatINR(typical)}</span>
          <span>Max {formatINR(max)}</span>
        </div>
        <div className="relative h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 bottom-0 bg-neutral-800 rounded-full"
            style={{ left: "0%", width: "100%" }}
          />
          <div
            className="absolute top-0 bottom-0 w-2 bg-black rounded-full shadow"
            style={{ left: `calc(${percentage}% - 4px)` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs text-muted uppercase tracking-wider">
          REPORTED RANGE
        </span>
        <span className="font-mono text-xs font-semibold text-foreground">
          {formatINR(min)} — {formatINR(max)}
        </span>
      </div>

      {/* Graphical distribution bar */}
      <div className="relative my-6 py-2">
        {/* Track */}
        <div className="h-2.5 w-full bg-neutral-100 rounded-full border border-border/60 relative">
          {/* Active Range Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-400 to-neutral-300 rounded-full" />
        </div>

        {/* Typical Marker Pin */}
        <div
          className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none"
          style={{ left: `${percentage}%` }}
        >
          <div className="bg-black text-white font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded shadow">
            {formatINR(typical)}
          </div>
          <div className="w-0.5 h-3 bg-black" />
          <div className="w-2.5 h-2.5 rounded-full bg-black ring-2 ring-white" />
        </div>
      </div>

      <div className="flex items-center justify-between font-mono text-xs text-muted pt-1">
        <div>
          <span className="block text-[10px] text-muted/80">LOWEST REPORTED</span>
          <span className="font-medium text-foreground">{formatINR(min)}</span>
        </div>
        <div className="text-center">
          <span className="block text-[10px] text-muted/80">MEDIAN / TYPICAL</span>
          <span className="font-semibold text-foreground">{formatINR(typical)}</span>
        </div>
        <div className="text-right">
          <span className="block text-[10px] text-muted/80">PEAK REPORTED</span>
          <span className="font-medium text-foreground">{formatINR(max)}</span>
        </div>
      </div>
    </div>
  );
}

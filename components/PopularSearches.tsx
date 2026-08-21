"use client";

interface PopularSearchesProps {
  onSelect: (query: string) => void;
}

const POPULAR_ITEMS = [
  "No helmet",
  "No licence",
  "Police verification",
  "GST",
  "Overspeeding",
  "Illegal parking",
  "Red light",
  "Wrong side",
];

export function PopularSearches({ onSelect }: PopularSearchesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-3">
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted font-medium mr-1">
        POPULAR SEARCHES:
      </span>
      {POPULAR_ITEMS.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelect(item)}
          className="font-mono text-xs px-2.5 py-1 rounded border border-border bg-white/70 hover:bg-black hover:text-white hover:border-black text-muted-dark transition-all duration-150 active:scale-95"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

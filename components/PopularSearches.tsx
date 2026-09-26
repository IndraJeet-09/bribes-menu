"use client";

import { useState, useEffect } from "react";

interface PopularSearchesProps {
  onSelect: (query: string) => void;
}

const FALLBACK_ITEMS = [
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
  const [popularItems, setPopularItems] = useState<string[]>(FALLBACK_ITEMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularSearches = async () => {
      try {
        const res = await fetch("/api/popular-searches");
        const data = await res.json();
        if (data.success && data.popularSearches) {
          setPopularItems(data.popularSearches);
        }
      } catch {
        // Keep fallback items
      } finally {
        setLoading(false);
      }
    };
    fetchPopularSearches();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-wrap items-center gap-2 pt-3">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted font-medium mr-1">
          POPULAR SEARCHES:
        </span>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse h-6 w-20 rounded border border-border bg-neutral-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pt-3">
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted font-medium mr-1">
        POPULAR SEARCHES:
      </span>
      {popularItems.map((item) => (
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

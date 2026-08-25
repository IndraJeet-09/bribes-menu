"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowUpRight, CornerDownLeft } from "lucide-react";
import { Offence } from "@/types/offence";
import { EnrichedOffence } from "@/lib/data/enriched-offences";
import { searchOffences } from "@/lib/search";
import { OFFENCES } from "@/data/offences";
import { formatINR } from "@/lib/utils";
import { PopularSearches } from "@/components/PopularSearches";

interface SearchBarProps {
  initialQuery?: string;
  onSearchChange?: (query: string, results: Offence[]) => void;
  showDropdown?: boolean;
  showPopularSearches?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  enrichedMap?: Map<string, EnrichedOffence>;
  isLoading?: boolean;
  error?: string | null;
}

export function SearchBar({
  initialQuery = "",
  onSearchChange,
  showDropdown = true,
  showPopularSearches = true,
  autoFocus = false,
  placeholder = "Search an offence, violation or situation (e.g. helmet, licence, tax, speed)...",
  enrichedMap,
  isLoading,
  error,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Offence[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery !== undefined) {
      setQuery(initialQuery);
      if (initialQuery.trim()) {
        const matches = searchOffences(OFFENCES, initialQuery);
        setResults(matches);
      }
    }
  }, [initialQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedIndex(-1);

    if (val.trim()) {
      const matches = searchOffences(OFFENCES, val);
      setResults(matches);
      setIsOpen(true);
      onSearchChange?.(val, matches);
    } else {
      setResults([]);
      setIsOpen(false);
      onSearchChange?.("", OFFENCES);
    }
  };

  const handleSelectPopular = (term: string) => {
    setQuery(term);
    const matches = searchOffences(OFFENCES, term);
    setResults(matches);
    setIsOpen(true);
    inputRef.current?.focus();
    onSearchChange?.(term, matches);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
    onSearchChange?.("", OFFENCES);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (!isOpen || results.length === 0) {
      if (e.key === "Enter" && query.trim()) {
        router.push(`/browse?q=${encodeURIComponent(query.trim())}`);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < Math.min(results.length, 6) - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : Math.min(results.length, 6) - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        const selected = results[selectedIndex];
        router.push(`/offence/${selected.slug}`);
        setIsOpen(false);
      } else if (results.length > 0) {
        router.push(`/offence/${results[0].slug}`);
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="group relative flex items-center w-full rounded-xl border-2 border-foreground/80 bg-surface px-4 py-3 sm:py-3.5 shadow-sm transition-all focus-within:border-black focus-within:ring-4 focus-within:ring-black/5">
        <Search className="h-5 w-5 text-muted-dark shrink-0 mr-3 transition-colors group-focus-within:text-black" />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim() && results.length > 0) setIsOpen(true);
          }}
          autoFocus={autoFocus}
          placeholder={placeholder}
          aria-label="Search offences and reported amounts"
          className="w-full bg-transparent font-sans text-base sm:text-lg text-foreground placeholder:text-muted focus:outline-none"
        />

        {query ? (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded text-muted hover:text-foreground hover:bg-neutral-100 transition-colors mr-1"
            aria-label="Clear search query"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] text-muted border border-border px-1.5 py-0.5 rounded bg-neutral-50">
            <span>PRESS</span>
            <kbd className="font-semibold">/</kbd>
          </div>
        )}
      </div>

      {showPopularSearches && !query && (
        <PopularSearches onSelect={handleSelectPopular} />
      )}

      {showDropdown && isOpen && query.trim() !== "" && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl border border-border bg-surface shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden animate-slide-down"
        >
          {isLoading ? (
            <div className="p-8 space-y-3 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <div className="h-4 w-16 rounded bg-neutral-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-neutral-200" />
                    <div className="h-3 w-1/2 rounded bg-neutral-200" />
                  </div>
                  <div className="h-6 w-20 rounded bg-neutral-200" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="font-serif text-xl font-bold text-foreground mb-1">
                Unable to load estimates
              </div>
              <p className="font-sans text-sm text-muted max-w-sm mx-auto leading-relaxed">
                The database is temporarily unavailable. Search results may not show current amounts.
              </p>
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-50 border-b border-border font-mono text-[11px] text-muted">
                <span>{results.length} MATCH{results.length === 1 ? "" : "ES"} FOUND</span>
                <span className="hidden sm:inline">USE ↑↓ TO NAVIGATE · ENTER TO VIEW</span>
              </div>

              <ul className="max-h-[380px] overflow-y-auto divide-y divide-border/60">
                {results.slice(0, 7).map((item, index) => {
                  const isSelected = index === selectedIndex;
                  const enriched = enrichedMap?.get(item.slug);
                  // Only show DB-backed monetary values, not static fallbacks
                  const typical = enriched?.dbTypical;
                  const min = enriched?.dbMin;
                  const max = enriched?.dbMax;
                  const reportCount = enriched?.dbReportCount;

                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          router.push(`/offence/${item.slug}`);
                          setIsOpen(false);
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full text-left flex items-center justify-between p-4 transition-colors ${
                          isSelected ? "bg-neutral-100" : "hover:bg-neutral-50"
                        }`}
                      >
                        <div className="pr-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] uppercase font-semibold text-muted tracking-wider">
                              {item.category}
                            </span>
                            <span className="text-[10px] text-muted/60">·</span>
                            <span className="font-mono text-[10px] text-muted">
                              {reportCount !== undefined ? `${reportCount} reports` : "Loading..."}
                            </span>
                          </div>
                          <div className="font-serif text-lg font-bold text-foreground mt-0.5">
                            {item.title}
                          </div>
                          <div className="font-sans text-xs text-muted truncate max-w-md mt-0.5">
                            {item.description}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {typical !== undefined && min !== undefined && max !== undefined && typical > 0 ? (
                            <>
                              <div className="font-serif text-lg font-bold text-foreground">
                                {formatINR(typical)}
                              </div>
                              <div className="font-mono text-[10px] text-muted">
                                {formatINR(min)} — {formatINR(max)}
                              </div>
                            </>
                          ) : typical !== undefined && typical === 0 ? (
                            <div className="font-mono text-[11px] text-muted italic">
                              Estimate pending
                            </div>
                          ) : (
                            <div className="h-6 w-20 animate-pulse bg-neutral-200 rounded" />
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {results.length > 7 && (
                <div className="p-3 bg-neutral-50 border-t border-border text-center">
                  <button
                    type="button"
                    onClick={() => {
                      router.push(`/browse?q=${encodeURIComponent(query)}`);
                      setIsOpen(false);
                    }}
                    className="font-mono text-xs font-semibold text-foreground hover:underline inline-flex items-center gap-1"
                  >
                    <span>VIEW ALL {results.length} RESULTS IN DIRECTORY</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="font-serif text-xl font-bold text-foreground mb-1">
                Nothing found.
              </div>
              <p className="font-sans text-sm text-muted max-w-sm mx-auto leading-relaxed">
                Either you&apos;re completely innocent, or we haven&apos;t documented your particular predicament yet.
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setIsOpen(false);
                    onSearchChange?.("", OFFENCES);
                  }}
                  className="font-mono text-xs px-3 py-1.5 rounded border border-border bg-neutral-100 hover:bg-black hover:text-white transition-colors"
                >
                  CLEAR SEARCH
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

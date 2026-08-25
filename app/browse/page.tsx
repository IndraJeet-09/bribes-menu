"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { OFFENCES, CATEGORIES } from "@/data/offences";
import { Category, Offence } from "@/types/offence";
import { SearchBar } from "@/components/SearchBar";
import { OffenceGrid } from "@/components/OffenceGrid";
import { searchOffences } from "@/lib/search";
import { useEnrichedOffences } from "@/lib/data/enriched-offences";
import { ArrowUpDown, SlidersHorizontal, RotateCcw } from "lucide-react";

type SortOption = "reports-desc" | "amount-desc" | "amount-asc" | "title-asc" | "date-desc";

function BrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("q") || "";
  const initialCategory = (searchParams.get("category") as Category | "all") || "all";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>("reports-desc");

  const { enriched, isLoading, error } = useEnrichedOffences(OFFENCES);

  const enrichedMap = useMemo(() => {
    const map = new Map<string, (typeof enriched)[0]>();
    for (const e of enriched) {
      map.set(e.slug, e);
    }
    return map;
  }, [enriched]);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const cat = (searchParams.get("category") as Category | "all") || "all";
    setQuery(q);
    setSelectedCategory(cat);
  }, [searchParams]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const offence of OFFENCES) {
      counts[offence.category] = (counts[offence.category] || 0) + 1;
    }
    return counts;
  }, []);

  const processedOffences = useMemo(() => {
    let list = [...enriched];

    if (query.trim()) {
      list = searchOffences(enriched, query) as typeof enriched;
    }

    if (selectedCategory !== "all") {
      list = list.filter((item) => item.category === selectedCategory);
    }

    const sorted = [...list];
    switch (sortBy) {
      case "amount-desc":
        sorted.sort((a, b) => b.dbTypical - a.dbTypical);
        break;
      case "amount-asc":
        sorted.sort((a, b) => a.dbTypical - b.dbTypical);
        break;
      case "reports-desc":
        sorted.sort((a, b) => b.dbReportCount - a.dbReportCount);
        break;
      case "title-asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "date-desc":
        sorted.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
        break;
      default:
        break;
    }

    return sorted;
  }, [query, selectedCategory, sortBy, enriched]);

  const handleCategoryChange = (cat: Category | "all") => {
    setSelectedCategory(cat);
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "all") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    router.push(`/browse?${params.toString()}`);
  };

  const handleSearchChange = (val: string) => {
    setQuery(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val.trim()) {
      params.set("q", val);
    } else {
      params.delete("q");
    }
    router.push(`/browse?${params.toString()}`);
  };

  const handleReset = () => {
    setQuery("");
    setSelectedCategory("all");
    setSortBy("reports-desc");
    router.push("/browse");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-border">
        <div className="font-mono text-xs uppercase tracking-widest text-muted">
          COMPREHENSIVE DIRECTORY
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Browse All Reported Situations
        </h1>
        <p className="font-sans text-sm sm:text-base text-muted max-w-2xl">
          Search across {OFFENCES.length} documented offences, administrative bottlenecks, and roadside encounters with reported crowd estimates.
        </p>
      </div>

      {/* Search Input Bar */}
      <div>
        <SearchBar
          initialQuery={query}
          onSearchChange={handleSearchChange}
          showDropdown={false}
          showPopularSearches={false}
          placeholder="Filter directory by offence, keywords, or context..."
          enrichedMap={enrichedMap}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          <button
            type="button"
            onClick={() => handleCategoryChange("all")}
            className={`font-mono text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
              selectedCategory === "all"
                ? "bg-foreground text-background border-foreground font-semibold"
                : "bg-surface text-muted border-border hover:text-foreground"
            }`}
          >
            ALL ({OFFENCES.length})
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`font-mono text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-foreground text-background border-foreground font-semibold"
                    : "bg-surface text-muted border-border hover:text-foreground"
                }`}
              >
                <span>{cat.label.toUpperCase()}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0 font-mono text-xs">
          <span className="text-muted flex items-center gap-1">
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>SORT:</span>
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-surface border border-border rounded px-2.5 py-1 text-foreground font-mono text-xs focus:outline-none focus:border-foreground"
          >
            <option value="reports-desc">Most Reports</option>
            <option value="amount-desc">Typical: High to Low</option>
            <option value="amount-asc">Typical: Low to High</option>
            <option value="title-asc">Alphabetical (A-Z)</option>
            <option value="date-desc">Recently Updated</option>
          </select>

          {(query || selectedCategory !== "all") && (
            <button
              type="button"
              onClick={handleReset}
              title="Reset filters"
              className="p-1 text-muted hover:text-foreground rounded border border-border bg-surface transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between font-mono text-xs text-muted border-b border-border/60 pb-3">
        <span>
          SHOWING {processedOffences.length} OF {OFFENCES.length} SITUATIONS
        </span>
        {query && (
          <span>
            MATCHING QUERY: <strong className="text-foreground">&quot;{query}&quot;</strong>
          </span>
        )}
      </div>

      {/* Grid of Offences */}
      <OffenceGrid offences={processedOffences} onReset={handleReset} isLoading={isLoading} error={error} />
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-20 text-center font-mono text-xs text-muted">
          LOADING DIRECTORY...
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}

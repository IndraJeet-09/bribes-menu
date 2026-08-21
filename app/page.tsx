"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { OFFENCES } from "@/data/offences";
import { Category, Offence } from "@/types/offence";
import { SearchBar } from "@/components/SearchBar";
import { CategoryTabs } from "@/components/CategoryTabs";
import { OffenceGrid } from "@/components/OffenceGrid";
import { searchOffences } from "@/lib/search";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const offence of OFFENCES) {
      counts[offence.category] = (counts[offence.category] || 0) + 1;
    }
    return counts;
  }, []);

  // Filter offences by search and category
  const filteredOffences = useMemo(() => {
    let list = OFFENCES;

    if (searchQuery.trim()) {
      list = searchOffences(OFFENCES, searchQuery);
    }

    if (selectedCategory !== "all") {
      list = list.filter((item) => item.category === selectedCategory);
    }

    return list;
  }, [searchQuery, selectedCategory]);

  const handleSearchChange = (query: string, results: Offence[]) => {
    setSearchQuery(query);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Editorial Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6 pb-10 sm:pb-14">
        {/* Subtle Edition Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-muted font-mono text-[11px] uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
          <span>INDIA UNREDACTED · 2026 EDITION</span>
        </div>

        {/* High Character Editorial Headline */}
        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-foreground leading-[0.95] uppercase">
          THE
          <br />
          UNOFFICIAL
          <br />
          FINE MENU
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-lg sm:text-2xl text-muted font-normal max-w-xl mx-auto leading-snug">
          You know what you did.
          <br />
          <span className="text-foreground font-medium">
            We know what people say it costs.
          </span>
        </p>

        {/* Prominent Search Bar */}
        <div className="pt-4">
          <SearchBar
            initialQuery={searchQuery}
            onSearchChange={handleSearchChange}
            showDropdown={true}
            showPopularSearches={true}
          />
        </div>

        {/* Sub-search microcopy */}
        <p className="font-mono text-xs text-muted pt-1">
          {OFFENCES.length} things you probably shouldn't have done.
        </p>
      </div>

      {/* Category Navigation & Section Divider */}
      <div className="pt-8 pb-6 border-t border-border/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted font-semibold">
              EXPLORE CATEGORIES
            </span>
          </div>

          <Link
            href="/browse"
            className="group inline-flex items-center gap-1 font-mono text-xs text-muted hover:text-foreground transition-colors self-start sm:self-auto"
          >
            <span>FULL DIRECTORY INDEX</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <CategoryTabs
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
        />
      </div>

      {/* Active Filter Notice if applied */}
      {(selectedCategory !== "all" || searchQuery) && (
        <div className="flex items-center justify-between py-3 px-4 mb-6 rounded-lg bg-surface border border-border text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-muted">SHOWING:</span>
            <span className="font-semibold text-foreground">
              {filteredOffences.length} RESULT{filteredOffences.length === 1 ? "" : "S"}
            </span>
            {selectedCategory !== "all" && (
              <span className="bg-neutral-100 px-2 py-0.5 rounded text-[11px] uppercase">
                Category: {selectedCategory}
              </span>
            )}
            {searchQuery && (
              <span className="bg-neutral-100 px-2 py-0.5 rounded text-[11px]">
                Query: "{searchQuery}"
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-muted hover:text-foreground underline underline-offset-2"
          >
            Reset
          </button>
        </div>
      )}

      {/* Offence Grid */}
      <div className="py-4">
        <OffenceGrid offences={filteredOffences} onReset={handleReset} />
      </div>

      {/* Editorial Footer Quote / Stat Banner */}
      <div className="mt-16 rounded-2xl border border-border bg-surface p-8 sm:p-10 text-center space-y-4">
        <div className="max-w-2xl mx-auto">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            THE STREET PROTOCOL
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-2">
            "Unfortunately, there is no printed tariff card on the dashboard."
          </h2>
          <p className="font-sans text-xs sm:text-sm text-muted mt-2 leading-relaxed">
            Data aggregated from public disclosures, community accounts, and real-world urban narratives across Indian metros. 
            All amounts are reported estimates, not fixed rates or legal counsel.
          </p>
          <div className="pt-4">
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 font-mono text-xs px-4 py-2 rounded border border-border hover:bg-neutral-100 transition-colors"
            >
              <span>READ METHODOLOGY & PHILOSOPHY</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

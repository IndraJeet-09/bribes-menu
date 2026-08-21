"use client";

import { Category } from "@/types/offence";
import { CATEGORIES } from "@/data/offences";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  selectedCategory: Category | "all";
  onSelectCategory: (category: Category | "all") => void;
  categoryCounts?: Record<string, number>;
}

export function CategoryTabs({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: CategoryTabsProps) {
  const allCount = categoryCounts
    ? Object.values(categoryCounts).reduce((acc, c) => acc + c, 0)
    : undefined;

  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {/* ALL TAB */}
        <button
          type="button"
          onClick={() => onSelectCategory("all")}
          className={cn(
            "font-mono text-xs sm:text-xs tracking-wider px-3.5 py-1.5 rounded-full border whitespace-nowrap transition-all duration-150 active:scale-95",
            selectedCategory === "all"
              ? "bg-foreground text-background border-foreground font-semibold shadow-sm"
              : "bg-surface text-muted border-border hover:border-foreground/40 hover:text-foreground"
          )}
        >
          ALL {allCount !== undefined && `(${allCount})`}
        </button>

        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = categoryCounts ? categoryCounts[cat.id] : undefined;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "font-mono text-xs sm:text-xs tracking-wider px-3.5 py-1.5 rounded-full border whitespace-nowrap transition-all duration-150 active:scale-95 flex items-center gap-1.5",
                isSelected
                  ? "bg-foreground text-background border-foreground font-semibold shadow-sm"
                  : "bg-surface text-muted border-border hover:border-foreground/40 hover:text-foreground"
              )}
            >
              <span>{cat.label.toUpperCase()}</span>
              {count !== undefined && count > 0 && (
                <span
                  className={cn(
                    "text-[10px] px-1 rounded",
                    isSelected ? "text-background/80" : "text-muted"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

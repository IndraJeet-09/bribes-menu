"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types/offence";
import { CATEGORIES } from "@/data/offences";
import { cn } from "@/lib/utils";

interface CategoryFromDb {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

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
  const [dbCategories, setDbCategories] = useState<CategoryFromDb[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success && data.categories) {
          setDbCategories(data.categories);
        }
      } catch {
        // Fallback to static categories
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Merge DB categories with static CATEGORIES for label/icon/description
  // DB categories have slug as primary key, static CATEGORIES have id as primary key
  const mergedCategories = CATEGORIES.map((cat) => {
    const dbCat = dbCategories.find((d) => d.slug === cat.id);
    return {
      ...cat,
      dbId: dbCat?.id,
    };
  });

  const allCount = categoryCounts
    ? Object.values(categoryCounts).reduce((acc, c) => acc + c, 0)
    : undefined;

  if (categoriesLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="animate-pulse flex items-center gap-1.5">
            <div className="h-6 w-16 rounded-full bg-neutral-200" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-6 w-20 rounded-full bg-neutral-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

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

        {mergedCategories.map((cat) => {
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

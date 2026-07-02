"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BlogCategoryDTO } from "@/types/blog";
import clsx from "clsx";

interface BlogCategoryFiltersProps {
  categories: BlogCategoryDTO[];
}

export function BlogCategoryFilters({ categories }: BlogCategoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  const handleCategorySelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    params.delete("page"); // Reset to page 1 on category change
    router.push(`/blog?${params.toString()}`, { scroll: false });
  };

  const allCategory = { id: "cat-all", name: "All", slug: "all" };
  const fullCategories = [allCategory, ...categories.filter((c) => c.slug !== "all")];

  return (
    <div className="bg-white py-4 border-b border-aera-champagne/20 sticky top-[72px] z-10 shadow-sm/5 scrollbar-hide overflow-x-auto flex justify-start md:justify-center items-center gap-2 px-4">
      {fullCategories.map((c) => {
        const isActive = activeCategory === c.slug;
        return (
          <button
            key={c.id}
            onClick={() => handleCategorySelect(c.slug)}
            className={clsx(
              "px-5 py-2 rounded-full font-sans text-xs tracking-wider transition-all duration-300 border cursor-pointer whitespace-nowrap",
              {
                "bg-aera-accent text-white border-aera-accent font-bold shadow-sm": isActive,
                "bg-aera-cream/20 text-aera-muted border-aera-champagne/45 hover:text-aera-accent hover:border-aera-accent/40": !isActive,
              }
            )}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
export default BlogCategoryFilters;

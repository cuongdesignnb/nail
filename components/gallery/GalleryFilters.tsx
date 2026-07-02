"use client";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/common/Container";
import { GalleryCategoryDTO } from "@/types/gallery";

function FilterBar({ categories }: { categories: GalleryCategoryDTO[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  const handleFilterClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    router.push(`/gallery?${params.toString()}`, { scroll: false });
  };

  const allCategory = { id: "cat-all", name: "All", slug: "all" };
  const filterList = [allCategory, ...categories];

  return (
    <section className="bg-aera-bg pt-8 pb-4">
      <Container>
        <div className="flex items-center justify-start lg:justify-center overflow-x-auto gap-3 pb-3 scrollbar-hide">
          {filterList.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleFilterClick(cat.slug)}
                className={`px-5 py-2 rounded-full font-sans text-xs tracking-wider transition-all duration-300 whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-aera-accent text-aera-bg shadow-sm font-bold border border-aera-accent"
                    : "bg-aera-champagne/20 text-aera-muted border border-aera-champagne/45 hover:border-aera-accent/30"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function GalleryFilters({ categories }: { categories: GalleryCategoryDTO[] }) {
  return (
    <Suspense fallback={<div className="h-10" />}>
      <FilterBar categories={categories} />
    </Suspense>
  );
}
export default GalleryFilters;

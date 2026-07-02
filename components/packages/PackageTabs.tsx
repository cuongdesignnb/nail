"use client";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/common/Container";
import { PackageCategoryDTO } from "@/types/packages";

function FilterBar({ categories }: { categories: PackageCategoryDTO[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "all";

  const handleTabClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("tab");
    } else {
      params.set("tab", slug);
    }
    router.push(`/packages?${params.toString()}`, { scroll: false });
  };

  const allCategory = { id: "pcat-all", name: "All Packages", slug: "all" };
  const filterList = [allCategory, ...categories];

  return (
    <section className="bg-aera-bg pt-8 pb-4">
      <Container>
        <div className="flex items-center justify-start lg:justify-center overflow-x-auto gap-3 pb-3 scrollbar-hide">
          {filterList.map((cat) => {
            const isActive = activeTab === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleTabClick(cat.slug)}
                className={`px-5 py-2.5 rounded-full font-sans text-xs tracking-wider transition-all duration-300 whitespace-nowrap shrink-0 cursor-pointer ${
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

export function PackageTabs({ categories }: { categories: PackageCategoryDTO[] }) {
  return (
    <Suspense fallback={<div className="h-12" />}>
      <FilterBar categories={categories} />
    </Suspense>
  );
}
export default PackageTabs;

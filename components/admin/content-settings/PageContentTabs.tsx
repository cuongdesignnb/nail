"use client";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const PAGES = [
  { key: "home", label: "Homepage" },
  { key: "about", label: "About Us" },
  { key: "services", label: "Services Page" },
  { key: "gallery", label: "Nail Gallery" },
  { key: "packages", label: "Nail Packages" },
  { key: "blog", label: "Blog Journal" },
  { key: "booking", label: "Online Booking" },
  { key: "contact", label: "Contact Us" },
  { key: "global", label: "Global Settings" },
];

function TabsBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activePage = searchParams.get("pageKey") || "home";

  const handlePageClick = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageKey", key);
    router.push(`/admin/content-settings?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center justify-start overflow-x-auto gap-2 border-b border-[var(--admin-border)]/45 pb-3 scrollbar-hide">
      {PAGES.map((p) => {
        const isActive = activePage === p.key;
        return (
          <button
            key={p.key}
            onClick={() => handlePageClick(p.key)}
            className={`px-4 py-2 rounded-full font-sans text-xs tracking-wider transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer border-none ${
              isActive
                ? "bg-[var(--admin-accent)] text-white font-bold shadow-sm"
                : "bg-[var(--admin-surface-muted)] text-[var(--admin-muted)] hover:bg-[var(--admin-surface-hover)]"
            }`}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}

export function PageContentTabs() {
  return (
    <Suspense fallback={<div className="h-10 border-b" />}>
      <TabsBar />
    </Suspense>
  );
}
export default PageContentTabs;

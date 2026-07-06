"use client";

import type { SeoAuditRow } from "@/lib/seo/seo.types";

export function SeoHealthDashboard({ rows }: { rows: SeoAuditRow[] }) {
  const missingTitle = rows.filter((row) => row.titleStatus !== "OK").length;
  const missingDescription = rows.filter((row) => row.descriptionStatus !== "OK" && row.descriptionStatus !== "Entity fallback").length;
  const missingOg = rows.filter((row) => row.ogStatus !== "OK").length;
  const noindex = rows.filter((row) => row.sitemapStatus === "Excluded").length;

  const metrics = [
    ["Indexable URLs", rows.filter((row) => row.sitemapStatus === "Included").length],
    ["Missing Title", missingTitle],
    ["Missing Description", missingDescription],
    ["Missing OG Image", missingOg],
    ["Noindex URLs", noindex],
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {metrics.map(([label, value]) => (
        <div key={label} className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-[var(--admin-muted)]">{label}</div>
          <div className="mt-2 text-2xl font-bold text-[var(--admin-ink)]">{value}</div>
        </div>
      ))}
    </div>
  );
}


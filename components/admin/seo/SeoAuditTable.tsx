"use client";

import type { SeoAuditRow } from "@/lib/seo/seo.types";

export function SeoAuditTable({ rows }: { rows: SeoAuditRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-aera-champagne/30 text-aera-muted">
            <tr>
              {["URL", "Type", "Source", "Title", "Description", "Canonical", "OG", "Schema", "Sitemap", "Action"].map((header) => (
                <th key={header} className="px-3 py-2 font-bold uppercase tracking-wide">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.type}-${row.url}`} className="border-t border-gray-100">
                <td className="max-w-[220px] truncate px-3 py-2">{row.url}</td>
                <td className="px-3 py-2">{row.type}</td>
                <td className="px-3 py-2">{row.metadataSource}</td>
                <td className="px-3 py-2">{row.titleStatus}</td>
                <td className="px-3 py-2">{row.descriptionStatus}</td>
                <td className="px-3 py-2">{row.canonicalStatus}</td>
                <td className="px-3 py-2">{row.ogStatus}</td>
                <td className="px-3 py-2">{row.schemaStatus}</td>
                <td className="px-3 py-2">{row.sitemapStatus}</td>
                <td className="px-3 py-2">
                  <a className="font-semibold text-aera-accent hover:underline" href={row.action}>Open</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


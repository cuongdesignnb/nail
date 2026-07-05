"use client";

export function SeoSitemapPanel() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-bold text-aera-ink">Sitemap & Indexing</h3>
      <p className="mt-2 text-sm text-aera-muted">Sitemap URLs are generated from published static pages, active service detail routes, and published blog articles only.</p>
      <a className="mt-3 inline-flex text-sm font-semibold text-aera-accent hover:underline" href="/sitemap.xml" target="_blank">Open sitemap.xml</a>
    </div>
  );
}


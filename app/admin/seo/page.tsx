"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SeoAuditTable } from "@/components/admin/seo/SeoAuditTable";
import { SeoEntityEditor } from "@/components/admin/seo/SeoEntityEditor";
import { SeoEntityList, type SeoEntityListItem } from "@/components/admin/seo/SeoEntityList";
import { SeoHealthDashboard } from "@/components/admin/seo/SeoHealthDashboard";
import { SeoSitemapPanel } from "@/components/admin/seo/SeoSitemapPanel";
import type { SeoAuditRow } from "@/lib/seo/seo.types";

const STATIC_PAGES = [
  ["Home", "home", "/"],
  ["About", "about", "/about"],
  ["Services", "services", "/services"],
  ["Gallery", "gallery", "/gallery"],
  ["Packages", "packages", "/packages"],
  ["Promotions", "promotions", "/promotions"],
  ["Contact", "contact", "/contact"],
  ["Blog", "blog", "/blog"],
] as const;

export default function SeoManagerPage() {
  const [rows, setRows] = useState<SeoAuditRow[]>([]);
  const [entities, setEntities] = useState<SeoEntityListItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [auditRes, entitiesRes] = await Promise.all([
        fetch("/api/admin/seo/audit"),
        fetch("/api/admin/seo/entities"),
      ]);
      const [auditJson, entitiesJson] = await Promise.all([auditRes.json(), entitiesRes.json()]);
      if (auditJson.success) setRows(auditJson.data);
      if (entitiesJson.success) {
        setEntities(entitiesJson.data.entities);
        const first = entitiesJson.data.entities[0]?.scopeKey || null;
        setSelected((current) => current || first);
      }
      setLoading(false);
    }
    load().catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    fetch(`/api/admin/seo/entities/${encodeURIComponent(selected)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setSelectedData(json.data);
      })
      .catch(() => setSelectedData(null));
  }, [selected]);

  const selectedEntity = useMemo(
    () => entities.find((entity) => entity.scopeKey === selected),
    [entities, selected],
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-aera-ink">SEO Manager</h1>
        <p className="text-sm text-aera-muted">Static page SEO is managed in Content Hub. Entity-level overrides live here.</p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-sm text-aera-muted">Loading SEO audit...</div>
      ) : (
        <>
          <SeoHealthDashboard rows={rows} />

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-aera-muted">
              <Search size={15} /> Static Pages
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {STATIC_PAGES.map(([label, pageKey, path]) => (
                <a key={pageKey} href={`/admin/content/${pageKey}?tab=seo`} className="rounded-lg border border-gray-100 p-4 transition hover:border-aera-accent/40 hover:bg-aera-champagne/20">
                  <div className="text-sm font-semibold text-aera-ink">{label}</div>
                  <div className="mt-1 text-xs text-aera-muted">{path}</div>
                  <div className="mt-3 text-xs font-bold text-aera-accent">Managed in Content Hub</div>
                </a>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[340px_1fr]">
            <div>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-aera-muted">Dynamic Content</h2>
              <SeoEntityList entities={entities} selected={selected} onSelect={setSelected} />
            </div>
            <div>
              {selected && selectedData ? (
                <div>
                  {selectedEntity && (
                    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
                      <div className="text-sm font-bold text-aera-ink">{selectedEntity.label}</div>
                      <div className="text-xs text-aera-muted">{selectedEntity.type} · {selectedEntity.path}</div>
                    </div>
                  )}
                  <SeoEntityEditor scopeKey={selected} initialData={selectedData} onSaved={setSelectedData} />
                </div>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-white p-8 text-sm text-aera-muted">Select a public entity to edit SEO overrides.</div>
              )}
            </div>
          </section>

          <SeoSitemapPanel />
          <SeoAuditTable rows={rows} />
        </>
      )}
    </div>
  );
}


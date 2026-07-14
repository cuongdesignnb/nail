"use client";

import React from "react";
import { Save } from "lucide-react";
import { useToast } from "@/components/admin/ui/AdminToastProvider";
import { useSettingsForm } from "@/hooks/admin/useSettingsForm";
import { SettingsStatusFooter } from "./SettingsStatusFooter";

type SeoSettings = {
  titleTemplate: string; defaultRobots: string; locale: string; twitterCard: string; twitterHandle?: string | null;
  priceRange?: string | null; googleBusinessProfileUrl?: string | null; googleMapsUrl?: string | null;
  latitude?: number | null; longitude?: number | null; googleSiteVerification?: string | null; bingSiteVerification?: string | null;
  enableWebSiteSchema: boolean; enableNailSalonSchema: boolean; enableBreadcrumbSchema: boolean;
  enableFaqSchema: boolean; enableArticleSchema: boolean; enableServiceSchema: boolean;
};

const boolFields: Array<[keyof SeoSettings, string]> = [
  ["enableWebSiteSchema", "Enable WebSite Schema"], ["enableNailSalonSchema", "Enable Nail Salon Schema"],
  ["enableBreadcrumbSchema", "Enable Breadcrumb Schema"], ["enableFaqSchema", "Enable FAQ Schema"],
  ["enableArticleSchema", "Enable Article Schema"], ["enableServiceSchema", "Enable Service Schema"],
];
const textFields: Array<[keyof SeoSettings, string]> = [
  ["titleTemplate", "Site Title Template"], ["locale", "Locale"], ["twitterHandle", "Twitter Handle"],
  ["priceRange", "Price Range"], ["googleBusinessProfileUrl", "Google Business Profile URL"],
  ["googleMapsUrl", "Google Maps URL"], ["latitude", "Latitude"], ["longitude", "Longitude"],
  ["googleSiteVerification", "Google Verification"], ["bingSiteVerification", "Bing Verification"],
];
const inputClass = "w-full rounded-xl border border-[var(--admin-border-strong)] bg-white px-3 py-2.5 text-xs focus:border-[var(--admin-accent)] focus:outline-none";

function normalizeSeo(value: SeoSettings): SeoSettings {
  return {
    ...value,
    latitude: value.latitude === null || value.latitude === undefined || String(value.latitude) === "" ? null : Number(value.latitude),
    longitude: value.longitude === null || value.longitude === undefined || String(value.longitude) === "" ? null : Number(value.longitude),
  };
}

export default function SeoSiteSettings() {
  const toast = useToast();
  const form = useSettingsForm<SeoSettings>({ url: "/api/admin/seo/site-settings", normalize: normalizeSeo });
  React.useEffect(() => { form.load().catch(() => undefined); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (form.loading && !form.data) return <p className="rounded-xl border bg-white p-6 text-sm text-[var(--admin-muted)]">Loading SEO settings...</p>;
  if (!form.data) return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{form.error || "Unable to load SEO settings."} <button className="font-bold underline" onClick={() => form.reload().catch(() => undefined)}>Retry</button></div>;
  async function save() { const saved = await form.save(); saved ? toast.success("SEO settings saved, revalidated, and verified.") : toast.error(form.error || "Unable to save SEO settings."); }
  return <div className="max-w-4xl space-y-5 rounded-xl border border-[var(--admin-border)] bg-white p-6">
    <div><h3 className="text-sm font-bold">SEO & Search Visibility</h3><p className="text-[11px] text-[var(--admin-muted)]">Controls metadata, verification, robots, sitemap and rendered schema toggles.</p></div>
    <div className="grid gap-4 md:grid-cols-2">
      {textFields.map(([key, label]) => <label key={key} className="text-xs font-semibold">{label}<input className={inputClass} type={key === "latitude" || key === "longitude" ? "number" : "text"} value={form.data![key] == null ? "" : String(form.data![key])} onChange={(event) => form.setField(key, ((key === "latitude" || key === "longitude") ? (event.target.value === "" ? null : Number(event.target.value)) : event.target.value) as never)} />{form.fieldErrors[key]?.[0] && <span className="text-red-600">{form.fieldErrors[key][0]}</span>}</label>)}
      <label className="text-xs font-semibold">Default Robots<select className={inputClass} value={form.data.defaultRobots} onChange={(event) => form.setField("defaultRobots", event.target.value)}><option>index,follow</option><option>index,nofollow</option><option>noindex,follow</option><option>noindex,nofollow</option></select></label>
      <label className="text-xs font-semibold">Twitter Card<select className={inputClass} value={form.data.twitterCard} onChange={(event) => form.setField("twitterCard", event.target.value)}><option value="summary_large_image">Summary with Large Image</option><option value="summary">Summary</option></select></label>
    </div>
    <div className="grid gap-2 md:grid-cols-2">{boolFields.map(([key, label]) => <label key={key} className="flex items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={Boolean(form.data![key])} onChange={(event) => form.setField(key, event.target.checked as never)} />{label}</label>)}</div>
    <button onClick={save} disabled={form.saving || !form.isDirty} className="inline-flex items-center gap-2 rounded-full bg-[var(--admin-accent)] px-5 py-2 text-xs font-bold uppercase text-white disabled:opacity-40"><Save size={14} />{form.saving ? "Saving..." : "Save SEO Settings"}</button>
    <SettingsStatusFooter {...form} onReload={() => form.reload().catch(() => undefined)} />
  </div>;
}

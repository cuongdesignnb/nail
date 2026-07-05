"use client";

import React from "react";
import { ExternalLink, Save } from "lucide-react";

type Settings = {
  titleTemplate: string;
  defaultRobots: string;
  locale: string;
  twitterCard: string;
  twitterHandle?: string | null;
  priceRange?: string | null;
  googleBusinessProfileUrl?: string | null;
  googleMapsUrl?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  googleSiteVerification?: string | null;
  bingSiteVerification?: string | null;
  enableWebSiteSchema: boolean;
  enableNailSalonSchema: boolean;
  enableBreadcrumbSchema: boolean;
  enableFaqSchema: boolean;
  enableArticleSchema: boolean;
  enableServiceSchema: boolean;
};

const boolFields: Array<[keyof Settings, string]> = [
  ["enableWebSiteSchema", "Enable WebSite Schema"],
  ["enableNailSalonSchema", "Enable Nail Salon Schema"],
  ["enableBreadcrumbSchema", "Enable Breadcrumb Schema"],
  ["enableFaqSchema", "Enable FAQ Schema"],
  ["enableArticleSchema", "Enable Article Schema"],
  ["enableServiceSchema", "Enable Service Schema"],
];

export default function SeoSiteSettings() {
  const [form, setForm] = React.useState<Settings | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  React.useEffect(() => {
    fetch("/api/admin/seo/site-settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setForm(json.data);
      })
      .catch(() => {});
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
    setSaved(false);
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    const res = await fetch("/api/admin/seo/site-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setSaving(false);
    if (json.success) {
      setForm(json.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  if (!form) return <div className="rounded-xl border border-aera-champagne/30 bg-white p-6 text-sm text-aera-muted">Loading SEO settings...</div>;

  const inputClass = "w-full rounded-xl border border-aera-champagne/60 bg-white px-3 py-2.5 text-xs text-aera-ink focus:border-aera-accent focus:outline-none";

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-xl border border-aera-champagne/30 bg-white p-6">
        <h3 className="text-sm font-bold text-aera-ink">SEO & Search Visibility</h3>
        <div className="mt-4 rounded-lg bg-aera-champagne/20 p-3 text-xs text-aera-muted">
          <div className="font-semibold text-aera-ink">Canonical Domain</div>
          <div>{siteUrl}</div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5 text-xs font-semibold text-aera-ink">Site Title Template<input className={inputClass} value={form.titleTemplate} onChange={(e) => update("titleTemplate", e.target.value)} /></label>
          <label className="space-y-1.5 text-xs font-semibold text-aera-ink">Default Robots
            <select className={inputClass} value={form.defaultRobots} onChange={(e) => update("defaultRobots", e.target.value)}>
              <option>index,follow</option><option>index,nofollow</option><option>noindex,follow</option><option>noindex,nofollow</option>
            </select>
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-aera-ink">Locale<input className={inputClass} value={form.locale} onChange={(e) => update("locale", e.target.value)} /></label>
          <label className="space-y-1.5 text-xs font-semibold text-aera-ink">Twitter Card
            <select className={inputClass} value={form.twitterCard} onChange={(e) => update("twitterCard", e.target.value)}>
              <option value="summary_large_image">Summary with Large Image</option><option value="summary">Summary</option>
            </select>
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-aera-ink">Twitter Handle<input className={inputClass} value={form.twitterHandle || ""} onChange={(e) => update("twitterHandle", e.target.value)} /></label>
          <label className="space-y-1.5 text-xs font-semibold text-aera-ink">Price Range<input className={inputClass} value={form.priceRange || ""} onChange={(e) => update("priceRange", e.target.value)} /></label>
          <label className="space-y-1.5 text-xs font-semibold text-aera-ink">Google Business Profile URL<input className={inputClass} value={form.googleBusinessProfileUrl || ""} onChange={(e) => update("googleBusinessProfileUrl", e.target.value)} /></label>
          <label className="space-y-1.5 text-xs font-semibold text-aera-ink">Google Maps URL<input className={inputClass} value={form.googleMapsUrl || ""} onChange={(e) => update("googleMapsUrl", e.target.value)} /></label>
          <label className="space-y-1.5 text-xs font-semibold text-aera-ink">Latitude<input className={inputClass} value={form.latitude ?? ""} onChange={(e) => update("latitude", e.target.value)} /></label>
          <label className="space-y-1.5 text-xs font-semibold text-aera-ink">Longitude<input className={inputClass} value={form.longitude ?? ""} onChange={(e) => update("longitude", e.target.value)} /></label>
          <label className="space-y-1.5 text-xs font-semibold text-aera-ink">Google Verification<input className={inputClass} value={form.googleSiteVerification || ""} onChange={(e) => update("googleSiteVerification", e.target.value)} /></label>
          <label className="space-y-1.5 text-xs font-semibold text-aera-ink">Bing Verification<input className={inputClass} value={form.bingSiteVerification || ""} onChange={(e) => update("bingSiteVerification", e.target.value)} /></label>
        </div>
        <div className="mt-5 grid gap-2 md:grid-cols-2">
          {boolFields.map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-xs font-semibold text-aera-ink">
              <input type="checkbox" checked={Boolean(form[key])} onChange={(e) => update(key, e.target.checked as never)} />
              {label}
            </label>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <a className="inline-flex items-center gap-2 rounded-full border border-aera-champagne px-4 py-2 text-xs font-bold text-aera-ink" href="/admin/content/global">
            Global Content Settings <ExternalLink size={13} />
          </a>
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-aera-accent px-5 py-2 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-40">
            <Save size={14} /> {saving ? "Saving..." : saved ? "Saved!" : "Save SEO Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}


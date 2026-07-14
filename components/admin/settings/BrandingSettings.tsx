"use client";

import React from "react";
import { Palette, Save } from "lucide-react";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { BrandLogo } from "@/components/public/shell/BrandLogo";
import { useToast } from "@/components/admin/ui/AdminToastProvider";
import { useSettingsForm } from "@/hooks/admin/useSettingsForm";
import type { MediaReference } from "@/lib/media/media.types";
import type { BrandingSettings as BrandingData, SalonProfileSettings } from "@/lib/settings/settings.types";
import { SettingsStatusFooter } from "./SettingsStatusFooter";

export default function BrandingSettings() {
  const toast = useToast();
  const form = useSettingsForm<BrandingData>({ url: "/api/admin/settings/branding" });
  const profile = useSettingsForm<Pick<SalonProfileSettings, "name">>({
    url: "/api/admin/settings/salon-profile",
    select: (value) => ({ name: (value as SalonProfileSettings).name }),
  });
  React.useEffect(() => {
    Promise.all([form.load(), profile.load()]).catch(() => undefined);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (form.loading && !form.data) return <p className="p-6 text-xs text-[var(--admin-muted)]">Loading branding...</p>;
  if (!form.data) return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-xs text-red-700">{form.error || "Unable to load branding."} <button onClick={() => form.reload().catch(() => undefined)} className="font-bold underline">Retry</button></div>;
  async function save() { const saved = await form.save(); saved ? toast.success("Branding saved, published, and verified.") : toast.error(form.error || "Unable to save branding."); }
  const logo = form.data.logo;
  return (
    <div className="max-w-5xl space-y-5 rounded-2xl border border-[var(--admin-border)] bg-white p-6">
      <div className="flex items-center gap-3"><Palette size={18} /><div><h3 className="text-sm font-bold">Branding</h3><p className="text-[11px] text-[var(--admin-muted)]">Media references are verified against the Media Library before publishing.</p></div></div>
      <div className="grid gap-6 sm:grid-cols-2">
        <MediaPickerField label="Logo" valueMode="reference" value={logo} onChange={(value: MediaReference | null) => form.setField("logo", value)} folder="branding" aspectRatio="3/1" allowRemove />
        <MediaPickerField label="Favicon" valueMode="reference" value={form.data.favicon} onChange={(value: MediaReference | null) => form.setField("favicon", value)} folder="branding" aspectRatio="1/1" allowRemove />
      </div>
      {logo && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs"><b>Selected asset:</b> {logo.title || logo.mediaId || "Media asset"}<br /><b>URL:</b> {logo.src}<br />{form.isDirty && <b className="text-amber-700">Unsaved</b>}</div>}
      {profile.data ? <div className="grid gap-4 md:grid-cols-3">
        {(["header", "mobile", "footer"] as const).map((size) => <div key={size} className="rounded-xl border bg-[var(--admin-surface-muted)] p-4"><p className="mb-3 text-[10px] font-bold uppercase">{size} Preview</p><BrandLogo brandName={profile.data!.name} logo={logo} size={size} /></div>)}
      </div> : <p className="text-xs text-red-600">{profile.error || "Loading canonical brand name for preview..."}</p>}
      {form.fieldErrors["logo.alt"]?.map((error) => <p key={error} className="text-xs text-red-600">{error}</p>)}
      <button type="button" onClick={save} disabled={form.saving || !form.isDirty} className="inline-flex items-center gap-2 rounded-full bg-[var(--admin-accent)] px-5 py-2 text-xs font-bold uppercase text-white disabled:opacity-40"><Save size={14} />{form.saving ? "Saving..." : "Save Branding"}</button>
      <SettingsStatusFooter {...form} onReload={() => form.reload().catch(() => undefined)} />
    </div>
  );
}

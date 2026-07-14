"use client";

import React from "react";
import { Building2, Save } from "lucide-react";
import { AdminFormField } from "@/components/admin/ui";
import { RichTextEditor } from "@/components/admin/editor/RichTextEditor";
import { useToast } from "@/components/admin/ui/AdminToastProvider";
import { useSettingsForm } from "@/hooks/admin/useSettingsForm";
import type { SalonProfileSettings } from "@/lib/settings/settings.types";
import { SettingsStatusFooter } from "./SettingsStatusFooter";

const inputClass = "w-full rounded-xl border border-[var(--admin-border-strong)] bg-white px-3 py-2.5 text-xs text-[var(--admin-ink)] focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20";

export default function SalonInfoSettings() {
  const toast = useToast();
  const form = useSettingsForm<SalonProfileSettings>({ url: "/api/admin/settings/salon-profile" });
  React.useEffect(() => { form.load().catch(() => undefined); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function save() {
    const saved = await form.save();
    saved ? toast.success("Salon information saved and verified.") : toast.error(form.error || "Unable to save salon information.");
  }

  if (form.loading && !form.data) return <p className="p-6 text-xs text-[var(--admin-muted)]">Loading salon settings...</p>;
  if (!form.data) return <LoadError message={form.error} retry={() => form.reload().catch(() => undefined)} />;

  const field = (key: keyof SalonProfileSettings) => form.fieldErrors[key]?.[0];
  return (
    <div className="max-w-4xl space-y-5 rounded-2xl border border-[var(--admin-border)] bg-white p-6">
      <div className="flex items-center gap-3"><Building2 size={18} /><div><h3 className="text-sm font-bold">Salon Information</h3><p className="text-[11px] text-[var(--admin-muted)]">Canonical identity and public contact details</p></div></div>
      <div className="grid gap-4 sm:grid-cols-2">
        {(["name", "phone", "email", "website"] as const).map((key) => (
          <AdminFormField key={key} label={{ name: "Salon Name", phone: "Phone", email: "Email", website: "Website" }[key]} required={key === "name"} error={field(key)}>
            <input className={inputClass} type={key === "email" ? "email" : key === "website" ? "url" : key === "phone" ? "tel" : "text"} value={form.data![key]} onChange={(event) => form.setField(key, event.target.value)} />
          </AdminFormField>
        ))}
      </div>
      <AdminFormField label="Address" error={field("address")}><input className={inputClass} value={form.data.address} onChange={(event) => form.setField("address", event.target.value)} /></AdminFormField>
      <div><label className="mb-1.5 block text-xs font-bold">Business Description</label><RichTextEditor value={form.data.description} onChange={(value) => form.setField("description", value)} placeholder="Describe your salon..." />{field("description") && <p className="mt-1 text-xs text-red-600">{field("description")}</p>}</div>
      <button type="button" onClick={save} disabled={form.saving || !form.isDirty} className="inline-flex items-center gap-2 rounded-full bg-[var(--admin-accent)] px-5 py-2 text-xs font-bold uppercase text-white disabled:opacity-40"><Save size={14} />{form.saving ? "Saving..." : "Save Changes"}</button>
      <SettingsStatusFooter {...form} onReload={() => form.reload().catch(() => undefined)} />
    </div>
  );
}

function LoadError({ message, retry }: { message: string | null; retry: () => void }) {
  return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-xs text-red-700"><p>{message || "Unable to load settings."}</p><button type="button" onClick={retry} className="mt-3 font-bold underline">Retry</button></div>;
}

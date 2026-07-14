"use client";

import React from "react";
import { Clock, Save } from "lucide-react";
import { AdminToggle } from "@/components/admin/ui";
import { useToast } from "@/components/admin/ui/AdminToastProvider";
import { useSettingsForm } from "@/hooks/admin/useSettingsForm";
import type { BusinessHour } from "@/lib/settings/settings.types";
import { SettingsStatusFooter } from "./SettingsStatusFooter";

type HoursForm = { businessHours: BusinessHour[] };
const inputClass = "rounded-xl border border-[var(--admin-border-strong)] bg-white px-3 py-2 text-xs focus:border-[var(--admin-accent)] focus:outline-none";

export default function BusinessHoursSettings() {
  const toast = useToast();
  const form = useSettingsForm<HoursForm>({
    url: "/api/admin/settings/business-hours",
    select: (value) => ({ businessHours: (value as { businessHours: BusinessHour[] }).businessHours }),
  });
  React.useEffect(() => { form.load().catch(() => undefined); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (form.loading && !form.data) return <p className="p-6 text-xs text-[var(--admin-muted)]">Loading business hours...</p>;
  if (!form.data) return <LoadError error={form.error} retry={() => form.reload().catch(() => undefined)} />;

  function update(index: number, key: keyof BusinessHour, value: string | boolean) {
    form.setData((current) => ({ businessHours: current.businessHours.map((day, i) => i === index ? { ...day, [key]: value } : day) }));
  }
  async function save() {
    const saved = await form.save();
    saved ? toast.success("Business hours saved and verified.") : toast.error(form.error || "Unable to save business hours.");
  }
  return (
    <div className="max-w-4xl space-y-5 rounded-2xl border border-[var(--admin-border)] bg-white p-6">
      <div className="flex items-center gap-3"><Clock size={18} /><div><h3 className="text-sm font-bold">Business Hours</h3><p className="text-[11px] text-[var(--admin-muted)]">Controls public hours and booking availability</p></div></div>
      <div className="space-y-3">{form.data.businessHours.map((day, index) => (
        <div key={day.day} className="flex flex-wrap items-center gap-4 rounded-xl bg-[var(--admin-surface-muted)] p-3">
          <span className="w-28 text-xs font-semibold">{day.day}</span><AdminToggle checked={day.isOpen} onChange={(value) => update(index, "isOpen", value)} />
          {day.isOpen ? <><input type="time" className={inputClass} value={day.startTime} onChange={(event) => update(index, "startTime", event.target.value)} /><span>–</span><input type="time" className={inputClass} value={day.endTime} onChange={(event) => update(index, "endTime", event.target.value)} /></> : <em className="text-xs text-[var(--admin-muted)]">Closed</em>}
          {form.fieldErrors[`businessHours.${index}.endTime`]?.map((error) => <span key={error} className="w-full text-xs text-red-600">{error}</span>)}
        </div>
      ))}</div>
      <button type="button" onClick={save} disabled={form.saving || !form.isDirty} className="inline-flex items-center gap-2 rounded-full bg-[var(--admin-accent)] px-5 py-2 text-xs font-bold uppercase text-white disabled:opacity-40"><Save size={14} />{form.saving ? "Saving..." : "Save Hours"}</button>
      <SettingsStatusFooter {...form} onReload={() => form.reload().catch(() => undefined)} />
    </div>
  );
}

function LoadError({ error, retry }: { error: string | null; retry: () => void }) { return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-xs text-red-700">{error || "Unable to load settings."} <button onClick={retry} className="font-bold underline">Retry</button></div>; }

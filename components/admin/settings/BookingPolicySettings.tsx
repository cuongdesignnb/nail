"use client";

import React from "react";
import { FileText, Save } from "lucide-react";
import { AdminFormField } from "@/components/admin/ui";
import { useToast } from "@/components/admin/ui/AdminToastProvider";
import { useSettingsForm } from "@/hooks/admin/useSettingsForm";
import type { BookingPolicies } from "@/lib/settings/settings.types";
import { SettingsStatusFooter } from "./SettingsStatusFooter";

const fields: Array<{ key: keyof BookingPolicies; label: string; unit: string; help: string }> = [
  { key: "minAdvanceHours", label: "Minimum Advance Booking", unit: "hours", help: "Rejects bookings made too close to the appointment." },
  { key: "maxAdvanceDays", label: "Maximum Advance Booking", unit: "days", help: "Limits how far ahead clients can book." },
  { key: "cancellationWindowHours", label: "Cancellation Window", unit: "hours", help: "Controls cancellation eligibility." },
  { key: "bufferMinutes", label: "Buffer Between Appointments", unit: "minutes", help: "Applied to availability and conflict checks." },
];
const inputClass = "w-full rounded-xl border border-[var(--admin-border-strong)] bg-white px-3 py-2.5 text-xs focus:border-[var(--admin-accent)] focus:outline-none";

export default function BookingPolicySettings() {
  const toast = useToast();
  const form = useSettingsForm<BookingPolicies>({ url: "/api/admin/settings/booking-policies", label: "Booking Policies" });
  React.useEffect(() => { form.load().catch(() => undefined); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (form.loading && !form.data) return <p className="p-6 text-xs text-[var(--admin-muted)]">Loading booking policies...</p>;
  if (!form.data) return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-xs text-red-700">{form.error || "Unable to load settings."} <button onClick={() => form.reload().catch(() => undefined)} className="font-bold underline">Retry</button></div>;
  async function save() { const saved = await form.save(); saved ? toast.success("Booking policies saved and verified.") : toast.error(form.error || "Unable to save policies."); }
  return (
    <div className="max-w-4xl space-y-5 rounded-2xl border border-[var(--admin-border)] bg-white p-6">
      <div className="flex items-center gap-3"><FileText size={18} /><div><h3 className="text-sm font-bold">Booking Policies</h3><p className="text-[11px] text-[var(--admin-muted)]">Normal bookings are always pay-at-salon; no deposit settings apply.</p></div></div>
      <div className="grid gap-4 sm:grid-cols-2">{fields.map(({ key, label, unit, help }) => (
        <AdminFormField key={key} label={label} helpText={help} error={form.fieldErrors[key]?.[0]}>
          <div className="flex items-center gap-2"><input className={inputClass} type="number" value={form.data![key]} onChange={(event) => form.setField(key, Number(event.target.value))} /><span className="text-xs text-[var(--admin-muted)]">{unit}</span></div>
        </AdminFormField>
      ))}</div>
      <button type="button" onClick={save} disabled={form.saving || !form.isDirty} className="inline-flex items-center gap-2 rounded-full bg-[var(--admin-accent)] px-5 py-2 text-xs font-bold uppercase text-white disabled:opacity-40"><Save size={14} />{form.saving ? "Saving..." : "Save Policies"}</button>
      <SettingsStatusFooter {...form} onReload={() => form.reload().catch(() => undefined)} />
    </div>
  );
}

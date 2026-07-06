"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Save } from "lucide-react";
import { AdminFormField, AdminToggle } from "@/components/admin/ui";

interface PolicyData {
  minAdvanceHours: number;
  maxAdvanceDays: number;
  cancellationWindowHours: number;
  depositRequired: boolean;
  depositPercent: number;
  bufferMinutes: number;
}

const STORAGE_KEY = "aera_booking_policies";

function loadPolicies(): PolicyData {
  if (typeof window === "undefined") return getDefaults();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return getDefaults();
}

function getDefaults(): PolicyData {
  return {
    minAdvanceHours: 2,
    maxAdvanceDays: 30,
    cancellationWindowHours: 24,
    depositRequired: true,
    depositPercent: 20,
    bufferMinutes: 15,
  };
}

export default function BookingPolicySettings() {
  const [form, setForm] = useState<PolicyData>(loadPolicies);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof PolicyData>(field: K, value: PolicyData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[var(--admin-border-strong)] bg-white px-3 py-2.5 text-xs text-[var(--admin-ink)] focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl space-y-6"
    >
      <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--admin-surface-muted)]">
            <FileText className="h-4.5 w-4.5 text-[var(--admin-accent)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--admin-ink)]">Booking Policies</h3>
            <p className="text-[11px] text-[var(--admin-muted)]">Configure scheduling rules and deposit requirements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminFormField
            label="Minimum Advance Booking"
            helpText="Minimum hours before appointment"
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={form.minAdvanceHours}
                onChange={(e) => update("minAdvanceHours", Number(e.target.value))}
                className={inputClass}
              />
              <span className="text-xs text-[var(--admin-muted)] shrink-0">hours</span>
            </div>
          </AdminFormField>

          <AdminFormField
            label="Maximum Advance Booking"
            helpText="How far ahead clients can book"
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={form.maxAdvanceDays}
                onChange={(e) => update("maxAdvanceDays", Number(e.target.value))}
                className={inputClass}
              />
              <span className="text-xs text-[var(--admin-muted)] shrink-0">days</span>
            </div>
          </AdminFormField>

          <AdminFormField
            label="Cancellation Window"
            helpText="Hours before appointment to allow free cancellation"
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={form.cancellationWindowHours}
                onChange={(e) => update("cancellationWindowHours", Number(e.target.value))}
                className={inputClass}
              />
              <span className="text-xs text-[var(--admin-muted)] shrink-0">hours</span>
            </div>
          </AdminFormField>

          <AdminFormField
            label="Buffer Between Appointments"
            helpText="Minutes between bookings"
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                step={5}
                value={form.bufferMinutes}
                onChange={(e) => update("bufferMinutes", Number(e.target.value))}
                className={inputClass}
              />
              <span className="text-xs text-[var(--admin-muted)] shrink-0">minutes</span>
            </div>
          </AdminFormField>
        </div>

        <div className="border-t border-[var(--admin-border)] pt-5 space-y-4">
          <AdminToggle
            label="Require Deposit"
            checked={form.depositRequired}
            onChange={(val) => update("depositRequired", val)}
            helpText="Require a deposit when booking online"
          />

          {form.depositRequired && (
            <AdminFormField label="Deposit Amount" helpText="Percentage of total">
              <div className="flex items-center gap-2 max-w-xs">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={form.depositPercent}
                  onChange={(e) => update("depositPercent", Number(e.target.value))}
                  className={inputClass}
                />
                <span className="text-xs text-[var(--admin-muted)] shrink-0">%</span>
              </div>
            </AdminFormField>
          )}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--admin-accent)] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[var(--admin-accent-hover)] disabled:opacity-40"
        >
          <Save className="h-3.5 w-3.5" />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Policies"}
        </button>
      </div>
    </motion.div>
  );
}

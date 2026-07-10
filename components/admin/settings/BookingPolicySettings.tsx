"use client";

import React, { useState, useEffect } from "react";
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

export default function BookingPolicySettings() {
  const [form, setForm] = useState<PolicyData>({
    minAdvanceHours: 2,
    maxAdvanceDays: 30,
    cancellationWindowHours: 24,
    depositRequired: true,
    depositPercent: 20,
    bufferMinutes: 15,
  });
  const [version, setVersion] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [globalRes, paypalRes] = await Promise.all([
          fetch("/api/admin/content/global", { cache: "no-store" }),
          fetch("/api/admin/settings/payments/paypal", { cache: "no-store" }),
        ]);

        const globalJson = await globalRes.json();
        const paypalJson = await paypalRes.json();

        let policies = {
          minAdvanceHours: 2,
          maxAdvanceDays: 30,
          cancellationWindowHours: 24,
          bufferMinutes: 15,
        };

        if (globalJson.success && globalJson.data) {
          const content = globalJson.data.draftContent || {};
          if (content.bookingPolicies) {
            policies = { ...policies, ...content.bookingPolicies };
          }
          setVersion(globalJson.data.version || 1);
        }

        let depositInfo = {
          depositRequired: true,
          depositPercent: 25,
        };

        if (paypalJson.success && paypalJson.data) {
          depositInfo = {
            depositRequired: paypalJson.data.chargeMode === "deposit",
            depositPercent: Number(paypalJson.data.depositPercentage) || 25,
          };
        }

        setForm({
          ...policies,
          ...depositInfo,
        });
      } catch (err) {
        console.error("Failed to load booking policies:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const update = <K extends keyof PolicyData>(field: K, value: PolicyData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Save policies in global draft content
      const getRes = await fetch("/api/admin/content/global", { cache: "no-store" });
      const getJson = await getRes.json();
      let currentContent = {};
      let currentVersion = version;
      if (getJson.success && getJson.data) {
        currentContent = getJson.data.draftContent || {};
        currentVersion = getJson.data.version;
      }

      const updatedContent = {
        ...currentContent,
        bookingPolicies: {
          minAdvanceHours: form.minAdvanceHours,
          maxAdvanceDays: form.maxAdvanceDays,
          cancellationWindowHours: form.cancellationWindowHours,
          bufferMinutes: form.bufferMinutes,
        },
      };

      const putRes = await fetch("/api/admin/content/global", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: updatedContent, version: currentVersion }),
      });
      const putJson = await putRes.json();
      if (!putRes.ok || !putJson.success) {
        throw new Error(putJson.error || "Failed to save global policies");
      }

      const nextVersion = putJson.data.version;

      // Publish global content
      const publishRes = await fetch("/api/admin/content/global/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: nextVersion }),
      });
      const publishJson = await publishRes.json();
      if (!publishRes.ok || !publishJson.success) {
        throw new Error(publishJson.error || "Failed to publish global policies");
      }
      setVersion(publishJson.data.version);

      // 2. Sync chargeMode & depositPercentage in PayPal settings
      const paypalGet = await fetch("/api/admin/settings/payments/paypal", { cache: "no-store" });
      const paypalGetJson = await paypalGet.json();
      if (paypalGetJson.success && paypalGetJson.data) {
        const currentPaypal = paypalGetJson.data;
        await fetch("/api/admin/settings/payments/paypal", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...currentPaypal,
            chargeMode: form.depositRequired ? "deposit" : "full",
            depositPercentage: form.depositPercent,
          }),
        });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save policies");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[var(--admin-border-strong)] bg-white px-3 py-2.5 text-xs text-[var(--admin-ink)] focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20";

  if (loading) {
    return <div className="p-6 text-xs text-[var(--admin-muted)]">Loading booking policies...</div>;
  }

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

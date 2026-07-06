"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, ArrowLeft } from "lucide-react";
import { AdminPageHeader, AdminFormField, AdminToggle, AdminSectionCard } from "@/components/admin/ui";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { RichTextEditor } from "@/components/admin/editor/RichTextEditor";

interface PromotionData {
  code: string;
  title: string;
  description: string;
  type: "percentage" | "fixed";
  amount: number;
  active: boolean;
  firstBookingOnly: boolean;
  validUntil: string;
  bannerImage: string;
  termsHtml: string;
}

interface PromotionFormProps {
  promotionId?: string;
  initialData?: Partial<PromotionData>;
}

const EMPTY: PromotionData = {
  code: "",
  title: "",
  description: "",
  type: "percentage",
  amount: 0,
  active: true,
  firstBookingOnly: false,
  validUntil: "",
  bannerImage: "",
  termsHtml: "",
};

export default function PromotionForm({ promotionId, initialData }: PromotionFormProps) {
  const router = useRouter();
  const isEdit = !!promotionId;
  const [form, setForm] = useState<PromotionData>({ ...EMPTY, ...initialData });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && !initialData) {
      fetch(`/api/admin/promotions/${promotionId}`)
        .then((r) => r.json())
        .then((json) => {
          if (json.success && json.data) {
            setForm({
              code: json.data.code || "",
              title: json.data.title || "",
              description: json.data.description || "",
              type: json.data.type || "percentage",
              amount: json.data.amount || 0,
              active: json.data.active ?? true,
              firstBookingOnly: json.data.firstBookingOnly ?? false,
              validUntil: json.data.validUntil
                ? new Date(json.data.validUntil).toISOString().slice(0, 10)
                : "",
              bannerImage: json.data.bannerImage || "",
              termsHtml: json.data.termsHtml || "",
            });
          }
        })
        .catch(console.error);
    }
  }, [isEdit, promotionId, initialData]);

  const update = <K extends keyof PromotionData>(field: K, value: PromotionData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const url = isEdit
        ? `/api/admin/promotions/${promotionId}`
        : "/api/admin/promotions";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          validUntil: form.validUntil || null,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Failed to save");
        return;
      }

      router.push("/admin/promotions");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[var(--admin-border-strong)] bg-white px-3 py-2.5 text-xs text-[var(--admin-ink)] placeholder:text-[var(--admin-placeholder)] focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20";

  return (
    <div className="p-6 max-w-4xl">
      <AdminPageHeader
        title={isEdit ? "Edit Promotion" : "New Promotion"}
        description={isEdit ? "Update promotion details" : "Create a new promotional offer"}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Promotions", href: "/admin/promotions" },
          { label: isEdit ? "Edit" : "New" },
        ]}
        actions={
          <button
            type="button"
            onClick={() => router.push("/admin/promotions")}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--admin-border-strong)] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--admin-ink)] hover:bg-[var(--admin-surface-hover)] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-red-50 border border-red-100 p-3 text-xs text-red-700"
          >
            {error}
          </motion.div>
        )}

        <AdminSectionCard title="Basic Details" defaultOpen>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminFormField label="Promo Code" required>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => update("code", e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER20"
                  className={inputClass}
                />
              </AdminFormField>

              <AdminFormField label="Title" required>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="Summer Special Discount"
                  className={inputClass}
                />
              </AdminFormField>
            </div>

            <AdminFormField label="Description">
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Brief description of the promotion..."
                rows={2}
                className={inputClass}
              />
            </AdminFormField>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <AdminFormField label="Type" required>
                <select
                  value={form.type}
                  onChange={(e) => update("type", e.target.value as "percentage" | "fixed")}
                  className={inputClass}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </AdminFormField>

              <AdminFormField label="Amount" required>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    step={form.type === "percentage" ? 1 : 0.01}
                    max={form.type === "percentage" ? 100 : undefined}
                    value={form.amount}
                    onChange={(e) => update("amount", Number(e.target.value))}
                    className={inputClass}
                  />
                  <span className="text-xs text-[var(--admin-muted)] shrink-0">
                    {form.type === "percentage" ? "%" : "$"}
                  </span>
                </div>
              </AdminFormField>

              <AdminFormField label="Valid Until">
                <input
                  type="date"
                  value={form.validUntil}
                  onChange={(e) => update("validUntil", e.target.value)}
                  className={inputClass}
                />
              </AdminFormField>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:gap-8 pt-2">
              <AdminToggle
                label="Active"
                checked={form.active}
                onChange={(val) => update("active", val)}
                helpText="Enable or disable this promotion"
              />
              <AdminToggle
                label="First Booking Only"
                checked={form.firstBookingOnly}
                onChange={(val) => update("firstBookingOnly", val)}
                helpText="Only valid for new customers"
              />
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Banner Image" defaultOpen={false}>
          <MediaPickerField
            label="Promotion Banner"
            value={form.bannerImage}
            onChange={(url) => update("bannerImage", url)}
            folder="promotions"
            aspectRatio="16/6"
          />
        </AdminSectionCard>

        <AdminSectionCard title="Terms & Conditions" defaultOpen={false}>
          <div className="mb-4">
            <RichTextEditor
              value={form.termsHtml}
              onChange={(html) => update("termsHtml", html)}
              placeholder="Terms and conditions apply..."
            />
          </div>
        </AdminSectionCard>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || !form.code || !form.title}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--admin-accent)] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[var(--admin-accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Saving..." : isEdit ? "Update Promotion" : "Create Promotion"}
          </button>
        </div>
      </form>
    </div>
  );
}

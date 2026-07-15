"use client";

import React, { useState } from "react";
import { Save, X, Loader2 } from "lucide-react";
import { AdminFormField, AdminToggle } from "@/components/admin/ui";
import MediaPickerField from "@/components/admin/media/MediaPickerField";

interface TechnicianFormData {
  name: string;
  role: string;
  specialty: string;
  avatar: string | null;
  isActive: boolean;
  rating?: number;
}

interface TechnicianFormProps {
  initialData?: TechnicianFormData;
  onSubmit: (data: TechnicianFormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export function TechnicianForm({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}: TechnicianFormProps) {
  const [form, setForm] = useState<TechnicianFormData>(
    initialData || {
      name: "",
      role: "Nail Technician",
      specialty: "General",
      avatar: null,
      isActive: true,
      rating: 5,
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof TechnicianFormData>(
    field: K,
    value: TechnicianFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[var(--admin-border-strong)] bg-white px-3 py-2.5 text-sm text-[var(--admin-ink)] placeholder:text-[var(--admin-placeholder)] transition-all focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-[var(--admin-danger-soft)] p-3 text-xs font-semibold text-[var(--admin-danger)]">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Name */}
        <AdminFormField label="Full Name" required>
          <input
            type="text"
            required
            placeholder="e.g. Hannah Nguyen"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
          />
        </AdminFormField>

        {/* Role */}
        <AdminFormField label="Job Title" helpText="e.g. Master Nail Artist">
          <input
            type="text"
            placeholder="Nail Technician"
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
            className={inputClass}
          />
        </AdminFormField>

        {/* Specialty */}
        <AdminFormField label="Specialty" helpText="e.g. Gel Extensions, Nail Art">
          <input
            type="text"
            placeholder="General"
            value={form.specialty}
            onChange={(e) => update("specialty", e.target.value)}
            className={inputClass}
          />
        </AdminFormField>

        {/* Avatar */}
        <div className="space-y-1.5">
          <MediaPickerField
            valueMode="url"
            label="Avatar Photo"
            value={form.avatar}
            onChange={(val) => update("avatar", val)}
            folder="technicians"
            aspectRatio="1/1"
            allowRemove
          />
        </div>

        {/* Active Toggle */}
        <div className="pt-2">
          <AdminToggle
            label="Active Status"
            checked={form.isActive}
            onChange={(val) => update("isActive", val)}
            helpText="Toggle to enable or disable bookings for this technician"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t border-[var(--admin-border)] pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--admin-border-strong)] bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--admin-ink)] transition-colors hover:bg-[var(--admin-surface-hover)] disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--admin-accent)] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[var(--admin-accent-hover)] disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              {isEdit ? "Update" : "Save"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, Building2 } from "lucide-react";
import { AdminFormField } from "@/components/admin/ui";
import { RichTextEditor } from "@/components/admin/editor/RichTextEditor";

interface SalonInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
}

const STORAGE_KEY = "aera_salon_info";

function loadSalonInfo(): SalonInfo {
  if (typeof window === "undefined") return getDefaults();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return getDefaults();
}

function getDefaults(): SalonInfo {
  return {
    name: "Aera Nail Lounge",
    address: "123 Luxury Ave, Beverly Hills, CA 90210",
    phone: "(310) 555-0100",
    email: "hello@aeranaillounge.com",
    website: "https://aeranaillounge.com",
    description: "A luxury nail lounge experience with artisan techniques and premium products.",
  };
}

export default function SalonInfoSettings() {
  const [form, setForm] = useState<SalonInfo>(loadSalonInfo);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (field: keyof SalonInfo, value: string) => {
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
    "w-full rounded-xl border border-aera-champagne/60 bg-white px-3 py-2.5 text-xs text-aera-ink placeholder:text-aera-muted/50 focus:border-aera-accent focus:outline-none focus:ring-2 focus:ring-aera-accent/20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl space-y-6"
    >
      <div className="rounded-2xl border border-aera-champagne/30 bg-white p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-aera-champagne/40">
            <Building2 className="h-4.5 w-4.5 text-aera-accent" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-aera-ink">Salon Information</h3>
            <p className="text-[11px] text-aera-muted">Basic details about your business</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminFormField label="Salon Name" required>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass}
            />
          </AdminFormField>

          <AdminFormField label="Phone">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={inputClass}
            />
          </AdminFormField>

          <AdminFormField label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass}
            />
          </AdminFormField>

          <AdminFormField label="Website">
            <input
              type="url"
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
              className={inputClass}
            />
          </AdminFormField>
        </div>

        <AdminFormField label="Address">
          <input
            type="text"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            className={inputClass}
          />
        </AdminFormField>

        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-bold text-aera-ink">Business Description</label>
          <RichTextEditor
            value={form.description}
            onChange={(html) => update("description", html)}
            placeholder="Describe your salon..."
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-aera-accent px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-aera-accentHover disabled:opacity-40"
        >
          <Save className="h-3.5 w-3.5" />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </motion.div>
  );
}

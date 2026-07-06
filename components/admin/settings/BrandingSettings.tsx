"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Save } from "lucide-react";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";

const STORAGE_KEY = "aera_branding";

interface BrandingData {
  logo: string;
  favicon: string;
}

function loadBranding(): BrandingData {
  if (typeof window === "undefined") return { logo: "", favicon: "" };
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { logo: "", favicon: "" };
}

const BRAND_COLORS = [
  { name: "Ivory", value: "#FFF9F4" },
  { name: "Cream", value: "#F8EEE4" },
  { name: "Champagne", value: "#EED9C2" },
  { name: "Copper", value: "#A85D1E" },
  { name: "Bronze", value: "#8A4B19" },
  { name: "Ink", value: "#2F1C11" },
];

export default function BrandingSettings() {
  const [data, setData] = useState<BrandingData>(loadBranding);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl space-y-6"
    >
      <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-6 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--admin-surface-muted)]">
            <Palette className="h-4.5 w-4.5 text-[var(--admin-accent)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--admin-ink)]">Branding</h3>
            <p className="text-[11px] text-[var(--admin-muted)]">Logo, favicon and brand color palette</p>
          </div>
        </div>

        {/* Logo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <MediaPickerField
            label="Logo"
            value={data.logo}
            onChange={(url) => {
              setData((prev) => ({ ...prev, logo: url }));
              setSaved(false);
            }}
            folder="branding"
            aspectRatio="3/1"
          />
          <MediaPickerField
            label="Favicon"
            value={data.favicon}
            onChange={(url) => {
              setData((prev) => ({ ...prev, favicon: url }));
              setSaved(false);
            }}
            folder="branding"
            aspectRatio="1/1"
          />
        </div>

        {/* Brand Colors */}
        <div>
          <h4 className="text-xs font-bold text-[var(--admin-ink)] mb-3 uppercase tracking-wider">Brand Colors</h4>
          <div className="flex flex-wrap gap-3">
            {BRAND_COLORS.map((color) => (
              <div key={color.name} className="flex items-center gap-2">
                <div
                  className="h-8 w-8 rounded-lg border border-[var(--admin-border)] shadow-sm"
                  style={{ backgroundColor: color.value }}
                />
                <div>
                  <p className="text-[10px] font-semibold text-[var(--admin-ink)]">{color.name}</p>
                  <p className="text-[9px] font-mono text-[var(--admin-muted)]">{color.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--admin-accent)] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[var(--admin-accent-hover)] disabled:opacity-40"
        >
          <Save className="h-3.5 w-3.5" />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Branding"}
        </button>
      </div>
    </motion.div>
  );
}

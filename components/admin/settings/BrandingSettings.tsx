"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Palette, Save } from "lucide-react";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";

interface BrandingData {
  logo: string;
  favicon: string;
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
  const [data, setData] = useState<BrandingData>({ logo: "", favicon: "" });
  const [version, setVersion] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/content/global");
        const json = await res.json();
        if (json.success && json.data) {
          const content = json.data.draftContent || {};
          setData({
            logo: content.brand?.logo?.src || "",
            favicon: content.brand?.favicon || "",
          });
          setVersion(json.data.version || 1);
        }
      } catch (err) {
        console.error("Failed to load branding settings:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const getRes = await fetch("/api/admin/content/global");
      const getJson = await getRes.json();
      let currentContent = {};
      let currentVersion = version;
      if (getJson.success && getJson.data) {
        currentContent = getJson.data.draftContent || {};
        currentVersion = getJson.data.version;
      }

      const updatedContent = {
        ...currentContent,
        brand: {
          ...(currentContent as any).brand,
          logo: {
            ...(currentContent as any).brand?.logo,
            src: data.logo,
            alt: `${(currentContent as any).brand?.name || "Aera"} logo`,
          },
          favicon: data.favicon,
        },
      };

      const putRes = await fetch("/api/admin/content/global", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: updatedContent, version: currentVersion }),
      });
      const putJson = await putRes.json();
      if (!putRes.ok || !putJson.success) {
        throw new Error(putJson.error || "Failed to save draft");
      }

      const nextVersion = putJson.data.version;

      const publishRes = await fetch("/api/admin/content/global/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: nextVersion }),
      });
      const publishJson = await publishRes.json();
      if (!publishRes.ok || !publishJson.success) {
        throw new Error(publishJson.error || "Failed to publish");
      }

      setVersion(publishJson.data.version);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save branding");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-xs text-[var(--admin-muted)]">Loading branding settings...</div>;
  }

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
            allowRemove
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
            allowRemove
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

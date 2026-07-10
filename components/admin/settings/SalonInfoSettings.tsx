"use client";

import React, { useState, useEffect } from "react";
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

export default function SalonInfoSettings() {
  const [form, setForm] = useState<SalonInfo>({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    description: "",
  });
  const [version, setVersion] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/content/global", { cache: "no-store" });
        const json = await res.json();
        if (json.success && json.data) {
          const content = json.data.draftContent || {};
          setForm({
            name: content.brand?.name || "",
            address: content.defaultContact?.address || "",
            phone: content.defaultContact?.phone || "",
            email: content.defaultContact?.email || "",
            website: content.defaultContact?.website || "",
            description: content.footer?.brandText || "",
          });
          setVersion(json.data.version || 1);
        }
      } catch (err) {
        console.error("Failed to load salon info:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const update = (field: keyof SalonInfo, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
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
        brand: {
          ...(currentContent as any).brand,
          name: form.name,
        },
        defaultContact: {
          ...(currentContent as any).defaultContact,
          address: form.address,
          phone: form.phone,
          email: form.email,
          website: form.website,
        },
        footer: {
          ...(currentContent as any).footer,
          contact: {
            ...(currentContent as any).footer?.contact,
            address: form.address,
            phone: form.phone,
            email: form.email,
          },
          brandText: form.description,
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
      alert(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[var(--admin-border-strong)] bg-white px-3 py-2.5 text-xs text-[var(--admin-ink)] placeholder:text-[var(--admin-placeholder)] focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20";

  if (loading) {
    return <div className="p-6 text-xs text-[var(--admin-muted)]">Loading salon settings...</div>;
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
            <Building2 className="h-4.5 w-4.5 text-[var(--admin-accent)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--admin-ink)]">Salon Information</h3>
            <p className="text-[11px] text-[var(--admin-muted)]">Basic details about your business</p>
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
          <label className="mb-1.5 block text-xs font-bold text-[var(--admin-ink)]">Business Description</label>
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
          className="inline-flex items-center gap-2 rounded-full bg-[var(--admin-accent)] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[var(--admin-accent-hover)] disabled:opacity-40"
        >
          <Save className="h-3.5 w-3.5" />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </motion.div>
  );
}

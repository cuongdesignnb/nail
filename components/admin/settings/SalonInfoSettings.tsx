"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Building2 } from "lucide-react";
import { AdminFormField } from "@/components/admin/ui";
import { RichTextEditor } from "@/components/admin/editor/RichTextEditor";
import { settingsEqual } from "@/lib/settings/normalize-settings";

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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const load = React.useCallback(async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetch("/api/admin/content/global", { cache: "no-store", headers: { "Cache-Control": "no-cache" } });
        const json = await res.json();
        if (!res.ok || !json.success || !json.data) throw new Error(json.error || "Unable to load settings.");
          const content = json.data.draftContent;
          setForm({
            name: content.brand?.name || "",
            address: content.defaultContact?.address || "",
            phone: content.defaultContact?.phone || "",
            email: content.defaultContact?.email || "",
            website: content.defaultContact?.website || "",
            description: content.footer?.brandText || "",
          });
          setVersion(json.data.version || 1);
          setIsDirty(false);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Unable to load settings.");
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  const update = (field: keyof SalonInfo, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
    setIsDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const getRes = await fetch("/api/admin/content/global", { cache: "no-store", headers: { "Cache-Control": "no-cache" } });
      const getJson = await getRes.json();
      if (!getRes.ok || !getJson.success || !getJson.data) throw new Error(getJson.error || "Unable to load settings.");
      const currentContent = getJson.data.draftContent;
      const currentVersion = getJson.data.version;

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
      const verifyRes = await fetch("/api/admin/content/global", { cache: "no-store", headers: { "Cache-Control": "no-cache" } });
      const verifyJson = await verifyRes.json();
      if (!verifyRes.ok || !verifyJson.success) throw new Error("Your changes could not be verified after saving. Please reload and try again.");
      const verifiedContent = verifyJson.data.draftContent;
      const verified = {
        name: verifiedContent.brand?.name || "", address: verifiedContent.defaultContact?.address || "",
        phone: verifiedContent.defaultContact?.phone || "", email: verifiedContent.defaultContact?.email || "",
        website: verifiedContent.defaultContact?.website || "", description: verifiedContent.footer?.brandText || "",
      };
      if (!settingsEqual(form, verified)) throw new Error("Your changes could not be verified after saving. Please reload and try again.");
      setForm(verified);
      setVersion(verifyJson.data.version);
      setIsDirty(false);
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
  if (loadError) return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-xs text-red-700"><p>Unable to load settings.</p><button type="button" onClick={() => load().catch(() => undefined)} className="mt-3 font-bold underline">Retry</button></div>;

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
          disabled={loading || saving || !isDirty || !form.name.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--admin-accent)] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[var(--admin-accent-hover)] disabled:opacity-40"
        >
          <Save className="h-3.5 w-3.5" />
          {saving ? "Saving..." : saved ? "Settings saved and verified." : "Save Changes"}
        </button>
      </div>
    </motion.div>
  );
}

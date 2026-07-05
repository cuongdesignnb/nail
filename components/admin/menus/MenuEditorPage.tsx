"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminErrorState, AdminLoadingState, AdminPageHeader, AdminSectionCard } from "@/components/admin/ui";
import { MenuItemInspector } from "./MenuItemInspector";
import { MenuPreviewPanel } from "./MenuPreviewPanel";

export function MenuEditorPage({ menuKey }: { menuKey: string }) {
  const [menu, setMenu] = useState<any>(null);
  const [itemsJson, setItemsJson] = useState("[]");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/navigation/menus/${menuKey}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) throw new Error(json.error || "Menu not found.");
        setMenu(json.data);
        setItemsJson(JSON.stringify(json.data.draftItems || [], null, 2));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load menu."))
      .finally(() => setLoading(false));
  }, [menuKey]);

  const location = menu?.location || "";
  const contextBadge = useMemo(() => {
    const labels: Record<string, string> = {
      footer_company: "Footer - Company Links",
      footer_services: "Footer - Services Links",
      footer_explore: "Footer - Explore Links",
      footer_legal: "Footer - Legal Links",
      footer_social: "Footer - Social Links",
      header_primary: "Header - Primary Navigation",
      header_mobile: "Header - Mobile Navigation",
    };
    return labels[location] || location;
  }, [location]);

  async function saveDraft() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const items = JSON.parse(itemsJson);
      const res = await fetch(`/api/admin/navigation/menus/${menuKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Unable to save draft.");
      setMenu(json.data);
      setItemsJson(JSON.stringify(json.data.draftItems || [], null, 2));
      setMessage("Draft saved. Public navigation is unchanged until publishing.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid menu JSON.");
    } finally {
      setSaving(false);
    }
  }

  async function publish() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await saveDraft();
      const res = await fetch(`/api/admin/navigation/menus/${menuKey}/publish`, { method: "POST" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Unable to publish menu.");
      setMenu(json.data);
      setMessage("Menu published and public Header/Footer revalidated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to publish menu.");
    } finally {
      setSaving(false);
    }
  }

  let previewItems: any[] = [];
  try {
    previewItems = JSON.parse(itemsJson);
  } catch {
    previewItems = [];
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={menu?.name || "Menu Editor"}
        description="Edit draft menu items, preview the draft, then publish when ready."
        breadcrumbs={[{ label: "Menus", href: "/admin/menus" }, { label: menu?.name || menuKey }]}
        actions={<Link href="/admin/menus" className="rounded-full border border-aera-champagne px-4 py-2 text-xs font-bold uppercase tracking-wider text-aera-ink">Back to Menus</Link>}
      />

      {loading && <AdminLoadingState variant="form" />}
      {error && <AdminErrorState title="Menu editor error" description={error} />}

      {!loading && menu && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <AdminSectionCard title="Draft Menu Items">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-aera-champagne/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-aera-ink">{contextBadge}</span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">Draft Preview</span>
              </div>
              <MenuItemInspector location={location} />
              <textarea
                value={itemsJson}
                onChange={(event) => setItemsJson(event.target.value)}
                rows={18}
                className="mt-4 w-full rounded-xl border border-aera-champagne/60 bg-white p-4 font-mono text-xs text-aera-ink"
              />
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button disabled={saving} onClick={saveDraft} className="rounded-full bg-aera-ink px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-60">
                  {saving ? "Saving..." : "Save Draft"}
                </button>
                <button disabled={saving} onClick={publish} className="rounded-full bg-aera-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-60">
                  Publish Menu
                </button>
                {message && <p className="text-xs font-semibold text-emerald-700">{message}</p>}
              </div>
            </AdminSectionCard>
          </div>
          <MenuPreviewPanel location={location} items={previewItems} />
        </div>
      )}
    </div>
  );
}

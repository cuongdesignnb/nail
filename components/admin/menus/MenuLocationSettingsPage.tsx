"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminErrorState, AdminLoadingState, AdminPageHeader, AdminSectionCard } from "@/components/admin/ui";
import { FooterMenuAssignments } from "./FooterMenuAssignments";
import { FooterMenuLayoutSettings } from "./FooterMenuLayoutSettings";
import { HeaderMobileMenuSettings } from "./HeaderMobileMenuSettings";

type Settings = {
  headerMobileMode: "inherit_header_primary" | "custom_menu";
  headerMobileMenuKey: string;
  footerLayout: "two_columns" | "three_columns" | "four_columns";
  footerShowSocial: boolean;
  footerShowLegal: boolean;
};

const defaults: Settings = {
  headerMobileMode: "inherit_header_primary",
  headerMobileMenuKey: "header-mobile",
  footerLayout: "four_columns",
  footerShowSocial: true,
  footerShowLegal: true,
};

export function MenuLocationSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/navigation/settings", { cache: "no-store" }).then((res) => res.json()),
      fetch("/api/admin/navigation/menus", { cache: "no-store" }).then((res) => res.json()),
    ])
      .then(([settingsJson, menusJson]) => {
        if (!settingsJson.success) throw new Error(settingsJson.error || "Unable to load settings.");
        if (!menusJson.success) throw new Error(menusJson.error || "Unable to load menus.");
        setSettings(settingsJson.data);
        setMenus(menusJson.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load settings."))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/navigation/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Unable to save settings.");
      setSettings(json.data);
      setMessage("Menu location settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Menu Location Settings"
        description="Configure mobile navigation inheritance and Footer layout without editing menu trees here."
        breadcrumbs={[{ label: "Menus", href: "/admin/menus" }, { label: "Settings" }]}
        actions={<Link href="/admin/menus" className="rounded-full border border-aera-champagne px-4 py-2 text-xs font-bold uppercase tracking-wider text-aera-ink">Back to Menus</Link>}
      />

      {loading && <AdminLoadingState variant="form" />}
      {error && <AdminErrorState title="Menu settings error" description={error} />}

      {!loading && (
        <>
          <HeaderMobileMenuSettings settings={settings} onChange={setSettings} />
          <FooterMenuLayoutSettings settings={settings} onChange={setSettings} />
          <FooterMenuAssignments menus={menus} />

          <AdminSectionCard title="Save Location Settings">
            <div className="flex flex-wrap items-center gap-3">
              <button disabled={saving} onClick={save} className="rounded-full bg-aera-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-60">
                {saving ? "Saving..." : "Save Settings"}
              </button>
              {message && <p className="text-xs font-semibold text-emerald-700">{message}</p>}
            </div>
          </AdminSectionCard>
        </>
      )}
    </div>
  );
}

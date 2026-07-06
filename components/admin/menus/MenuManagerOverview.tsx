"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Eye, Menu, Settings } from "lucide-react";
import { AdminEmptyState, AdminErrorState, AdminLoadingState, AdminPageHeader, AdminSectionCard } from "@/components/admin/ui";

type MenuCard = {
  key: string;
  name: string;
  description?: string;
  location: string;
  locationLabel: string;
  group: "Header Navigation" | "Footer Navigation";
  purpose: string;
  draftItemCount: number;
  childItemCount: number;
  enabledItemCount: number;
  hiddenItemCount: number;
  publishedItemCount: number;
  hasDraftChanges: boolean;
  publishedAt?: string | null;
  updatedAt: string;
  mobileMode?: string;
};

export function MenuManagerOverview() {
  const [menus, setMenus] = useState<MenuCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/navigation/menus", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) throw new Error(json.error || "Unable to load menus.");
        setMenus(json.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load menus."))
      .finally(() => setLoading(false));
  }, []);

  const groups = useMemo(() => ({
    "Header Navigation": menus.filter((menu) => menu.group === "Header Navigation"),
    "Footer Navigation": menus.filter((menu) => menu.group === "Footer Navigation"),
  }), [menus]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Menu Manager"
        eyebrow="Website"
        description="Manage every public Header, mobile drawer, Footer column, legal and social menu location."
        actions={(
          <Link href="/admin/menus/settings" className="inline-flex items-center gap-2 rounded-full bg-[var(--admin-accent)] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
            <Settings className="h-4 w-4" />
            Location Settings
          </Link>
        )}
      />

      {loading && <AdminLoadingState />}
      {error && <AdminErrorState title="Unable to load menus" description={error} />}
      {!loading && !error && menus.length === 0 && (
        <AdminEmptyState
          icon={Menu}
          title="No menus found"
          description="Default menu locations will be created by the navigation service."
        />
      )}

      {!loading && !error && (Object.entries(groups) as Array<[string, MenuCard[]]>).map(([group, items]) => (
        <AdminSectionCard key={group} title={group} icon={Menu}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {items.map((menu) => (
              <article key={menu.key} className="rounded-xl border border-[var(--admin-border)]/40 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--admin-muted)]">{menu.location}</p>
                    <h3 className="mt-1 text-base font-semibold text-[var(--admin-ink)]">{menu.name}</h3>
                    <p className="mt-1 text-xs text-[var(--admin-muted)]">{menu.description}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${menu.hasDraftChanges ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                    {menu.hasDraftChanges ? "Draft changes" : "Published"}
                  </span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div><dt className="text-[var(--admin-muted)]">Items</dt><dd className="font-bold text-[var(--admin-ink)]">{menu.draftItemCount}</dd></div>
                  <div><dt className="text-[var(--admin-muted)]">Children</dt><dd className="font-bold text-[var(--admin-ink)]">{menu.childItemCount}</dd></div>
                  <div><dt className="text-[var(--admin-muted)]">Enabled</dt><dd className="font-bold text-[var(--admin-ink)]">{menu.enabledItemCount}</dd></div>
                  <div><dt className="text-[var(--admin-muted)]">Hidden</dt><dd className="font-bold text-[var(--admin-ink)]">{menu.hiddenItemCount}</dd></div>
                  <div><dt className="text-[var(--admin-muted)]">Updated</dt><dd className="font-bold text-[var(--admin-ink)]">{new Date(menu.updatedAt).toLocaleDateString()}</dd></div>
                  <div><dt className="text-[var(--admin-muted)]">Published</dt><dd className="font-bold text-[var(--admin-ink)]">{menu.publishedAt ? new Date(menu.publishedAt).toLocaleDateString() : "Never"}</dd></div>
                </dl>
                {menu.mobileMode && (
                  <p className="mt-3 rounded-lg bg-[var(--admin-surface-hover)] px-3 py-2 text-xs text-[var(--admin-ink)]">
                    Current Mode: {menu.mobileMode === "custom_menu" ? "Use Custom Mobile Menu" : "Inherit Primary Header Menu"}
                  </p>
                )}
                {menu.group === "Footer Navigation" && (
                  <p className="mt-3 rounded-lg bg-[var(--admin-surface-hover)] px-3 py-2 text-xs text-[var(--admin-ink)]">
                    Footer Column Position: {menu.locationLabel}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/admin/menus/${menu.key}`} className="rounded-full bg-[var(--admin-ink)] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">Edit Menu</Link>
                  <Link href={`/admin/menus/${menu.key}?preview=1`} className="inline-flex items-center gap-1 rounded-full border border-[var(--admin-border)] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--admin-ink)]">
                    <Eye className="h-3.5 w-3.5" />
                    Preview Menu
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </AdminSectionCard>
      ))}
    </div>
  );
}

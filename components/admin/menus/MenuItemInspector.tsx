"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import type { NavigationLocation, NavigationMenuItem } from "@/lib/navigation/navigation.types";
import { MenuItemLinkEditor } from "./MenuItemLinkEditor";
import { MenuSocialLinkEditor } from "./MenuSocialLinkEditor";
import { maxDepthByLocation, sanitizeItemForLocation } from "./menu-tree.utils";

type MenuItemInspectorProps = {
  item: NavigationMenuItem | null;
  depth: number;
  location: NavigationLocation;
  onChange: (patch: Partial<NavigationMenuItem>) => void;
  onAddChild: () => void;
  onDelete: () => void;
};

export function MenuItemInspector({ item, depth, location, onChange, onAddChild, onDelete }: MenuItemInspectorProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const labelRef = useRef<HTMLInputElement>(null);
  const noChildren = location === "footer_legal" || location === "footer_social";
  const canAddChild = Boolean(item) && !noChildren && depth < maxDepthByLocation[location];

  useEffect(() => {
    labelRef.current?.focus();
  }, [item?.id]);

  if (!item) {
    return (
      <section className="rounded-[22px] border border-[var(--admin-border)]/40 bg-white/95 p-6 shadow-sm">
        <h2 className="font-heading text-2xl text-[var(--admin-ink)]">Edit Menu Item</h2>
        <div className="mt-6 rounded-2xl border border-dashed border-[var(--admin-border)]/70 bg-[var(--admin-canvas)] p-8 text-center">
          <p className="text-sm font-bold text-[var(--admin-ink)]">Select a menu item to edit its label, destination and visibility.</p>
        </div>
      </section>
    );
  }

  function patch(next: Partial<NavigationMenuItem>) {
    if (!item) return;
    onChange(sanitizeItemForLocation({ ...item, ...next }, location));
  }

  return (
    <section className="rounded-[22px] border border-[var(--admin-border)]/40 bg-white/95 p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--admin-muted)]">Edit Menu Item</p>
          <h2 className="mt-1 truncate font-heading text-3xl text-[var(--admin-ink)]">{item.label || "Untitled Link"}</h2>
        </div>
        <span className="rounded-full bg-[var(--admin-canvas)] px-3 py-1 text-xs font-semibold text-[var(--admin-muted)]">Level {depth}</span>
      </div>

      <div className="space-y-6">
        <InspectorSection title="Navigation Label">
          <label className="block">
            <span className="text-sm font-bold text-[var(--admin-ink)]">Label</span>
            <input
              ref={labelRef}
              value={item.label || ""}
              onChange={(event) => patch({ label: event.target.value })}
              placeholder="Untitled Link"
              className="mt-2 min-h-12 w-full rounded-2xl border border-[var(--admin-border-strong)] bg-white px-4 text-base font-semibold text-[var(--admin-ink)] outline-none focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)]/15"
            />
          </label>
        </InspectorSection>

        <InspectorSection title="Destination">
          {location === "footer_social" ? <MenuSocialLinkEditor item={item} onChange={patch} /> : <MenuItemLinkEditor item={item} onChange={patch} />}
        </InspectorSection>

        <InspectorSection title="Visibility">
          <label className="flex min-h-12 items-center justify-between gap-4 rounded-2xl border border-[var(--admin-border)]/50 bg-[var(--admin-canvas)] px-4">
            <span>
              <span className="block text-sm font-bold text-[var(--admin-ink)]">Visible in public menu</span>
              <span className="block text-xs text-[var(--admin-muted)]">Hidden items stay in draft but do not show publicly.</span>
            </span>
            <input type="checkbox" checked={item.isEnabled !== false} onChange={(event) => patch({ isEnabled: event.target.checked })} className="h-5 w-5 accent-[var(--admin-accent)]" />
          </label>
        </InspectorSection>

        {item.children?.length ? (
          <InspectorSection title="Parent / Submenu Settings">
            <p className="mb-3 text-sm font-semibold text-[var(--admin-ink)]">When visitors click this parent item:</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => patch({ type: item.href ? item.type : "internal" })} className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold ${item.type !== "none" ? "border-[var(--admin-accent)] bg-[var(--admin-accent)]/10 text-[var(--admin-ink)]" : "border-[var(--admin-border)]/50 bg-white text-[var(--admin-muted)] hover:bg-[var(--admin-surface-hover)]"}`}>
                Open its destination page
              </button>
              <button type="button" onClick={() => patch({ type: "none", href: "", target: "_self" })} className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold ${item.type === "none" ? "border-[var(--admin-accent)] bg-[var(--admin-accent)]/10 text-[var(--admin-ink)]" : "border-[var(--admin-border)]/50 bg-white text-[var(--admin-muted)] hover:bg-[var(--admin-surface-hover)]"}`}>
                Open submenu only
              </button>
            </div>
            {canAddChild && (
              <button type="button" onClick={onAddChild} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--admin-border-strong)] bg-white px-4 text-xs font-bold uppercase tracking-wider text-[var(--admin-ink)] hover:bg-[var(--admin-surface-hover)]">
                <Plus className="h-4 w-4" />
                Add Submenu Item
              </button>
            )}
          </InspectorSection>
        ) : canAddChild ? (
          <InspectorSection title="Parent / Submenu Settings">
            <button type="button" onClick={onAddChild} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--admin-border-strong)] bg-white px-4 text-xs font-bold uppercase tracking-wider text-[var(--admin-ink)] hover:bg-[var(--admin-surface-hover)]">
              <Plus className="h-4 w-4" />
              Add Submenu Item
            </button>
          </InspectorSection>
        ) : null}

        <div className="rounded-2xl border border-[var(--admin-border)]/45 bg-white">
          <button type="button" onClick={() => setAdvancedOpen((value) => !value)} className="flex min-h-12 w-full items-center justify-between px-4 text-left text-sm font-bold text-[var(--admin-ink)]">
            Advanced Options
            <ChevronDown className={`h-4 w-4 transition ${advancedOpen ? "rotate-180" : ""}`} />
          </button>
          {advancedOpen && (
            <div className="border-t border-[var(--admin-border)]/40 p-4">
              <label className="flex min-h-11 items-center justify-between gap-4">
                <span className="text-sm font-semibold text-[var(--admin-ink)]">Open in new tab</span>
                <input type="checkbox" checked={item.target === "_blank"} onChange={(event) => patch({ target: event.target.checked ? "_blank" : "_self" })} className="h-5 w-5 accent-[var(--admin-accent)]" />
              </label>
            </div>
          )}
        </div>

        <InspectorSection title="Danger Zone">
          <button type="button" onClick={onDelete} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-100">
            <Trash2 className="h-4 w-4" />
            Delete menu item
          </button>
        </InspectorSection>
      </div>
    </section>
  );
}

function InspectorSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-[var(--admin-border)]/35 pt-5 first:border-t-0 first:pt-0">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--admin-muted)]">{title}</h3>
      {children}
    </section>
  );
}

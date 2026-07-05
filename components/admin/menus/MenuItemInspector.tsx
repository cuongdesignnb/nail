"use client";

import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
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
  const noChildren = location === "footer_legal" || location === "footer_social";
  const canAddChild = Boolean(item) && !noChildren && depth < maxDepthByLocation[location];

  if (!item) {
    return (
      <section className="rounded-3xl border border-aera-champagne/40 bg-white/90 p-6 shadow-sm">
        <h2 className="font-heading text-2xl text-aera-ink">Item Details</h2>
        <div className="mt-6 rounded-2xl border border-dashed border-aera-champagne/70 bg-aera-ivory p-6 text-center">
          <p className="text-sm font-bold text-aera-ink">Select a menu item to edit its details.</p>
          <p className="mt-1 text-xs text-aera-muted">Choose a row from Menu Structure or add a new link.</p>
        </div>
      </section>
    );
  }

  function patch(next: Partial<NavigationMenuItem>) {
    if (!item) return;
    onChange(sanitizeItemForLocation({ ...item, ...next }, location));
  }

  return (
    <section className="rounded-3xl border border-aera-champagne/40 bg-white/90 p-5 shadow-sm">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl text-aera-ink">Item Details</h2>
          <p className="text-xs text-aera-muted">{location === "footer_social" ? "Configure the social profile card." : "Edit the public label and destination."}</p>
        </div>
        <span className="rounded-full bg-aera-champagne/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-aera-ink">Level {depth}</span>
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-aera-muted">Navigation Label</span>
          <input
            value={item.label || ""}
            onChange={(event) => patch({ label: event.target.value })}
            placeholder="Menu label"
            className="mt-2 min-h-11 w-full rounded-xl border border-aera-champagne/60 bg-white px-3 text-sm font-semibold text-aera-ink outline-none focus:border-aera-accent focus:ring-2 focus:ring-aera-accent/15"
          />
        </label>

        {location === "footer_social" ? <MenuSocialLinkEditor item={item} onChange={patch} /> : <MenuItemLinkEditor item={item} onChange={patch} />}

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => patch({ isEnabled: item.isEnabled === false })}
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-aera-champagne/60 bg-white px-3 text-sm font-bold text-aera-ink hover:bg-aera-champagne/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aera-accent/40"
          >
            {item.isEnabled === false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {item.isEnabled === false ? "Show in Public Menu" : "Hide from Public Menu"}
          </button>

          {item.type === "external" && (
            <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-aera-champagne/60 bg-white px-3 text-sm font-bold text-aera-ink hover:bg-aera-champagne/20">
              <input type="checkbox" checked={item.target === "_blank"} onChange={(event) => patch({ target: event.target.checked ? "_blank" : "_self" })} />
              Open in New Tab
            </label>
          )}
        </div>

        {item.children?.length ? (
          <div className="rounded-2xl border border-aera-champagne/50 bg-aera-ivory p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-aera-muted">Parent Link Behavior</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => patch({ type: item.href ? item.type : "internal" })} className="rounded-xl border border-aera-champagne/50 bg-white px-3 py-2 text-sm font-bold text-aera-ink hover:bg-aera-champagne/20">
                Navigate to selected page
              </button>
              <button type="button" onClick={() => patch({ type: "none", href: "", target: "_self" })} className={`rounded-xl border px-3 py-2 text-sm font-bold ${item.type === "none" ? "border-aera-accent bg-aera-accent/10 text-aera-ink" : "border-aera-champagne/50 bg-white text-aera-ink hover:bg-aera-champagne/20"}`}>
                Open submenu only
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3 border-t border-aera-champagne/40 pt-4">
          {canAddChild && (
            <button type="button" onClick={onAddChild} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-aera-ink px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-aera-brown">
              <Plus className="h-4 w-4" />
              Add Submenu Item
            </button>
          )}
          <button type="button" onClick={onDelete} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-100">
            <Trash2 className="h-4 w-4" />
            Delete Item
          </button>
        </div>
      </div>
    </section>
  );
}

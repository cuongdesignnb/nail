"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminConfirmDialog, AdminErrorState, AdminLoadingState } from "@/components/admin/ui";
import type { NavigationLocation, NavigationMenuDTO, NavigationMenuItem } from "@/lib/navigation/navigation.types";
import { MenuEditorToolbar } from "./MenuEditorToolbar";
import { MenuItemInspector } from "./MenuItemInspector";
import { MenuMobileActionBar } from "./MenuMobileActionBar";
import { MenuPreviewDialog } from "./MenuPreviewDialog";
import { MenuPreviewPanel } from "./MenuPreviewPanel";
import { MenuTree } from "./MenuTree";
import { MenuValidationPanel } from "./MenuValidationPanel";
import { addMenuItem, deleteMenuItem, findMenuItem, flattenMenuItems, updateMenuItem } from "./menu-tree.utils";

type MenuDTOWithIssues = NavigationMenuDTO & {
  dataIssues?: Array<{ message: string; severity: string; label?: string }>;
};

export function MenuEditorPage({ menuKey }: { menuKey: string }) {
  const [menu, setMenu] = useState<MenuDTOWithIssues | null>(null);
  const [items, setItems] = useState<NavigationMenuItem[]>([]);
  const [savedItems, setSavedItems] = useState<NavigationMenuItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/navigation/menus/${menuKey}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) throw new Error(json.error || "Menu not found.");
        loadMenu(json.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load menu."))
      .finally(() => setLoading(false));
  }, [menuKey]);

  const location = (menu?.location || "header_primary") as NavigationLocation;
  const selectedItem = selectedId ? findMenuItem(items, selectedId) : null;
  const selectedDepth = selectedId ? flattenMenuItems(items).find((item) => item.id === selectedId)?.depth || 1 : 1;
  const hasLocalChanges = useMemo(() => !menuItemsEqual(items, savedItems), [items, savedItems]);
  const hasDraftChanges = useMemo(() => !menuItemsEqual(savedItems, menu?.publishedItems || []), [savedItems, menu?.publishedItems]);
  const validationIssues = useMemo(() => validateItemsForAdmin(items, location, menu?.dataIssues), [items, location, menu?.dataIssues]);
  const status = validationIssues.length ? "Needs Attention" : hasLocalChanges ? "Unsaved Changes" : hasDraftChanges ? "Draft Changes" : "Saved";

  function loadMenu(nextMenu: MenuDTOWithIssues) {
    const draft = Array.isArray(nextMenu.draftItems) ? nextMenu.draftItems : [];
    setMenu(nextMenu);
    setItems(draft);
    setSavedItems(draft);
    setSelectedId(draft[0]?.id || null);
  }

  function handleItemsChange(nextItems: NavigationMenuItem[]) {
    setItems(nextItems);
    if (selectedId && !findMenuItem(nextItems, selectedId)) {
      setSelectedId(flattenMenuItems(nextItems)[0]?.id || null);
    }
  }

  function patchSelected(patch: Partial<NavigationMenuItem>) {
    if (!selectedId) return;
    handleItemsChange(updateMenuItem(items, selectedId, patch));
  }

  function addChildToSelected() {
    if (!selectedId) return;
    handleItemsChange(addMenuItem(items, location, selectedId));
  }

  async function saveDraft(nextItems = items) {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`/api/admin/navigation/menus/${menuKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: nextItems }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Unable to save draft.");
      loadMenu(json.data);
      setMessage("Draft saved. Public navigation is unchanged until publishing.");
      return json.data as MenuDTOWithIssues;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save draft.");
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function publish() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      if (hasLocalChanges) {
        const saved = await saveDraft(items);
        if (!saved) return;
      }
      const res = await fetch(`/api/admin/navigation/menus/${menuKey}/publish`, { method: "POST" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Unable to publish menu.");
      loadMenu(json.data);
      setMessage("Menu published and public Header/Footer revalidated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to publish menu.");
    } finally {
      setSaving(false);
    }
  }

  async function runMenuAction(path: "discard" | "restore-default") {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`/api/admin/navigation/menus/${menuKey}/${path}`, { method: "POST" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Unable to update menu.");
      loadMenu(json.data);
      setMessage(path === "discard" ? "Draft discarded. Editor now matches the published menu." : "Default menu restored as a draft.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update menu.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 px-3 pb-24 sm:px-4 lg:px-6 lg:pb-6">
      {loading && <AdminLoadingState variant="form" />}
      {error && <AdminErrorState title="Menu editor error" description={error} />}

      {!loading && menu && (
        <>
          <MenuEditorToolbar
            menuName={menu.name || menuKey}
            status={status}
            saving={saving}
            hasLocalChanges={hasLocalChanges}
            hasDraftChanges={hasDraftChanges}
            description={menu.description}
            onPreview={() => setPreviewOpen(true)}
            onSave={() => saveDraft()}
            onPublish={publish}
            onDiscard={() => runMenuAction("discard")}
            onRestore={() => runMenuAction("restore-default")}
          />

          {message && <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</div>}
          <MenuValidationPanel issues={validationIssues} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(340px,0.85fr)_minmax(560px,1.6fr)]">
            <div className="min-w-0">
              <MenuTree
                items={items}
                location={location}
                selectedId={selectedId}
                onChange={handleItemsChange}
                onSelect={setSelectedId}
                onRequestDelete={setDeleteId}
              />
            </div>
            <div className="min-w-0">
              <MenuItemInspector
                item={selectedItem}
                depth={selectedDepth}
                location={location}
                onChange={patchSelected}
                onAddChild={addChildToSelected}
                onDelete={() => selectedId && setDeleteId(selectedId)}
              />
            </div>
          </div>

          <MenuPreviewPanel location={location} items={items} />

          <MenuPreviewDialog open={previewOpen} location={location} items={items} onClose={() => setPreviewOpen(false)} />
          <MenuMobileActionBar saving={saving} canSave={hasLocalChanges} canPublish={hasDraftChanges || hasLocalChanges} onPreview={() => setPreviewOpen(true)} onSave={() => saveDraft()} onPublish={publish} />
        </>
      )}

      <AdminConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return;
          handleItemsChange(deleteMenuItem(items, deleteId));
          setDeleteId(null);
        }}
        title="Delete menu item?"
        description="This removes the selected link and any submenu links from the draft."
        confirmLabel="Delete Item"
        variant="danger"
      />
    </div>
  );
}

function validateItemsForAdmin(items: NavigationMenuItem[], location: NavigationLocation, dataIssues?: Array<{ message: string; label?: string }>) {
  const issues: string[] = [];
  const seen = new Set<string>();
  const flat = flattenMenuItems(items);
  for (const item of flat) {
    const label = item.label?.trim() || "Untitled link";
    if (!item.label?.trim()) issues.push(`${label} needs a navigation label.`);
    if (seen.has(item.id)) issues.push(`${label} appears more than once. Duplicate and delete one copy to repair it.`);
    seen.add(item.id);
    if (item.isEnabled !== false && item.type !== "none" && !item.href?.trim()) issues.push(`${label} has no valid destination.`);
    if (item.type === "external" && item.href && !/^https?:\/\//i.test(item.href)) issues.push(`${label} requires a full external URL.`);
    if (item.type === "internal" && item.href && !item.href.startsWith("/")) issues.push(`${label} internal route must start with "/".`);
    if (location === "footer_social" && !/^https?:\/\//i.test(item.href || "")) issues.push(`${label} requires a valid social URL.`);
    if ((location === "footer_legal" || location === "footer_social") && item.children?.length) issues.push(`${label} cannot have child menu items in this location.`);
  }
  dataIssues?.forEach((issue) => issues.push(`${issue.label || "Stored menu"}: ${issue.message}`));
  return Array.from(new Set(issues));
}

function menuItemsEqual(left: NavigationMenuItem[], right: NavigationMenuItem[]): boolean {
  if (left.length !== right.length) return false;
  return left.every((item, index) => menuItemEqual(item, right[index]));
}

function menuItemEqual(left: NavigationMenuItem, right?: NavigationMenuItem): boolean {
  if (!right) return false;
  return left.id === right.id
    && left.label === right.label
    && left.href === right.href
    && left.type === right.type
    && left.target === right.target
    && left.isEnabled === right.isEnabled
    && left.icon === right.icon
    && menuItemsEqual(left.children || [], right.children || []);
}

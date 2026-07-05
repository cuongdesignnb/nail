import type { NavigationLinkType, NavigationLocation, NavigationMenuItem } from "@/lib/navigation/navigation.types";
import { createMenuItemId } from "@/lib/navigation/navigation.mapper";
import { inferSocialIcon } from "@/lib/navigation/navigation.validation";

export type FlatMenuItem = NavigationMenuItem & {
  depth: number;
  parentId: string | null;
  index: number;
};

export const maxDepthByLocation: Record<NavigationLocation, number> = {
  header_primary: 3,
  header_mobile: 3,
  footer_company: 2,
  footer_services: 2,
  footer_explore: 2,
  footer_legal: 1,
  footer_social: 1,
};

export function flattenMenuItems(items: NavigationMenuItem[], parentId: string | null = null, depth = 1): FlatMenuItem[] {
  if (!Array.isArray(items)) return [];
  return items.flatMap((item, index) => [
    { ...item, depth, parentId, index },
    ...flattenMenuItems(Array.isArray(item.children) ? item.children : [], item.id, depth + 1),
  ]);
}

export function findMenuItem(items: NavigationMenuItem[], id: string): NavigationMenuItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    const child = findMenuItem(item.children || [], id);
    if (child) return child;
  }
  return null;
}

export function updateMenuItem(items: NavigationMenuItem[], id: string, patch: Partial<NavigationMenuItem>): NavigationMenuItem[] {
  return items.map((item) => {
    if (item.id === id) return { ...item, ...patch, children: patch.children ?? item.children ?? [] };
    return { ...item, children: updateMenuItem(item.children || [], id, patch) };
  });
}

export function addMenuItem(items: NavigationMenuItem[], location: NavigationLocation, parentId?: string | null): NavigationMenuItem[] {
  const nextItem = createBlankMenuItem(location);
  if (!parentId) return [...items, nextItem];
  return items.map((item) => {
    if (item.id === parentId) return { ...item, children: [...(item.children || []), nextItem] };
    return { ...item, children: addMenuItem(item.children || [], location, parentId) };
  });
}

export function createBlankMenuItem(location: NavigationLocation): NavigationMenuItem {
  const social = location === "footer_social";
  return {
    id: createMenuItemId(),
    label: social ? "Instagram" : "Untitled Link",
    href: social ? "https://www.instagram.com/" : "",
    type: social ? "external" : "internal",
    target: social ? "_blank" : "_self",
    isEnabled: true,
    icon: social ? "Instagram" : undefined,
    children: [],
  };
}

export function duplicateMenuItem(items: NavigationMenuItem[], id: string): NavigationMenuItem[] {
  const copyItem = (item: NavigationMenuItem): NavigationMenuItem => ({
    ...item,
    id: createMenuItemId(),
    label: `${item.label || "Link"} Copy`,
    children: (item.children || []).map(copyItem),
  });
  return items.flatMap((item) => {
    if (item.id === id) return [item, copyItem(item)];
    return [{ ...item, children: duplicateMenuItem(item.children || [], id) }];
  });
}

export function deleteMenuItem(items: NavigationMenuItem[], id: string): NavigationMenuItem[] {
  return items
    .filter((item) => item.id !== id)
    .map((item) => ({ ...item, children: deleteMenuItem(item.children || [], id) }));
}

export function moveMenuItem(items: NavigationMenuItem[], id: string, direction: -1 | 1): NavigationMenuItem[] {
  const index = items.findIndex((item) => item.id === id);
  if (index >= 0) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return items;
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(nextIndex, 0, item);
    return next;
  }
  return items.map((item) => ({ ...item, children: moveMenuItem(item.children || [], id, direction) }));
}

export function reorderFlatMenu(items: NavigationMenuItem[], activeId: string, overId: string): NavigationMenuItem[] {
  const active = removeMenuItem(items, activeId);
  if (!active.item) return items;
  return insertBefore(active.items, overId, active.item);
}

export function indentMenuItem(items: NavigationMenuItem[], id: string, location: NavigationLocation): NavigationMenuItem[] {
  const flat = flattenMenuItems(items);
  const current = flat.find((item) => item.id === id);
  if (!current || current.depth >= maxDepthByLocation[location]) return items;
  const siblings = flat.filter((item) => item.parentId === current.parentId);
  const previousSibling = siblings.find((item) => item.index === current.index - 1);
  if (!previousSibling) return items;
  const removed = removeMenuItem(items, id);
  if (!removed.item) return items;
  return appendChild(removed.items, previousSibling.id, removed.item);
}

export function outdentMenuItem(items: NavigationMenuItem[], id: string): NavigationMenuItem[] {
  const flat = flattenMenuItems(items);
  const current = flat.find((item) => item.id === id);
  if (!current?.parentId) return items;
  const parent = flat.find((item) => item.id === current.parentId);
  const removed = removeMenuItem(items, id);
  if (!removed.item || !parent) return items;
  return insertAfter(removed.items, parent.id, removed.item);
}

export function sanitizeItemForLocation(item: NavigationMenuItem, location: NavigationLocation): NavigationMenuItem {
  if (location === "footer_social") {
    return {
      ...item,
      type: "external",
      target: "_blank",
      icon: item.icon || inferSocialIcon(item.href || ""),
      children: [],
    };
  }
  if (location === "footer_legal") return { ...item, children: [] };
  return item;
}

export function setItemLinkType(item: NavigationMenuItem, type: NavigationLinkType): NavigationMenuItem {
  if (type === "none") return { ...item, type, href: "", target: "_self" };
  if (type === "external") return { ...item, type, target: "_blank" };
  return { ...item, type, target: "_self" };
}

function removeMenuItem(items: NavigationMenuItem[], id: string): { items: NavigationMenuItem[]; item: NavigationMenuItem | null } {
  let removed: NavigationMenuItem | null = null;
  const next = items
    .filter((item) => {
      if (item.id === id) {
        removed = item;
        return false;
      }
      return true;
    })
    .map((item) => {
      const result = removeMenuItem(item.children || [], id);
      if (result.item) removed = result.item;
      return { ...item, children: result.items };
    });
  return { items: next, item: removed };
}

function insertBefore(items: NavigationMenuItem[], targetId: string, item: NavigationMenuItem): NavigationMenuItem[] {
  const index = items.findIndex((node) => node.id === targetId);
  if (index >= 0) {
    const next = [...items];
    next.splice(index, 0, item);
    return next;
  }
  return items.map((node) => ({ ...node, children: insertBefore(node.children || [], targetId, item) }));
}

function insertAfter(items: NavigationMenuItem[], targetId: string, item: NavigationMenuItem): NavigationMenuItem[] {
  const index = items.findIndex((node) => node.id === targetId);
  if (index >= 0) {
    const next = [...items];
    next.splice(index + 1, 0, item);
    return next;
  }
  return items.map((node) => ({ ...node, children: insertAfter(node.children || [], targetId, item) }));
}

function appendChild(items: NavigationMenuItem[], targetId: string, item: NavigationMenuItem): NavigationMenuItem[] {
  return items.map((node) => {
    if (node.id === targetId) return { ...node, children: [...(node.children || []), item] };
    return { ...node, children: appendChild(node.children || [], targetId, item) };
  });
}

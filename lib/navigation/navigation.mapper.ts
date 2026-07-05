import type { NavigationLinkType, NavigationLocation, NavigationMenuItem } from "./navigation.types";
import { inferSocialIcon } from "./navigation.validation";

export type NavigationDataIssue = {
  id?: string;
  label: string;
  message: string;
  severity: "warning" | "error";
};

const allowedLinkTypes: NavigationLinkType[] = ["internal", "external", "anchor", "mailto", "tel", "none"];

export function mapStoredNavigationItems(value: unknown, location: NavigationLocation) {
  const issues: NavigationDataIssue[] = [];
  if (!Array.isArray(value)) {
    if (value != null) {
      issues.push({
        label: "Stored menu",
        message: "Stored menu data is not a list. Start by adding a new visual menu item.",
        severity: "error",
      });
    }
    return { items: [] as NavigationMenuItem[], issues };
  }

  const seen = new Set<string>();
  const items = value
    .map((item, index) => mapStoredNavigationItem(item, location, issues, seen, `Item ${index + 1}`))
    .filter((item): item is NavigationMenuItem => Boolean(item));

  return { items, issues };
}

function mapStoredNavigationItem(
  value: unknown,
  location: NavigationLocation,
  issues: NavigationDataIssue[],
  seen: Set<string>,
  fallbackLabel: string
): NavigationMenuItem | null {
  if (!value || typeof value !== "object") {
    issues.push({ label: fallbackLabel, message: "This menu item is malformed and needs to be recreated.", severity: "error" });
    return null;
  }

  const raw = value as Record<string, unknown>;
  const id = typeof raw.id === "string" && raw.id.trim() ? raw.id : createMenuItemId();
  const label = typeof raw.label === "string" ? raw.label : "";
  const rawType = typeof raw.linkType === "string" ? raw.linkType : raw.type;
  const type = allowedLinkTypes.includes(rawType as NavigationLinkType) ? (rawType as NavigationLinkType) : inferLinkType(raw.href);
  const href = typeof raw.href === "string" ? raw.href : "";
  const target = raw.target === "_blank" ? "_blank" : "_self";
  const enabledValue = raw.isEnabled ?? raw.enabled ?? raw.visible;
  const childrenValue = Array.isArray(raw.children) ? raw.children : [];

  if (seen.has(id)) {
    issues.push({ id, label: label || fallbackLabel, message: "This item shares an ID with another item. Edit and save to repair the menu data.", severity: "error" });
  }
  seen.add(id);

  if (!label.trim()) {
    issues.push({ id, label: fallbackLabel, message: "Navigation label is missing.", severity: "error" });
  }
  if (!Array.isArray(raw.children) && raw.children != null) {
    issues.push({ id, label: label || fallbackLabel, message: "Child links were not stored as a list, so they are hidden until repaired.", severity: "warning" });
  }

  const children = location === "footer_legal" || location === "footer_social"
    ? []
    : childrenValue
        .map((child, index) => mapStoredNavigationItem(child, location, issues, seen, `${label || fallbackLabel} child ${index + 1}`))
        .filter((item): item is NavigationMenuItem => Boolean(item));

  return {
    id,
    label,
    href,
    type,
    target,
    isEnabled: enabledValue === false ? false : true,
    icon: typeof raw.icon === "string" ? raw.icon : inferSocialIcon(href),
    children,
  };
}

function inferLinkType(href: unknown): NavigationLinkType {
  if (typeof href !== "string") return "internal";
  if (href.startsWith("mailto:")) return "mailto";
  if (href.startsWith("tel:")) return "tel";
  if (href.startsWith("#")) return "anchor";
  if (/^https?:\/\//i.test(href)) return "external";
  if (!href) return "none";
  return "internal";
}

export function createMenuItemId() {
  return `menu-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

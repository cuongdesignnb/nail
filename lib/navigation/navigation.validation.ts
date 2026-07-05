import type { NavigationLocation, NavigationMenuItem } from "./navigation.types";

const HEADER_LOCATIONS = new Set(["header_primary", "header_mobile"]);
const FOOTER_COLUMN_LOCATIONS = new Set(["footer_company", "footer_services", "footer_explore"]);

const allowedTypes: Record<NavigationLocation, Set<string>> = {
  header_primary: new Set(["internal", "external", "anchor", "mailto", "tel", "none"]),
  header_mobile: new Set(["internal", "external", "anchor", "mailto", "tel", "none"]),
  footer_company: new Set(["internal", "external", "mailto", "tel"]),
  footer_services: new Set(["internal", "external", "mailto", "tel"]),
  footer_explore: new Set(["internal", "external", "mailto", "tel"]),
  footer_legal: new Set(["internal", "external"]),
  footer_social: new Set(["external", "mailto", "tel"]),
};

const maxDepthByLocation: Record<NavigationLocation, number> = {
  header_primary: 3,
  header_mobile: 3,
  footer_company: 2,
  footer_services: 2,
  footer_explore: 2,
  footer_legal: 1,
  footer_social: 1,
};

export function normalizeMenuItem(item: Partial<NavigationMenuItem>, location: NavigationLocation): NavigationMenuItem {
  const type = item.type || (item.href?.startsWith("http") ? "external" : "internal");
  const target = type === "external" ? "_blank" : item.target || "_self";
  return {
    id: item.id || `menu-item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label: String(item.label || "Untitled link").trim(),
    href: item.href || "",
    type,
    target,
    isEnabled: item.isEnabled !== false,
    icon: item.icon || inferSocialIcon(item.href || ""),
    children: location === "footer_legal" || location === "footer_social"
      ? []
      : (item.children || []).map((child) => normalizeMenuItem(child, location)),
  };
}

export function validateNavigationItems(items: NavigationMenuItem[], location: NavigationLocation) {
  const errors: string[] = [];
  const maxDepth = maxDepthByLocation[location];

  function walk(nodes: NavigationMenuItem[], depth: number, path: string) {
    if (depth > maxDepth) errors.push(`${path} exceeds max depth ${maxDepth}.`);
    for (const node of nodes) {
      const currentPath = `${path}/${node.label || node.id}`;
      if (!node.label?.trim()) errors.push(`${currentPath} requires a label.`);
      if (!allowedTypes[location].has(node.type)) errors.push(`${currentPath} uses unsupported link type "${node.type}".`);
      if (node.isEnabled !== false) validateHref(node, location, currentPath, errors);
      if ((location === "footer_legal" || location === "footer_social") && node.children?.length) {
        errors.push(`${currentPath} cannot have child menu items.`);
      }
      if (location === "footer_social" && node.type === "external" && node.target === "_self") {
        errors.push(`${currentPath} external social links must open in a new tab.`);
      }
      if (node.children?.length) walk(node.children, depth + 1, currentPath);
    }
  }

  walk(items, 1, location);
  return { valid: errors.length === 0, errors };
}

function validateHref(item: NavigationMenuItem, location: NavigationLocation, path: string, errors: string[]) {
  const href = item.href || "";
  if (item.type === "none") return;
  if (!href.trim()) {
    errors.push(`${path} requires an href.`);
    return;
  }
  if (/^\s*(javascript|data):/i.test(href)) errors.push(`${path} uses an unsafe href.`);
  if (href.startsWith("/admin") || href.startsWith("/api")) errors.push(`${path} cannot link to admin or API routes.`);
  if (item.type === "internal" && !href.startsWith("/")) errors.push(`${path} internal links must start with "/".`);
  if (item.type === "external" && !/^https?:\/\//i.test(href)) errors.push(`${path} external links must start with http:// or https://.`);
  if (item.type === "mailto" && !href.startsWith("mailto:")) errors.push(`${path} mail links must start with mailto:.`);
  if (item.type === "tel" && !href.startsWith("tel:")) errors.push(`${path} phone links must start with tel:.`);
  if (item.type === "anchor" && !HEADER_LOCATIONS.has(location)) errors.push(`${path} anchors are only allowed in header menus.`);
  if (location === "footer_social" && item.type === "internal") errors.push(`${path} footer social cannot use internal links.`);
  if (location === "footer_legal" && item.children?.length) errors.push(`${path} legal links cannot have children.`);
  if (FOOTER_COLUMN_LOCATIONS.has(location) && item.type === "anchor") errors.push(`${path} footer columns cannot use anchor-only links.`);
}

export function inferSocialIcon(href: string) {
  try {
    const host = new URL(href).hostname.replace(/^www\./, "");
    if (host.includes("instagram.com")) return "Instagram";
    if (host.includes("facebook.com")) return "Facebook";
    if (host.includes("tiktok.com")) return "TikTok";
    if (host.includes("youtube.com")) return "Youtube";
    if (host.includes("pinterest.com")) return "Pinterest";
  } catch {
    return undefined;
  }
  return undefined;
}

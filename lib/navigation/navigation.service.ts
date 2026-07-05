import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { DEFAULT_NAVIGATION_ITEMS, NAVIGATION_LOCATIONS, getNavigationLocation } from "./navigation.registry";
import { normalizeMenuItem, validateNavigationItems } from "./navigation.validation";
import type { NavigationLocation, NavigationMenuItem, NavigationMenuSettingDTO } from "./navigation.types";

const DEFAULT_SETTINGS: NavigationMenuSettingDTO = {
  headerMobileMode: "inherit_header_primary",
  headerMobileMenuKey: "header-mobile",
  footerLayout: "four_columns",
  footerShowSocial: true,
  footerShowLegal: true,
};

function asItems(value: unknown): NavigationMenuItem[] {
  return Array.isArray(value) ? (value as NavigationMenuItem[]) : [];
}

function enabledItems(items: NavigationMenuItem[]): NavigationMenuItem[] {
  return items
    .filter((item) => item.isEnabled !== false)
    .map((item) => ({ ...item, children: enabledItems(item.children || []) }));
}

export async function ensureDefaultNavigationMenus() {
  for (const definition of NAVIGATION_LOCATIONS) {
    const defaults = DEFAULT_NAVIGATION_ITEMS[definition.location];
    await prisma.navigationMenu.upsert({
      where: { key: definition.key },
      update: {},
      create: {
        key: definition.key,
        name: definition.name,
        description: definition.description,
        location: definition.location,
        draftItems: defaults,
        publishedItems: defaults.filter((item) => item.isEnabled !== false),
      },
    });
  }

  await prisma.navigationMenuSetting.upsert({
    where: { key: "default" },
    update: {},
    create: {
      key: "default",
      ...DEFAULT_SETTINGS,
    },
  });
}

export async function getNavigationSettings(): Promise<NavigationMenuSettingDTO> {
  noStore();
  let settings = null;
  try {
    settings = await prisma.navigationMenuSetting.findUnique({ where: { key: "default" } });
  } catch (error) {
    console.warn("Navigation settings unavailable; using defaults.", error);
  }
  return {
    headerMobileMode: settings?.headerMobileMode === "custom_menu" ? "custom_menu" : "inherit_header_primary",
    headerMobileMenuKey: settings?.headerMobileMenuKey || "header-mobile",
    footerLayout: ["two_columns", "three_columns", "four_columns"].includes(settings?.footerLayout || "")
      ? (settings?.footerLayout as NavigationMenuSettingDTO["footerLayout"])
      : "four_columns",
    footerShowSocial: settings?.footerShowSocial ?? true,
    footerShowLegal: settings?.footerShowLegal ?? true,
  };
}

export async function updateNavigationSettings(input: Partial<NavigationMenuSettingDTO>, actor = "admin") {
  const next = {
    headerMobileMode: input.headerMobileMode === "custom_menu" ? "custom_menu" : "inherit_header_primary",
    headerMobileMenuKey: input.headerMobileMenuKey || "header-mobile",
    footerLayout: input.footerLayout || "four_columns",
    footerShowSocial: input.footerShowSocial !== false,
    footerShowLegal: input.footerShowLegal !== false,
  };
  if (!["two_columns", "three_columns", "four_columns"].includes(next.footerLayout)) {
    throw new Error("Invalid footer layout.");
  }
  const assigned = await prisma.navigationMenu.findUnique({ where: { key: next.headerMobileMenuKey } });
  if (!assigned || assigned.location !== "header_mobile") {
    throw new Error("Custom mobile menu assignment must use the Header Mobile menu.");
  }

  const settings = await prisma.navigationMenuSetting.upsert({
    where: { key: "default" },
    update: next,
    create: { key: "default", ...next },
  });

  await prisma.auditLog.create({
    data: {
      actor,
      action: "MENU_LOCATION_SETTINGS_UPDATED",
      entity: "NavigationMenuSetting:default",
      entityType: "NavigationMenuSetting",
      entityId: settings.id,
      performedBy: actor,
      details: next,
    },
  }).catch(() => undefined);

  revalidatePath("/", "layout");
  return getNavigationSettings();
}

export async function listNavigationMenus() {
  noStore();
  await ensureDefaultNavigationMenus();
  const [menus, settings] = await Promise.all([
    prisma.navigationMenu.findMany({ orderBy: [{ location: "asc" }, { name: "asc" }] }),
    getNavigationSettings(),
  ]);
  return menus.map((menu) => {
    const draftItems = asItems(menu.draftItems);
    const publishedItems = asItems(menu.publishedItems);
    const definition = getNavigationLocation(menu.location);
    const enabledCount = countEnabled(draftItems);
    const totalCount = countItems(draftItems);
    return {
      id: menu.id,
      key: menu.key,
      name: menu.name,
      description: menu.description,
      location: menu.location,
      locationLabel: definition?.label || menu.location,
      group: definition?.group || "Footer Navigation",
      purpose: definition?.purpose || "",
      draftItemCount: totalCount,
      childItemCount: Math.max(0, totalCount - draftItems.length),
      enabledItemCount: enabledCount,
      hiddenItemCount: totalCount - enabledCount,
      publishedItemCount: countItems(publishedItems),
      hasDraftChanges: JSON.stringify(draftItems) !== JSON.stringify(publishedItems),
      publishedAt: menu.publishedAt?.toISOString() || null,
      updatedAt: menu.updatedAt.toISOString(),
      mobileMode: menu.location === "header_mobile" ? settings.headerMobileMode : undefined,
    };
  });
}

export async function getNavigationMenuByKey(key: string) {
  noStore();
  await ensureDefaultNavigationMenus();
  const menu = await prisma.navigationMenu.findUnique({ where: { key } });
  if (!menu) return null;
  return {
    ...menu,
    draftItems: asItems(menu.draftItems),
    publishedItems: asItems(menu.publishedItems),
  };
}

export async function saveNavigationMenuDraft(key: string, items: NavigationMenuItem[], actor = "admin") {
  const menu = await prisma.navigationMenu.findUnique({ where: { key } });
  if (!menu) throw new Error("Menu not found.");
  const location = menu.location as NavigationLocation;
  const normalized = items.map((item) => normalizeMenuItem(item, location));
  const validation = validateNavigationItems(normalized, location);
  if (!validation.valid) throw new Error(validation.errors.join(" "));
  const updated = await prisma.navigationMenu.update({
    where: { key },
    data: {
      draftItems: normalized,
      version: { increment: 1 },
      updatedBy: actor,
    },
  });
  return { ...updated, draftItems: normalized, publishedItems: asItems(updated.publishedItems) };
}

export async function publishNavigationMenu(key: string, actor = "admin") {
  const menu = await prisma.navigationMenu.findUnique({ where: { key } });
  if (!menu) throw new Error("Menu not found.");
  const location = menu.location as NavigationLocation;
  const draft = asItems(menu.draftItems).map((item) => normalizeMenuItem(item, location));
  const validation = validateNavigationItems(draft, location);
  if (!validation.valid) throw new Error(validation.errors.join(" "));

  const published = await prisma.navigationMenu.update({
    where: { key },
    data: {
      draftItems: draft,
      publishedItems: enabledItems(draft),
      publishedAt: new Date(),
      publishedBy: actor,
      version: { increment: 1 },
    },
  });

  revalidatePath("/", "layout");
  return { ...published, draftItems: draft, publishedItems: asItems(published.publishedItems) };
}

export async function getPublishedPrimaryMenu() {
  return getPublishedMenu("header-primary");
}

export async function getPublishedMobileMenu() {
  const settings = await getNavigationSettings();
  if (settings.headerMobileMode === "inherit_header_primary") return getPublishedPrimaryMenu();
  return getPublishedMenu(settings.headerMobileMenuKey || "header-mobile");
}

export async function getPublishedFooterMenus() {
  const [settings, companyMenu, servicesMenu, exploreMenu, legalMenu, socialMenu] = await Promise.all([
    getNavigationSettings(),
    getPublishedMenu("footer-company"),
    getPublishedMenu("footer-services"),
    getPublishedMenu("footer-explore"),
    getPublishedMenu("footer-legal"),
    getPublishedMenu("footer-social"),
  ]);
  return {
    settings,
    companyMenu,
    servicesMenu,
    exploreMenu,
    legalMenu: settings.footerShowLegal ? legalMenu : [],
    socialMenu: settings.footerShowSocial ? socialMenu : [],
  };
}

async function getPublishedMenu(key: string) {
  let menu = null;
  try {
    menu = await prisma.navigationMenu.findUnique({ where: { key } });
  } catch (error) {
    console.warn(`Navigation menu ${key} unavailable; using defaults.`, error);
  }
  if (!menu) {
    const definition = NAVIGATION_LOCATIONS.find((entry) => entry.key === key);
    return definition ? enabledItems(DEFAULT_NAVIGATION_ITEMS[definition.location]) : [];
  }
  const published = asItems(menu.publishedItems);
  return enabledItems(published.length ? published : asItems(menu.draftItems));
}

function countItems(items: NavigationMenuItem[]): number {
  return items.reduce((sum, item) => sum + 1 + countItems(item.children || []), 0);
}

function countEnabled(items: NavigationMenuItem[]): number {
  return items.reduce((sum, item) => sum + (item.isEnabled === false ? 0 : 1) + countEnabled(item.children || []), 0);
}

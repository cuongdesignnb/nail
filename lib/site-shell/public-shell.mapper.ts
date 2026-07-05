import type { GlobalContent, ImageField } from "@/lib/content/content.types";
import type { NavigationMenuItem, NavigationMenuSettingDTO } from "@/lib/navigation/navigation.types";
import type { PublicShellData } from "./public-shell.types";

function safeItems(value: unknown): NavigationMenuItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is NavigationMenuItem => Boolean(item && typeof item === "object" && "label" in item))
    .filter((item) => item.isEnabled !== false)
    .map((item) => ({
      ...item,
      children: safeItems(item.children),
    }));
}

function safeLogo(logo: ImageField | null | undefined): ImageField | null {
  if (!logo?.src || !logo.alt) return null;
  if (logo.src.endsWith("/images/logo-aera.png")) return null;
  return logo;
}

function footerLayout(value: string | undefined): NavigationMenuSettingDTO["footerLayout"] {
  if (value === "two_columns" || value === "three_columns" || value === "four_columns") return value;
  return "four_columns";
}

export function mapPublicShellData(input: {
  global: GlobalContent;
  primaryMenu: NavigationMenuItem[];
  mobileMenu: NavigationMenuItem[];
  companyMenu: NavigationMenuItem[];
  servicesMenu: NavigationMenuItem[];
  exploreMenu: NavigationMenuItem[];
  legalMenu: NavigationMenuItem[];
  socialMenu: NavigationMenuItem[];
  settings: NavigationMenuSettingDTO;
}): PublicShellData {
  const global = input.global;
  const settings = input.settings;
  return {
    brand: {
      name: global.brand?.name || "Aera Nail Lounge",
      logo: safeLogo(global.brand?.logo),
      tagline: global.brand?.tagline || null,
    },
    header: {
      primaryMenu: safeItems(input.primaryMenu),
      mobileMenu: safeItems(input.mobileMenu),
      cta: global.headerNav?.cta || null,
    },
    footer: {
      brandText: global.footer?.brandText || null,
      companyMenu: safeItems(input.companyMenu),
      servicesMenu: safeItems(input.servicesMenu),
      exploreMenu: safeItems(input.exploreMenu),
      legalMenu: settings.footerShowLegal ? safeItems(input.legalMenu) : [],
      socialMenu: settings.footerShowSocial ? safeItems(input.socialMenu) : [],
      contact: global.footer?.contact || global.defaultContact || null,
      newsletter: global.footer?.newsletter || null,
      copyright: global.footer?.copyright || null,
      layout: footerLayout(settings.footerLayout),
      showLegal: settings.footerShowLegal,
      showSocial: settings.footerShowSocial,
    },
  };
}

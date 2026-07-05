import { unstable_cache } from "next/cache";
import { getPublishedGlobalContent } from "@/lib/content/content.service";
import {
  getNavigationSettings,
  getPublishedFooterCompanyMenu,
  getPublishedFooterExploreMenu,
  getPublishedFooterLegalMenu,
  getPublishedFooterServicesMenu,
  getPublishedFooterSocialMenu,
  getPublishedMobileMenu,
  getPublishedPrimaryMenu,
} from "@/lib/navigation/navigation.service";
import { mapPublicShellData } from "./public-shell.mapper";
import type { PublicShellData, PublicShellMode } from "./public-shell.types";

async function loadPublishedPublicShellData(): Promise<PublicShellData> {
  const [
    global,
    primaryMenu,
    mobileMenu,
    companyMenu,
    servicesMenu,
    exploreMenu,
    legalMenu,
    socialMenu,
    settings,
  ] = await Promise.all([
    getPublishedGlobalContent(),
    getPublishedPrimaryMenu(),
    getPublishedMobileMenu(),
    getPublishedFooterCompanyMenu(),
    getPublishedFooterServicesMenu(),
    getPublishedFooterExploreMenu(),
    getPublishedFooterLegalMenu(),
    getPublishedFooterSocialMenu(),
    getNavigationSettings(),
  ]);

  return mapPublicShellData({
    global,
    primaryMenu,
    mobileMenu,
    companyMenu,
    servicesMenu,
    exploreMenu,
    legalMenu,
    socialMenu,
    settings,
  });
}

const cachedPublishedPublicShellData = unstable_cache(
  loadPublishedPublicShellData,
  ["public-shell"],
  {
    tags: [
      "public-shell",
      "public-header",
      "public-footer",
      "global-content",
      "navigation:header-primary",
      "navigation:header-mobile",
      "navigation:footer-company",
      "navigation:footer-services",
      "navigation:footer-explore",
      "navigation:footer-legal",
      "navigation:footer-social",
    ],
    revalidate: 300,
  },
);

export async function getPublishedPublicShellData(mode: PublicShellMode = "published") {
  if (mode === "draft-preview") {
    return loadPublishedPublicShellData();
  }
  return cachedPublishedPublicShellData();
}

export async function getPublishedPublicFooterData() {
  const shell = await getPublishedPublicShellData();
  return {
    brand: shell.brand,
    footer: shell.footer,
    menus: {
      company: shell.footer.companyMenu,
      services: shell.footer.servicesMenu,
      explore: shell.footer.exploreMenu,
      legal: shell.footer.legalMenu,
      social: shell.footer.socialMenu,
    },
  };
}

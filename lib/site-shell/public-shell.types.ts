import type { ButtonField, ContactField, ImageField } from "@/lib/content/content.types";
import type { NavigationMenuItem, NavigationMenuSettingDTO } from "@/lib/navigation/navigation.types";

export type PublicShellMode = "published" | "draft-preview";

export type PublicShellBrand = {
  name: string;
  logo: ImageField | null;
  tagline?: string | null;
};

export type PublicShellData = {
  brand: PublicShellBrand;
  header: {
    primaryMenu: NavigationMenuItem[];
    mobileMenu: NavigationMenuItem[];
    cta: ButtonField | null;
  };
  footer: {
    brandText: string | null;
    companyMenu: NavigationMenuItem[];
    servicesMenu: NavigationMenuItem[];
    exploreMenu: NavigationMenuItem[];
    legalMenu: NavigationMenuItem[];
    socialMenu: NavigationMenuItem[];
    contact: ContactField | null;
    newsletter: {
      title: string;
      description: string;
      placeholder?: string;
      enabled?: boolean;
    } | null;
    copyright: string | null;
    layout: NavigationMenuSettingDTO["footerLayout"];
    showLegal: boolean;
    showSocial: boolean;
  };
};

export type NavigationLocation =
  | "header_primary"
  | "header_mobile"
  | "footer_company"
  | "footer_services"
  | "footer_explore"
  | "footer_legal"
  | "footer_social";

export type NavigationLinkType = "internal" | "external" | "anchor" | "mailto" | "tel" | "none";

export type NavigationMenuItem = {
  id: string;
  label: string;
  href?: string;
  type: NavigationLinkType;
  target?: "_self" | "_blank";
  isEnabled: boolean;
  children?: NavigationMenuItem[];
  icon?: string;
};

export type NavigationMenuDTO = {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  location: NavigationLocation;
  draftItems: NavigationMenuItem[];
  publishedItems: NavigationMenuItem[];
  version: number;
  publishedAt?: string | null;
  updatedAt: string;
};

export type NavigationMenuSettingDTO = {
  headerMobileMode: "inherit_header_primary" | "custom_menu";
  headerMobileMenuKey: string;
  footerLayout: "two_columns" | "three_columns" | "four_columns";
  footerShowSocial: boolean;
  footerShowLegal: boolean;
};

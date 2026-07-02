export type PageKey =
  | "home"
  | "about"
  | "services"
  | "gallery"
  | "packages"
  | "booking"
  | "contact"
  | "global";

export type PageContentBlockDTO = {
  id: string;
  pageKey: PageKey | string;
  sectionKey: string;
  blockKey: string;
  label?: string;
  value?: string;
  jsonValue?: unknown;
  sortOrder: number;
  isActive: boolean;
};

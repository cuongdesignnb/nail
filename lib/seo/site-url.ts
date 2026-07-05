import { PRIVATE_PATH_PREFIXES } from "./seo.constants";

function trimTrailingSlash(value: string) {
  return value.length > 1 ? value.replace(/\/+$/, "") : value;
}

export function normalizeCanonicalPath(pathname: string | null | undefined): string {
  if (!pathname || typeof pathname !== "string") return "/";
  const withoutQuery = pathname.split("?")[0]?.split("#")[0] || "/";
  const prefixed = withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
  const collapsed = prefixed.replace(/\/{2,}/g, "/");
  return collapsed === "/" ? "/" : trimTrailingSlash(collapsed);
}

export function isAllowedPublicPath(pathname: string | null | undefined): boolean {
  const normalized = normalizeCanonicalPath(pathname);
  const lower = normalized.toLowerCase();
  return !PRIVATE_PATH_PREFIXES.some(
    (prefix) => lower === prefix || lower.startsWith(`${prefix}/`),
  );
}

export function getPublicSiteUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === "production" ? "https://www.example.com" : "http://localhost:3000");
  let parsed: URL;

  try {
    parsed = new URL(configured);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be a valid absolute URL.");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("NEXT_PUBLIC_SITE_URL must use http or https.");
  }

  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_SITE_URL &&
    (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1")
  ) {
    throw new Error("NEXT_PUBLIC_SITE_URL cannot be localhost in production.");
  }

  parsed.pathname = "";
  parsed.search = "";
  parsed.hash = "";
  return trimTrailingSlash(parsed.toString());
}

export function buildAbsoluteUrl(pathname: string | null | undefined): string {
  const normalized = normalizeCanonicalPath(pathname);
  if (!isAllowedPublicPath(normalized)) {
    throw new Error(`Cannot build canonical URL for private path: ${normalized}`);
  }
  return `${getPublicSiteUrl()}${normalized === "/" ? "" : normalized}`;
}

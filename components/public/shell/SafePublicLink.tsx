import Link from "next/link";
import type { ReactNode } from "react";
import type { NavigationMenuItem } from "@/lib/navigation/navigation.types";

const blockedPrefixes = ["/admin", "/api", "/login", "/preview"];

function isBlockedHref(href: string) {
  return blockedPrefixes.some((prefix) => href === prefix || href.startsWith(`${prefix}/`));
}

export function SafePublicLink({
  item,
  children,
  className,
}: {
  item: NavigationMenuItem;
  children?: ReactNode;
  className?: string;
}) {
  if (item.isEnabled === false) return null;
  if (item.type === "none") return <span className={className}>{children || item.label}</span>;

  const href = (item.href || "").trim();
  if (!href || href === "#" || /^\s*(javascript|data):/i.test(href)) return null;
  if (item.type === "internal" && isBlockedHref(href)) return null;

  if (item.type === "external") {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        {children || item.label}
      </a>
    );
  }

  if (item.type === "mailto" || item.type === "tel") {
    return (
      <a className={className} href={href}>
        {children || item.label}
      </a>
    );
  }

  if (item.type === "anchor") {
    return (
      <a className={className} href={href}>
        {children || item.label}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {children || item.label}
    </Link>
  );
}

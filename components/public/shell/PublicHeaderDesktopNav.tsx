"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { NavigationMenuItem } from "@/lib/navigation/navigation.types";

function isExternal(item: NavigationMenuItem) {
  return item.type === "external" || item.type === "mailto" || item.type === "tel";
}

function isActive(pathname: string, href?: string) {
  if (!href || href === "#") return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function HeaderNavLink({ item, pathname }: { item: NavigationMenuItem; pathname: string }) {
  const className = isActive(pathname, item.href) ? "is-active" : undefined;
  if (item.type === "none") return <span className={className}>{item.label}</span>;
  if (isExternal(item)) {
    return (
      <a className={className} href={item.href} target={item.type === "external" ? "_blank" : item.target} rel={item.type === "external" ? "noopener noreferrer" : undefined}>
        {item.label}
      </a>
    );
  }
  return <Link className={className} href={item.href || "/"}>{item.label}</Link>;
}

function MenuBranch({ item, pathname, depth = 0 }: { item: NavigationMenuItem; pathname: string; depth?: number }) {
  const children = (item.children || []).filter((child) => child.isEnabled !== false);
  if (!children.length || depth >= 3) {
    return <HeaderNavLink item={item} pathname={pathname} />;
  }
  return (
    <div className="aera-public-header__nav-item">
      <div className="aera-public-header__nav-row">
        <HeaderNavLink item={item} pathname={pathname} />
        <button type="button" aria-label={`Open ${item.label} menu`}>
          <ChevronDown size={14} />
        </button>
      </div>
      <div className="aera-public-header__submenu" role="menu">
        {children.map((child) => (
          <MenuBranch key={child.id} item={child} pathname={pathname} depth={depth + 1} />
        ))}
      </div>
    </div>
  );
}

export function PublicHeaderDesktopNav({ items, pathname }: { items: NavigationMenuItem[]; pathname: string }) {
  const visible = items.filter((item) => item.isEnabled !== false);
  if (!visible.length) return null;
  return (
    <nav className="aera-public-header__desktop-nav" aria-label="Primary navigation">
      {visible.map((item) => (
        <MenuBranch key={item.id} item={item} pathname={pathname} />
      ))}
    </nav>
  );
}

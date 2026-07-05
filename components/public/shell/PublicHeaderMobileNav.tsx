"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { NavigationMenuItem } from "@/lib/navigation/navigation.types";

function isExternal(item: NavigationMenuItem) {
  return item.type === "external" || item.type === "mailto" || item.type === "tel";
}

function MobileItem({ item, onNavigate, depth = 0 }: { item: NavigationMenuItem; onNavigate: () => void; depth?: number }) {
  const [open, setOpen] = useState(depth === 0);
  const children = (item.children || []).filter((child) => child.isEnabled !== false);
  const hasChildren = children.length > 0 && depth < 3;
  const className = "aera-public-mobile-drawer__link";

  const label = item.type === "none" ? (
    <button className={className} type="button" onClick={() => setOpen((value) => !value)}>
      <span>{item.label}</span>
    </button>
  ) : isExternal(item) ? (
    <a className={className} href={item.href} target={item.type === "external" ? "_blank" : item.target} rel={item.type === "external" ? "noopener noreferrer" : undefined} onClick={onNavigate}>
      <span>{item.label}</span>
    </a>
  ) : (
    <Link className={className} href={item.href || "/"} onClick={onNavigate}>
      <span>{item.label}</span>
    </Link>
  );

  return (
    <div className="aera-public-mobile-drawer__item" style={{ paddingLeft: depth ? 14 : 0 }}>
      <div className="aera-public-mobile-drawer__row">
        {label}
        {hasChildren && (
          <button className="aera-public-mobile-drawer__toggle" type="button" aria-expanded={open} aria-label={`Toggle ${item.label}`} onClick={() => setOpen((value) => !value)}>
            <ChevronDown size={16} />
          </button>
        )}
      </div>
      {hasChildren && open && (
        <div className="aera-public-mobile-drawer__children">
          {children.map((child) => (
            <MobileItem key={child.id} item={child} onNavigate={onNavigate} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function PublicHeaderMobileNav({ items, onNavigate }: { items: NavigationMenuItem[]; onNavigate: () => void }) {
  const visible = items.filter((item) => item.isEnabled !== false);
  if (!visible.length) return null;
  return (
    <nav className="aera-public-mobile-drawer__nav" aria-label="Mobile navigation">
      {visible.map((item) => (
        <MobileItem key={item.id} item={item} onNavigate={onNavigate} />
      ))}
    </nav>
  );
}

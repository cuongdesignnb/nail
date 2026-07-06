"use client";

import Link from "next/link";
import { useState } from "react";

/* ────────────────────────────── Types ────────────────────────────── */
export type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

/* ────────────────────────────── Props ────────────────────────────── */
interface AdminSidebarNavProps {
  groups: NavGroup[];
  pathname: string;
  collapsed?: boolean;
  onItemClick?: () => void;
}

/* ────────────────────────────── Tooltip ────────────────────────────── */
function SidebarTooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap rounded-[var(--admin-radius-sm)] bg-[var(--admin-ink)] text-[var(--admin-surface)] shadow-[var(--admin-shadow-md)] z-[var(--admin-z-dropdown)] px-3 py-1.5 text-xs font-medium"
        >
          {label}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────── Component ────────────────────────────── */
export default function AdminSidebarNav({
  groups,
  pathname,
  collapsed = false,
  onItemClick,
}: AdminSidebarNavProps) {
  return (
    <nav className="admin-sidebar__nav">
      {groups.map((group, groupIdx) => (
        <div key={group.title} className="admin-sidebar__group">
          {/* Group title: show label when expanded, divider when collapsed */}
          {!collapsed && (
            <span className="admin-sidebar__group-title">{group.title}</span>
          )}
          {collapsed && groupIdx > 0 && (
            <div className="admin-sidebar__divider" />
          )}

          {/* Navigation items */}
          {group.items.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            const linkClassName = [
              "admin-sidebar__item",
              "admin-focus-ring",
              isActive ? "admin-sidebar__item--active" : "",
            ]
              .filter(Boolean)
              .join(" ");

            const linkContent = (
              <Link
                href={item.href}
                className={linkClassName}
                onClick={onItemClick}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon size={18} strokeWidth={1.8} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );

            /* Wrap in tooltip when sidebar is collapsed */
            if (collapsed) {
              return (
                <SidebarTooltip key={item.href} label={item.label}>
                  {linkContent}
                </SidebarTooltip>
              );
            }

            return <div key={item.href}>{linkContent}</div>;
          })}
        </div>
      ))}
    </nav>
  );
}

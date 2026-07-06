"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Gift, Layers, ClipboardList, Gem, Compass, Star, Settings } from "lucide-react";
import clsx from "clsx";

export function AdminPackagesNavTabs() {
  const pathname = usePathname();

  const tabs = [
    { href: "/admin/packages", label: "Dashboard", icon: LayoutGrid },
    { href: "/admin/packages/items", label: "Package Cards", icon: Gift },
    { href: "/admin/packages/categories", label: "Category Tabs", icon: Layers },
    { href: "/admin/packages/comparison", label: "Comparison Table", icon: ClipboardList },
    { href: "/admin/packages/rewards", label: "Loyalty Perks", icon: Gem },
    { href: "/admin/packages/occasions", label: "Occasion Cards", icon: Compass },
    { href: "/admin/packages/settings", label: "Page Settings", icon: Settings },
  ];

  return (
    <div className="flex border-b border-[var(--admin-border)]/45 mb-6 overflow-x-auto pb-0.5 scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const IconComp = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(
              "flex items-center gap-2 px-5 py-3 border-b-2 font-sans text-xs font-semibold tracking-wider transition-all whitespace-nowrap decoration-none cursor-pointer",
              {
                "border-[var(--admin-accent)] text-[var(--admin-accent)] bg-[var(--admin-surface-muted)]": isActive,
                "border-transparent text-[var(--admin-muted)] hover:text-[var(--admin-accent)] hover:border-[var(--admin-accent)]/30": !isActive,
              }
            )}
          >
            <IconComp size={14} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
export default AdminPackagesNavTabs;

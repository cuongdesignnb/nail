"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Gem, Layers, Package, Settings } from "lucide-react";

export function AdminNavTabs() {
  const pathname = usePathname();

  const tabs = [
    { label: "Services", href: "/admin/services", icon: Gem },
    { label: "Categories", href: "/admin/services/categories", icon: Layers },
    { label: "Packages", href: "/admin/services/packages", icon: Package },
    { label: "Page Settings", href: "/admin/services/settings", icon: Settings },
  ];

  return (
    <div className="flex border-b border-aera-champagne/60 mb-6 w-full font-sans">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(
              "flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-xs tracking-wider uppercase transition-all duration-200 decoration-none -mb-[2px]",
              {
                "border-aera-accent text-aera-accent font-bold": isActive,
                "border-transparent text-aera-muted hover:text-aera-accent hover:border-aera-champagne": !isActive,
              }
            )}
          >
            <Icon size={14} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
export default AdminNavTabs;

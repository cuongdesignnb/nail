"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Image, Layers, Sparkles, Star, Settings } from "lucide-react";
import clsx from "clsx";

export function AdminGalleryNavTabs() {
  const pathname = usePathname();

  const tabs = [
    { href: "/admin/gallery", label: "Dashboard", icon: LayoutGrid },
    { href: "/admin/gallery/items", label: "Gallery Items", icon: Image },
    { href: "/admin/gallery/collections", label: "Collections", icon: Layers },
    { href: "/admin/gallery/trends", label: "Trends", icon: Sparkles },
    { href: "/admin/gallery/testimonials", label: "Testimonials", icon: Star },
    { href: "/admin/gallery/settings", label: "Page Settings", icon: Settings },
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
                "border-[var(--admin-accent)] text-[var(--admin-accent)] bg-[var(--admin-surface-hover)]": isActive,
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
export default AdminGalleryNavTabs;

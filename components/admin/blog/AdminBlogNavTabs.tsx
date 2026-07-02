"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, FileText, Layers, Settings, Image as ImageIcon } from "lucide-react";
import clsx from "clsx";

export function AdminBlogNavTabs() {
  const pathname = usePathname();

  const tabs = [
    { href: "/admin/blog", label: "Dashboard", icon: LayoutGrid },
    { href: "/admin/blog/posts", label: "Articles List", icon: FileText },
    { href: "/admin/blog/categories", label: "Category Tabs", icon: Layers },
    { href: "/admin/blog/settings", label: "Page Settings", icon: Settings },
    { href: "/admin/media-library", label: "Media Explorer", icon: ImageIcon },
  ];

  return (
    <div className="flex border-b border-aera-champagne/45 mb-6 overflow-x-auto pb-0.5 scrollbar-hide">
      {tabs.map((tab) => {
        // active checks
        const isActive = pathname === tab.href || (tab.href !== "/admin/blog" && pathname.startsWith(tab.href));
        const IconComp = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(
              "flex items-center gap-2 px-5 py-3 border-b-2 font-sans text-xs font-semibold tracking-wider transition-all whitespace-nowrap decoration-none cursor-pointer",
              {
                "border-aera-accent text-aera-accent bg-aera-champagne/5": isActive,
                "border-transparent text-aera-muted hover:text-aera-accent hover:border-aera-accent/30": !isActive,
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
export default AdminBlogNavTabs;

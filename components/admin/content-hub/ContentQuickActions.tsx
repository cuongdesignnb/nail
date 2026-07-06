"use client";

import Link from "next/link";
import { Pencil, Eye, Search, ExternalLink } from "lucide-react";
import type { ContentRegistryItem } from "@/lib/content/content.types";

type Props = {
  pageKey: string;
  registry: ContentRegistryItem;
};

export function ContentQuickActions({ pageKey, registry }: Props) {
  const actions = [
    {
      label: "Edit Content",
      href: `/admin/content/${pageKey}`,
      icon: Pencil,
      primary: true,
    },
    ...(registry.previewEnabled
      ? [
          {
            label: "Preview Draft",
            href: `/admin/content/${pageKey}/preview`,
            icon: Eye,
            primary: false,
          },
        ]
      : []),
    {
      label: "SEO",
      href: `/admin/content/${pageKey}?tab=seo`,
      icon: Search,
      primary: false,
    },
    ...(registry.publicPath
      ? [
          {
            label: "View Page",
            href: registry.publicPath,
            icon: ExternalLink,
            primary: false,
          },
        ]
      : []),
  ];

  return (
    <div className="mt-4 pt-3 border-t border-[var(--admin-border)]/40 flex flex-wrap gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        const isExternal = action.href.startsWith("/") && !action.href.startsWith("/admin");

        return (
          <Link
            key={action.label}
            href={action.href}
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold rounded-lg px-3 py-1.5 transition-all duration-200 no-underline ${
              action.primary
                ? "bg-[var(--admin-accent)] text-white hover:bg-[var(--admin-accent-hover)] shadow-sm"
                : "bg-[var(--admin-accent-soft)] text-[var(--admin-ink)] hover:bg-[var(--admin-accent-soft)] hover:text-[var(--admin-accent)]"
            }`}
          >
            <Icon size={12} />
            {action.label}
          </Link>
        );
      })}
    </div>
  );
}

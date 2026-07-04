"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Home,
  Info,
  Sparkles,
  Image as ImageIcon,
  Package,
  Tags,
  Phone,
  BookOpen,
  Globe,
  ExternalLink,
  Clock,
  CalendarCheck,
  type LucideIcon,
} from "lucide-react";
import type {
  ContentPageMeta,
  ContentRegistryItem,
} from "@/lib/content/content.types";
import { ContentStatusChip } from "./ContentStatusChip";
import { ContentCompletionList } from "./ContentCompletionList";
import { ContentQuickActions } from "./ContentQuickActions";

/* ------------------------------------------------------------------ */
/*  Icon Mapping                                                      */
/* ------------------------------------------------------------------ */

const ICON_MAP: Record<string, LucideIcon> = {
  Home,
  Info,
  Sparkles,
  Image: ImageIcon,
  Package,
  Tags,
  Phone,
  BookOpen,
  Globe,
};

function getIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || Globe;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function relativeTime(dateStr: string | null): string | null {
  if (!dateStr) return null;
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

type Props = {
  meta: ContentPageMeta;
  registry: ContentRegistryItem;
};

export function ContentPageCard({ meta, registry }: Props) {
  const Icon = getIcon(registry.icon);
  const updatedAgo = relativeTime(meta.updatedAt);
  const publishedAgo = relativeTime(meta.publishedAt);

  return (
    <div className="group bg-white/90 border border-aera-champagne/30 rounded-2xl p-5 hover:shadow-luxury hover:border-aera-accent/20 transition-all duration-300 flex flex-col">
      {/* Top row: icon + status */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aera-champagne to-aera-cream flex items-center justify-center group-hover:from-aera-accent/10 group-hover:to-aera-champagne transition-all">
          <Icon size={18} className="text-aera-accent" />
        </div>
        <ContentStatusChip status={meta.status} />
      </div>

      {/* Title */}
      <h3 className="text-sm font-bold text-aera-ink mb-1.5 group-hover:text-aera-accent transition-colors">
        {registry.label}
      </h3>

      {/* Description */}
      <p className="text-[11px] text-aera-muted leading-relaxed mb-3">
        {registry.description}
      </p>

      {/* Public URL */}
      {registry.publicPath && (
        <Link
          href={registry.publicPath}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-aera-accent font-medium hover:text-aera-accentHover transition-colors mb-3 no-underline"
        >
          <ExternalLink size={11} />
          aeranaillounge.com{registry.publicPath}
        </Link>
      )}

      {/* Timestamps */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-aera-muted mb-1">
        {updatedAgo && (
          <span className="inline-flex items-center gap-1">
            <Clock size={10} className="shrink-0" />
            Updated {updatedAgo}
          </span>
        )}
        {publishedAgo && (
          <span className="inline-flex items-center gap-1">
            <CalendarCheck size={10} className="shrink-0" />
            Published {publishedAgo}
          </span>
        )}
      </div>

      {/* Completion list (missing items) — grows to fill space */}
      <div className="flex-1">
        <ContentCompletionList missing={meta.completion.missing} />
      </div>

      {/* Quick actions */}
      <ContentQuickActions pageKey={meta.key} registry={registry} />
    </div>
  );
}

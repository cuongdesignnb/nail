"use client";

import Link from "next/link";
import { ChevronRight, Eye, ExternalLink } from "lucide-react";
import type { ContentRegistryItem, ContentStatus } from "@/lib/content/content.types";

/* ────────────── Status Chip ────────────── */

function StatusChip({ status }: { status: ContentStatus }) {
  const config: Record<ContentStatus, { label: string; cls: string }> = {
    published: {
      label: "Published",
      cls: "bg-green-50 text-green-700 border-green-200",
    },
    "draft-changes": {
      label: "Draft Changes",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
    "not-published": {
      label: "Not Published",
      cls: "bg-gray-100 text-gray-600 border-gray-200",
    },
    "needs-attention": {
      label: "Needs Attention",
      cls: "bg-red-50 text-red-700 border-red-200",
    },
  };

  const { label, cls } = config[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cls}`}
    >
      {label}
    </span>
  );
}

/* ────────────── Timestamp ────────────── */

function TimeAgo({ date, label }: { date: string | null; label: string }) {
  if (!date) return null;
  const d = new Date(date);
  const formatted = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <span className="text-[11px] text-[var(--admin-muted)]">
      {label}: <span className="font-medium text-[var(--admin-ink)]/70">{formatted}</span>
    </span>
  );
}

/* ────────────── Header ────────────── */

interface ContentEditorHeaderProps {
  registryItem: ContentRegistryItem;
  status: ContentStatus;
  updatedAt: string | null;
  publishedAt: string | null;
  isDirty: boolean;
}

export function ContentEditorHeader({
  registryItem,
  status,
  updatedAt,
  publishedAt,
  isDirty,
}: ContentEditorHeaderProps) {
  return (
    <div className="space-y-3">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[11px] text-[var(--admin-muted)]">
        <Link
          href="/admin/content"
          className="font-medium hover:text-[var(--admin-accent)] transition-colors no-underline"
        >
          Content Hub
        </Link>
        <ChevronRight size={12} className="flex-shrink-0" />
        <span className="font-bold text-[var(--admin-ink)]">{registryItem.label}</span>
      </nav>

      {/* Title Row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-[clamp(22px,3vw,32px)] font-medium text-[var(--admin-ink)] leading-tight">
            {registryItem.label}
          </h1>
          <p className="mt-1 text-xs text-[var(--admin-muted)] max-w-lg">
            {registryItem.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {registryItem.previewEnabled && (
            <Link
              href={`/admin/content/${registryItem.key}/preview`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--admin-border)]/50 bg-white px-3.5 py-2 text-[11px] font-bold text-[var(--admin-ink)] hover:border-[var(--admin-accent)]/30 hover:shadow-sm transition-all no-underline"
            >
              <Eye size={13} />
              Preview Draft
            </Link>
          )}
          {registryItem.publicPath && (
            <a
              href={registryItem.publicPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--admin-border)]/50 bg-white px-3.5 py-2 text-[11px] font-bold text-[var(--admin-ink)] hover:border-[var(--admin-accent)]/30 hover:shadow-sm transition-all no-underline"
            >
              <ExternalLink size={13} />
              View Public Page
            </a>
          )}
        </div>
      </div>

      {/* Status + Timestamps */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <StatusChip status={status} />
          {isDirty && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ring-1 text-blue-700 bg-blue-50/50 ring-blue-200/60 animate-pulse">
              Unsaved Changes
            </span>
          )}
        </div>
        <TimeAgo date={updatedAt} label="Last saved" />
        <TimeAgo date={publishedAt} label="Published" />
      </div>
    </div>
  );
}

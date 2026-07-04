"use client";

import { CheckCircle2, Clock, AlertCircle, CircleDot } from "lucide-react";
import type { ContentStatus } from "@/lib/content/content.types";

/* ------------------------------------------------------------------ */
/*  Status Config                                                     */
/* ------------------------------------------------------------------ */

const STATUS_CONFIG: Record<
  ContentStatus,
  { label: string; icon: React.ElementType; cls: string }
> = {
  published: {
    label: "Published",
    icon: CheckCircle2,
    cls: "text-emerald-700 bg-emerald-50 ring-emerald-200/60",
  },
  "draft-changes": {
    label: "Draft Changes",
    icon: Clock,
    cls: "text-amber-700 bg-amber-50 ring-amber-200/60",
  },
  "not-published": {
    label: "Not Published",
    icon: CircleDot,
    cls: "text-gray-500 bg-gray-100 ring-gray-200/60",
  },
  "needs-attention": {
    label: "Needs Attention",
    icon: AlertCircle,
    cls: "text-rose-700 bg-rose-50 ring-rose-200/60",
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function ContentStatusChip({ status }: { status: ContentStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ring-1 ${cfg.cls}`}
    >
      <Icon size={12} />
      {cfg.label}
    </span>
  );
}

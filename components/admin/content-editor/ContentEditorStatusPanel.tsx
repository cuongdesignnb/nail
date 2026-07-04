"use client";

import { motion } from "framer-motion";
import { Hash, Clock, Upload } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ContentStatusChip } from "@/components/admin/content-hub/ContentStatusChip";
import type { ContentStatus } from "@/lib/content/content.types";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ContentEditorStatusPanelProps {
  status: ContentStatus;
  version: number;
  updatedAt: string | null;
  publishedAt: string | null;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function RelativeTime({ date, label, icon: Icon }: { date: string | null; label: string; icon: React.ElementType }) {
  if (!date) return null;
  const relative = formatDistanceToNow(new Date(date), { addSuffix: true });
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="inline-flex items-center gap-1.5 text-aera-muted">
        <Icon size={11} className="flex-shrink-0 mt-px" />
        {label}
      </span>
      <span className="font-bold text-aera-ink/80 text-right" title={new Date(date).toLocaleString()}>
        {relative}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Displays current content status, version number, and timestamps.
 */
export function ContentEditorStatusPanel({
  status,
  version,
  updatedAt,
  publishedAt,
}: ContentEditorStatusPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.05, ease: "easeOut" }}
      className="rounded-2xl border border-aera-champagne/20 bg-white/90 p-4 space-y-4"
    >
      {/* Section label */}
      <p className="text-[10px] font-bold uppercase tracking-[1.4px] text-aera-muted">
        Status
      </p>

      {/* Status chip */}
      <div>
        <ContentStatusChip status={status} />
      </div>

      {/* Meta info */}
      <div className="grid gap-2.5 text-[11px]">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-aera-muted">
            <Hash size={11} />
            Version
          </span>
          <span className="inline-flex items-center justify-center rounded-full bg-aera-champagne/30 px-2 py-0.5 text-[10px] font-bold text-aera-ink">
            v{version}
          </span>
        </div>

        <RelativeTime date={updatedAt} label="Last saved" icon={Clock} />
        <RelativeTime date={publishedAt} label="Published" icon={Upload} />
      </div>
    </motion.div>
  );
}

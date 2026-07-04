"use client";

import { motion } from "framer-motion";
import { Upload, Undo2, RotateCcw } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ContentEditorPublishPanelProps {
  hasUnpublishedChanges: boolean;
  isDirty: boolean;
  onPublish: () => void;
  onDiscard: () => void;
  onRestore: () => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Publish, discard-draft, and restore-default actions.
 * Publish is disabled when the draft has unsaved changes (user must save first).
 */
export function ContentEditorPublishPanel({
  hasUnpublishedChanges,
  isDirty,
  onPublish,
  onDiscard,
  onRestore,
}: ContentEditorPublishPanelProps) {
  const publishDisabled = !hasUnpublishedChanges || isDirty;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1, ease: "easeOut" }}
      className="rounded-2xl border border-aera-champagne/20 bg-white/90 p-4 space-y-3"
    >
      <p className="text-[10px] font-bold uppercase tracking-[1.4px] text-aera-muted">
        Actions
      </p>

      {/* Publish */}
      <div className="relative group">
        <button
          type="button"
          onClick={onPublish}
          disabled={publishDisabled}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-emerald-600"
        >
          <Upload size={14} />
          Publish Changes
        </button>

        {/* Tooltip hint when dirty */}
        {isDirty && hasUnpublishedChanges && (
          <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-aera-ink/80 px-2 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
            Save draft first
          </span>
        )}
      </div>

      {/* Separator */}
      <hr className="border-aera-champagne/30" />

      {/* Discard Draft */}
      <button
        type="button"
        onClick={onDiscard}
        disabled={!hasUnpublishedChanges}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-aera-champagne/50 bg-transparent px-4 py-2 text-[11px] font-bold text-aera-muted transition-colors hover:border-amber-300 hover:text-amber-700 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-aera-champagne/50 disabled:hover:text-aera-muted"
      >
        <Undo2 size={13} />
        Discard Draft
      </button>

      {/* Restore Default */}
      <button
        type="button"
        onClick={onRestore}
        className="w-full inline-flex items-center justify-center gap-2 bg-transparent px-4 py-1.5 text-[10px] font-bold text-aera-muted transition-colors hover:text-red-600"
      >
        <RotateCcw size={12} />
        Restore Default Content
      </button>
    </motion.div>
  );
}

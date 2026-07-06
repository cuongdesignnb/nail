"use client";

import { motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ContentEditorToolbarProps {
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Primary "Save Draft" action bar shown at the top of the right sidebar.
 * Disabled when there are no unsaved changes or while a save is in progress.
 */
export function ContentEditorToolbar({
  isDirty,
  isSaving,
  onSave,
}: ContentEditorToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <button
        type="button"
        onClick={onSave}
        disabled={!isDirty || isSaving}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--admin-accent)] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-[var(--admin-accent-hover)] hover:shadow-md active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-[var(--admin-accent)]"
      >
        {isSaving ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Save size={14} />
        )}
        {isSaving ? "Saving…" : "Save Draft"}
      </button>
    </motion.div>
  );
}

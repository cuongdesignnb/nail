"use client";

import Link from "next/link";
import { RotateCcw, Save, Send, Undo2 } from "lucide-react";

type MenuEditorToolbarProps = {
  menuName: string;
  status: string;
  saving: boolean;
  hasLocalChanges: boolean;
  hasDraftChanges: boolean;
  onSave: () => void;
  onPublish: () => void;
  onDiscard: () => void;
  onRestore: () => void;
};

export function MenuEditorToolbar({ menuName, status, saving, hasLocalChanges, hasDraftChanges, onSave, onPublish, onDiscard, onRestore }: MenuEditorToolbarProps) {
  return (
    <div className="sticky top-0 z-20 rounded-3xl border border-aera-champagne/50 bg-white/95 p-4 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-aera-muted">
            <Link href="/admin/menus" className="hover:text-aera-accent">Menus</Link>
            <span>/</span>
            <span className="text-aera-ink">{menuName}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-3xl text-aera-ink">{menuName}</h1>
            <span className="rounded-full bg-aera-champagne/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-aera-ink">{status}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/menus" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-aera-champagne/60 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-aera-ink hover:bg-aera-champagne/20">
            <Undo2 className="h-4 w-4" />
            Back to Menus
          </Link>
          <button type="button" onClick={onDiscard} disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-aera-champagne/60 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-aera-ink hover:bg-aera-champagne/20 disabled:opacity-50">
            <RotateCcw className="h-4 w-4" />
            Discard Draft
          </button>
          <button type="button" onClick={onRestore} disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-aera-champagne/60 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-aera-ink hover:bg-aera-champagne/20 disabled:opacity-50">
            Restore Default
          </button>
          <button type="button" onClick={onSave} disabled={saving || !hasLocalChanges} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-aera-ink px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-aera-brown disabled:opacity-50">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button type="button" onClick={onPublish} disabled={saving || (!hasDraftChanges && !hasLocalChanges)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-aera-accent px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-aera-accentHover disabled:opacity-50">
            <Send className="h-4 w-4" />
            Publish Menu
          </button>
        </div>
      </div>
    </div>
  );
}

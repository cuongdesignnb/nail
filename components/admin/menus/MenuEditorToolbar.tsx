"use client";

import Link from "next/link";
import { Eye, MoreHorizontal, RotateCcw, Save, Send } from "lucide-react";
import { useState } from "react";

type MenuEditorToolbarProps = {
  menuName: string;
  description?: string | null;
  status: string;
  saving: boolean;
  hasLocalChanges: boolean;
  hasDraftChanges: boolean;
  onPreview: () => void;
  onSave: () => void;
  onPublish: () => void;
  onDiscard: () => void;
  onRestore: () => void;
};

export function MenuEditorToolbar({ menuName, description, status, saving, hasLocalChanges, hasDraftChanges, onPreview, onSave, onPublish, onDiscard, onRestore }: MenuEditorToolbarProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  return (
    <header className="sticky top-0 z-20 rounded-[22px] border border-aera-champagne/50 bg-white/95 p-4 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-aera-muted">
            <Link href="/admin" className="hover:text-aera-accent">Admin</Link>
            <span>/</span>
            <Link href="/admin/menus" className="hover:text-aera-accent">Menus</Link>
            <span>/</span>
            <span className="text-aera-ink">{menuName}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="truncate font-heading text-3xl text-aera-ink">{menuName}</h1>
            <span className="rounded-full bg-aera-champagne/35 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-aera-ink">{status}</span>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-aera-muted">{description || "Manage the links shown in this website menu."}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onPreview} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-aera-champagne/60 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-aera-ink hover:bg-aera-champagne/20">
            <Eye className="h-4 w-4" />
            Preview Draft
          </button>
          <button type="button" onClick={onSave} disabled={saving || !hasLocalChanges} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-aera-champagne/60 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-aera-ink hover:bg-aera-champagne/20 disabled:opacity-50">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button type="button" onClick={onPublish} disabled={saving || (!hasDraftChanges && !hasLocalChanges)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-aera-accent px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-aera-accentHover disabled:opacity-50">
            <Send className="h-4 w-4" />
            Publish Menu
          </button>
          <div className="relative">
            <button type="button" onClick={() => setMoreOpen((value) => !value)} className="flex h-11 w-11 items-center justify-center rounded-full border border-aera-champagne/60 bg-white text-aera-muted hover:bg-aera-champagne/20 hover:text-aera-ink" aria-label="More menu actions">
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-12 z-30 w-56 rounded-2xl border border-aera-champagne/60 bg-white p-2 shadow-2xl">
                <button type="button" onClick={() => { onDiscard(); setMoreOpen(false); }} disabled={saving} className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-aera-ink hover:bg-aera-champagne/20 disabled:opacity-50">
                  <RotateCcw className="h-4 w-4" />
                  Discard Draft
                </button>
                <button type="button" onClick={() => { onRestore(); setMoreOpen(false); }} disabled={saving} className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-aera-ink hover:bg-aera-champagne/20 disabled:opacity-50">
                  Restore Default
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

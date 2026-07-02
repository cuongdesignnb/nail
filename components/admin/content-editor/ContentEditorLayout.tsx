"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Eye, Save, Upload, Undo2, CheckCircle2, AlertCircle, Clock } from "lucide-react";

/* ────────────── Section Nav ────────────── */
type SectionDef = {
  key: string;
  label: string;
  icon: React.ElementType;
  complete?: boolean;
};

export function ContentEditorSectionNav({
  sections,
  activeKey,
  onSelect,
}: {
  sections: SectionDef[];
  activeKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <nav className="content-editor-section-nav">
      <p className="text-[10px] font-bold uppercase tracking-[1.4px] text-aera-muted px-3 mb-2">
        Sections
      </p>
      {sections.map((s) => {
        const isActive = s.key === activeKey;
        return (
          <button
            key={s.key}
            onClick={() => onSelect(s.key)}
            className={`content-editor-nav-item ${isActive ? "active" : ""}`}
          >
            <s.icon size={15} />
            <span>{s.label}</span>
            {s.complete && (
              <CheckCircle2 size={13} className="ml-auto text-green-600 flex-shrink-0" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

/* ────────────── Status Panel ────────────── */
type StatusPanelProps = {
  isDirty: boolean;
  hasUnpublishedChanges: boolean;
  loading: boolean;
  updatedAt: string | null;
  publishedAt: string | null;
  version: number;
  onSave: () => void;
  onPublish: () => void;
  onDiscard: () => void;
  onRestore: () => void;
  onPreview?: () => void;
};

export function ContentEditorStatusPanel({
  isDirty,
  hasUnpublishedChanges,
  loading,
  updatedAt,
  publishedAt,
  version,
  onSave,
  onPublish,
  onDiscard,
  onRestore,
  onPreview,
}: StatusPanelProps) {
  const statusLabel = hasUnpublishedChanges
    ? "Draft Changes"
    : publishedAt
    ? "Published"
    : "Not Published";
  const statusClass = hasUnpublishedChanges
    ? "changed"
    : publishedAt
    ? "published"
    : "not-published";

  return (
    <aside className="content-editor-status-panel">
      {/* Status */}
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[1.4px] text-aera-muted mb-2">
          Status
        </p>
        <span className={`draft-status ${statusClass}`}>{statusLabel}</span>
      </div>

      {/* Meta */}
      <div className="grid gap-2 mb-5 text-[11px]">
        <div className="flex justify-between">
          <span className="text-aera-muted">Version</span>
          <span className="font-bold">{version}</span>
        </div>
        {updatedAt && (
          <div className="flex justify-between">
            <span className="text-aera-muted">Last Saved</span>
            <span className="font-bold">{new Date(updatedAt).toLocaleDateString()}</span>
          </div>
        )}
        {publishedAt && (
          <div className="flex justify-between">
            <span className="text-aera-muted">Published</span>
            <span className="font-bold">{new Date(publishedAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="grid gap-2.5">
        <button
          onClick={onSave}
          disabled={!isDirty || loading}
          className="primary-btn w-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Save size={14} />
          {loading ? "Saving..." : "Save Draft"}
        </button>

        <button
          onClick={onPublish}
          disabled={!hasUnpublishedChanges || loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white rounded-xl px-4 py-2.5 text-xs font-bold hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Upload size={14} />
          Publish
        </button>

        {onPreview && (
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-btn w-full text-center"
          >
            <Eye size={14} />
            Preview
          </a>
        )}

        <hr className="border-aera-champagne/30 my-1" />

        <button
          onClick={onDiscard}
          disabled={!hasUnpublishedChanges || loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-transparent border border-aera-champagne/50 text-aera-muted rounded-xl px-4 py-2 text-[11px] font-bold hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Undo2 size={13} />
          Discard Draft
        </button>

        <button
          onClick={onRestore}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-transparent text-aera-muted text-[11px] font-bold hover:text-aera-accent transition-colors disabled:opacity-30"
        >
          Restore Defaults
        </button>
      </div>
    </aside>
  );
}

/* ────────────── Unsaved Guard ────────────── */
export function ContentEditorUnsavedGuard({ isDirty }: { isDirty: boolean }) {
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  return null;
}

/* ────────────── Layout ────────────── */
export function ContentEditorLayout({
  sectionNav,
  statusPanel,
  children,
}: {
  sectionNav: React.ReactNode;
  statusPanel: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="content-editor-layout">
      <div className="content-editor-left">{sectionNav}</div>
      <div className="content-editor-center">{children}</div>
      <div className="content-editor-right">{statusPanel}</div>
    </div>
  );
}

"use client";

import type { ContentStatus } from "@/lib/content/content.types";
import { ContentEditorToolbar } from "./ContentEditorToolbar";
import { ContentEditorStatusPanel } from "./ContentEditorStatusPanel";
import { ContentEditorPublishPanel } from "./ContentEditorPublishPanel";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ContentEditorSidebarProps {
  status: ContentStatus;
  version: number;
  updatedAt: string | null;
  publishedAt: string | null;
  isDirty: boolean;
  hasUnpublishedChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
  onPublish: () => void;
  onDiscard: () => void;
  onRestore: () => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Right sidebar container that composes the toolbar, status panel,
 * and publish panel into a sticky column.
 */
export function ContentEditorSidebar({
  status,
  version,
  updatedAt,
  publishedAt,
  isDirty,
  hasUnpublishedChanges,
  isSaving,
  onSave,
  onPublish,
  onDiscard,
  onRestore,
}: ContentEditorSidebarProps) {
  return (
    <div className="sticky top-6 space-y-4">
      {/* Save button */}
      <ContentEditorToolbar
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={onSave}
      />

      {/* Status info */}
      <ContentEditorStatusPanel
        status={status}
        version={version}
        updatedAt={updatedAt}
        publishedAt={publishedAt}
      />

      {/* Publish / Discard / Restore */}
      <ContentEditorPublishPanel
        hasUnpublishedChanges={hasUnpublishedChanges}
        isDirty={isDirty}
        onPublish={onPublish}
        onDiscard={onDiscard}
        onRestore={onRestore}
      />
    </div>
  );
}

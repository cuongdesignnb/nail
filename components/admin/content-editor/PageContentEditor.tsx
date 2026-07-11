"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";

import type {
  ContentPageKey,
  ContentPageData,
  ContentStatus,
  ContentRegistryItem,
  SeoFields,
  HeroFields,
} from "@/lib/content/content.types";
import { getRegistryItem } from "@/lib/content/content-registry";

import { ContentEditorHeader } from "@/components/admin/content-editor/ContentEditorHeader";
import { ContentEditorLayout } from "@/components/admin/content-editor/ContentEditorLayout";
import { ContentEditorSectionNav } from "@/components/admin/content-editor/ContentEditorSectionNav";
import { ContentEditorSection } from "@/components/admin/content-editor/ContentEditorSection";
import { ContentEditorUnsavedGuard } from "@/components/admin/content-editor/ContentEditorUnsavedGuard";
import { ContentEditorSkeleton } from "@/components/admin/content-editor/ContentEditorSkeleton";
import { ContentEditorSidebar } from "@/components/admin/content-editor/ContentEditorSidebar";
import { AdminConfirmDialog } from "@/components/admin/ui/AdminConfirmDialog";

import { getSectionEditor } from "./section-editor.registry";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PageContentEditorProps {
  pageKey: string;
}

type ConfirmState = {
  title: string;
  description: string;
  action: () => void;
  variant?: "default" | "danger";
} | null;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function deriveStatus(
  hasUnpublishedChanges: boolean,
  publishedAt: string | null
): ContentStatus {
  if (hasUnpublishedChanges) return "draft-changes";
  if (publishedAt) return "published";
  return "not-published";
}

/**
 * Build a completion map for the section nav.
 * A section is "complete" when its key exists in the content object
 * and has at least one non-empty value.
 */
function buildCompletionMap(
  content: Record<string, unknown>,
  sectionIds: string[]
): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  for (const id of sectionIds) {
    const val = content[id];
    if (val === undefined || val === null) {
      map[id] = false;
    } else if (typeof val === "object" && val !== null) {
      map[id] = Object.values(val as Record<string, unknown>).some(
        (v) => v !== "" && v !== null && v !== undefined
      );
    } else {
      map[id] = true;
    }
  }
  return map;
}

/* ------------------------------------------------------------------ */
/*  Toast                                                              */
/* ------------------------------------------------------------------ */

function Toast({
  message,
  variant,
  onDismiss,
  onAction,
  actionLabel,
}: {
  message: string;
  variant: "success" | "error";
  onDismiss: () => void;
  onAction?: () => void;
  actionLabel?: string;
}) {
  const isError = variant === "error";
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium shadow-sm ${
        isError
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-green-200 bg-green-50 text-green-700"
      }`}
    >
      {isError ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
      <span className="flex-1">{message}</span>
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="ml-3 rounded-lg bg-red-100 hover:bg-red-200 text-red-855 px-2.5 py-1 text-[10px] font-bold transition-all border border-red-200/50 shadow-sm"
        >
          {actionLabel}
        </button>
      )}
      <button
        onClick={onDismiss}
        className="ml-2 text-current opacity-50 hover:opacity-100 text-sm font-bold"
      >
        ×
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function PageContentEditor({ pageKey }: PageContentEditorProps) {
  /* ── Registry ── */
  const registryItem = useMemo(
    () => getRegistryItem(pageKey as ContentPageKey),
    [pageKey]
  );

  /* ── State ── */
  const [payload, setPayload] = useState<ContentPageData | null>(null);
  const [content, setContent] = useState<Record<string, unknown> | null>(null);
  const [savedDraft, setSavedDraft] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState(
    registryItem?.sections[0]?.id ?? "seo"
  );
  const [confirmAction, setConfirmAction] = useState<ConfirmState>(null);

  /* ── Derived ── */
  const isDirty = useMemo(() => {
    if (!savedDraft || !content) return false;
    return JSON.stringify(content) !== JSON.stringify(savedDraft);
  }, [content, savedDraft]);

  const hasUnpublishedChanges = useMemo(() => {
    if (!payload || !savedDraft) return false;
    return (
      JSON.stringify(savedDraft) !== JSON.stringify(payload.publishedContent)
    );
  }, [savedDraft, payload]);

  const status = useMemo(
    () => deriveStatus(hasUnpublishedChanges, payload?.publishedAt ?? null),
    [hasUnpublishedChanges, payload?.publishedAt]
  );

  const completionMap = useMemo(() => {
    if (!content || !registryItem) return {};
    return buildCompletionMap(
      content,
      registryItem.sections.map((s) => s.id)
    );
  }, [content, registryItem]);

  /* ── Data Fetching ── */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/content/${pageKey}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.status === 401) {
        setError("Please sign in as an Owner or Manager to edit website content.");
        setLoading(false);
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Unable to load page content.");
        setLoading(false);
        return;
      }
      const data: ContentPageData = json.data;
      setPayload(data);
      setContent(data.draftContent);
      setSavedDraft(data.draftContent);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }, [pageKey]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ── Actions ── */
  const saveDraft = useCallback(async () => {
    if (!payload || !content) return;
    setIsSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch(`/api/admin/content/${pageKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, version: payload.version }),
      });
      const json = await res.json();
      if (res.status === 409) {
        setError(
          "This content was updated by another administrator. Reload the latest version before saving your changes."
        );
        setIsSaving(false);
        return;
      }
      if (!res.ok) {
        setError(json.error ?? "Failed to save draft.");
        setIsSaving(false);
        return;
      }
      const verifyRes = await fetch(`/api/admin/content/${pageKey}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const verifyJson = await verifyRes.json();
      if (!verifyRes.ok || !verifyJson.success || JSON.stringify(verifyJson.data?.draftContent) !== JSON.stringify(content)) {
        setError("Your changes could not be verified after saving. Please reload and try again.");
        return;
      }
      await loadData();
      setMessage("Settings saved and verified.");
      setTimeout(() => setMessage(""), 4000);
    } catch {
      setError("Network error — unable to save.");
    } finally {
      setIsSaving(false);
    }
  }, [payload, content, pageKey, loadData]);

  const publish = useCallback(() => {
    setConfirmAction({
      title: "Publish Changes",
      description:
        "This will push your current draft live. Visitors will see the updated content immediately.",
      action: async () => {
        if (!payload) return;
        setConfirmAction(null);
        setIsSaving(true);
        setMessage("");
        setError("");
        try {
          const res = await fetch(`/api/admin/content/${pageKey}/publish`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ version: payload.version }),
          });
          const json = await res.json();
          if (res.status === 409) {
            setError(
              "This content was updated by another administrator. Reload the latest version before saving your changes."
            );
            return;
          }
          if (!res.ok) {
            setError(json.error ?? "Failed to publish.");
            return;
          }
          const verifyRes = await fetch(`/api/admin/content/${pageKey}`, {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache" },
          });
          const verifyJson = await verifyRes.json();
          if (!verifyRes.ok || !verifyJson.success || JSON.stringify(verifyJson.data?.draftContent) !== JSON.stringify(verifyJson.data?.publishedContent)) {
            setError("Your changes could not be verified after saving. Please reload and try again.");
            return;
          }
          await loadData();
          setMessage("Settings saved and verified.");
          setTimeout(() => setMessage(""), 4000);
        } catch {
          setError("Network error — unable to publish.");
        } finally {
          setIsSaving(false);
        }
      },
    });
  }, [payload, pageKey, loadData]);

  const discardDraft = useCallback(() => {
    setConfirmAction({
      title: "Discard Draft Changes",
      description:
        "This will revert your draft to match the currently published content. Any unsaved edits will be lost.",
      variant: "danger",
      action: async () => {
        setConfirmAction(null);
        setIsSaving(true);
        setMessage("");
        setError("");
        try {
          const res = await fetch(`/api/admin/content/${pageKey}/discard`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          const json = await res.json();
          if (!res.ok) {
            setError(json.error ?? "Failed to discard draft.");
            return;
          }
          await loadData();
          setMessage("Draft discarded — reverted to published content.");
          setTimeout(() => setMessage(""), 4000);
        } catch {
          setError("Network error — unable to discard.");
        } finally {
          setIsSaving(false);
        }
      },
    });
  }, [pageKey, loadData]);

  const restoreDefault = useCallback(() => {
    setConfirmAction({
      title: "Restore Default Content",
      description:
        "This will replace the draft with the original default content. Published content remains unchanged until you publish.",
      variant: "danger",
      action: async () => {
        setConfirmAction(null);
        setIsSaving(true);
        setMessage("");
        setError("");
        try {
          const res = await fetch(
            `/api/admin/content/${pageKey}/restore-default`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            }
          );
          const json = await res.json();
          if (!res.ok) {
            setError(json.error ?? "Failed to restore defaults.");
            return;
          }
          await loadData();
          setMessage("Draft restored to defaults.");
          setTimeout(() => setMessage(""), 4000);
        } catch {
          setError("Network error — unable to restore.");
        } finally {
          setIsSaving(false);
        }
      },
    });
  }, [pageKey, loadData]);

  /* ── Section content updater ── */
  const updateSection = useCallback(
    (sectionKey: string, sectionData: unknown) => {
      setContent((prev) =>
        prev ? { ...prev, [sectionKey]: sectionData } : prev
      );
    },
    []
  );

  /* ── Section renderer ── */
  function renderSectionEditor(sectionId: string, sectionLabel: string) {
    if (!content) return null;

    const sectionData = content[sectionId];
    const EditorComponent = getSectionEditor(pageKey as ContentPageKey, sectionId);

    const props: Record<string, any> = {
      data: sectionData ?? {},
      onChange: (updated: any) => updateSection(sectionId, updated),
    };

    if (sectionId === "seo") {
      props.scopeKey = registryItem?.seoScopeKey ?? pageKey;
      props.pageKey = pageKey;
    }

    return <EditorComponent {...props} />;
  }

  /* ── Loading state ── */
  if (loading && !content) {
    return <ContentEditorSkeleton />;
  }

  /* ── Error state (no content loaded) ── */
  if (!content || !registryItem) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center">
        <AlertTriangle size={24} className="mx-auto mb-3 text-red-400" />
        <p className="text-sm font-medium text-red-700">
          {error || "Unable to load page content."}
        </p>
        <button
          onClick={loadData}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[var(--admin-accent)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--admin-accent-hover)] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  /* ── Sections list from registry ── */
  const sections = registryItem.sections;

  /* ── Render ── */
  return (
    <>
      <ContentEditorUnsavedGuard isDirty={isDirty} />

      {/* Header */}
      <div className="mb-6">
      <ContentEditorHeader
          registryItem={registryItem}
          status={status}
          updatedAt={payload?.updatedAt ?? null}
          publishedAt={payload?.publishedAt ?? null}
          isDirty={isDirty}
        />
      </div>

      {/* Toasts */}
      <AnimatePresence>
        {message && (
          <div className="mb-4" key="success-toast">
            <Toast
              message={message}
              variant="success"
              onDismiss={() => setMessage("")}
            />
          </div>
        )}
        {error && (
          <div className="mb-4" key="error-toast">
            <Toast
              message={error}
              variant="error"
              onDismiss={() => setError("")}
              onAction={
                error.includes("updated by another administrator")
                  ? loadData
                  : undefined
              }
              actionLabel="Reload Latest Content"
            />
          </div>
        )}
      </AnimatePresence>

      {/* 3-Column Layout */}
      <ContentEditorLayout
        sectionNav={
          <ContentEditorSectionNav
            sections={sections}
            activeKey={activeSection}
            onSelect={setActiveSection}
            completionMap={completionMap}
          />
        }
        statusPanel={
          <ContentEditorSidebar
            status={status}
            version={payload?.version ?? 1}
            updatedAt={payload?.updatedAt ?? null}
            publishedAt={payload?.publishedAt ?? null}
            isDirty={isDirty}
            hasUnpublishedChanges={hasUnpublishedChanges}
            isSaving={isSaving}
            onSave={saveDraft}
            onPublish={publish}
            onDiscard={discardDraft}
            onRestore={restoreDefault}
          />
        }
      >
        {/* Section editors */}
        <div className="space-y-5">
          {sections.map((section) => (
            <div
              key={section.id}
              style={{
                display: section.id === activeSection ? "block" : "none",
              }}
            >
              {section.id === activeSection && (
                <ContentEditorSection
                  id={section.id}
                  title={section.label}
                  description={section.description}
                >
                  {renderSectionEditor(section.id, section.label)}
                </ContentEditorSection>
              )}
            </div>
          ))}
        </div>
      </ContentEditorLayout>

      {/* Confirm Dialog */}
      <AdminConfirmDialog
        open={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => confirmAction?.action()}
        title={confirmAction?.title ?? ""}
        description={confirmAction?.description ?? ""}
        variant={confirmAction?.variant ?? "default"}
      />

      {pageKey === "gallery" && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800">
          Gallery images, categories and collections are managed in Gallery Manager. This page controls only page copy, SEO and section headings.
        </div>
      )}
    </>
  );
}

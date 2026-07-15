"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Folder,
  Copy,
  Trash2,
  ExternalLink,
  Check,
  Save,
  Clock,
  HardDrive,
  FileImage,
} from "lucide-react";
import { MediaDeleteDialog } from "./MediaDeleteDialog";
import type { MediaAssetDto } from "@/lib/media/media-asset.dto";

interface MediaFolder {
  id: string;
  name: string;
  slug: string;
}

interface MediaDetailsPanelProps {
  asset: MediaAssetDto | null;
  onUpdate: (id: string, data: Record<string, unknown>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  folders?: MediaFolder[];
}

function formatSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MediaDetailsPanel({
  asset,
  onUpdate,
  onDelete,
  folders = [],
}: MediaDetailsPanelProps) {
  const [alt, setAlt] = useState("");
  const [title, setTitle] = useState("");
  const [folder, setFolder] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (asset) {
      setAlt(asset.alt || "");
      setTitle(asset.title || "");
      setFolder(asset.folder || "");
    }
  }, [asset]);

  if (!asset) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[var(--admin-border)]/50 shadow-luxury sticky top-6">
        <h3 className="font-heading text-sm text-[var(--admin-ink)] mb-4 border-b border-[var(--admin-border)]/40 pb-3 flex items-center gap-1.5">
          <Folder size={16} className="text-[var(--admin-accent)]" />
          Asset Details
        </h3>
        <p className="text-xs text-[var(--admin-muted)] italic py-8 text-center">
          Select an asset to view its properties.
        </p>
      </div>
    );
  }

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(asset.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(asset.id, { alt, title, folder });
    setSaving(false);
  };

  const handleDelete = async () => {
    await onDelete(asset.id);
    setShowDeleteDialog(false);
  };

  const hasChanges =
    alt !== (asset.alt || "") ||
    title !== (asset.title || "") ||
    folder !== (asset.folder || "");

  return (
    <>
      <div className="bg-white rounded-2xl p-5 border border-[var(--admin-border)]/50 shadow-luxury sticky top-6">
        <h3 className="font-heading text-sm text-[var(--admin-ink)] mb-4 border-b border-[var(--admin-border)]/40 pb-3 flex items-center gap-1.5">
          <Folder size={16} className="text-[var(--admin-accent)]" />
          Asset Details
        </h3>

        {/* Preview */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] mb-4">
          <Image
            src={asset.url}
            alt={asset.alt || asset.fileName}
            fill
            className="object-contain"
          />
        </div>

        {/* Metadata */}
        <div className="space-y-3 text-xs">
          {/* Filename */}
          <div>
            <span className="text-[10px] text-[var(--admin-muted)] uppercase font-semibold block mb-0.5">
              File Name
            </span>
            <p className="font-medium text-[var(--admin-ink)] break-all">
              {asset.originalName || asset.fileName}
            </p>
          </div>

          {/* URL with copy */}
          <div>
            <span className="text-[10px] text-[var(--admin-muted)] uppercase font-semibold block mb-0.5">
              URL
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                readOnly
                value={asset.url}
                className="flex-grow rounded-lg border border-[var(--admin-border-strong)] px-2.5 py-1.5 text-[10px] bg-gray-50 text-[var(--admin-ink)] truncate outline-none"
              />
              <button
                onClick={handleCopyUrl}
                className="p-1.5 border border-[var(--admin-border-strong)] rounded-lg bg-white text-[var(--admin-muted)] hover:text-[var(--admin-accent)] hover:border-[var(--admin-accent)] transition-colors cursor-pointer"
                title="Copy URL"
              >
                {copied ? (
                  <Check size={12} className="text-green-500" />
                ) : (
                  <Copy size={12} />
                )}
              </button>
              <a
                href={asset.url}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 border border-[var(--admin-border-strong)] rounded-lg bg-white text-[var(--admin-muted)] hover:text-[var(--admin-accent)] hover:border-[var(--admin-accent)] transition-colors"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-1.5">
              <FileImage size={12} className="text-[var(--admin-accent)]" />
              <div>
                <span className="text-[10px] text-[var(--admin-muted)] block">
                  Dimensions
                </span>
                <span className="text-[var(--admin-ink)] font-medium">
                  {asset.width && asset.height
                    ? `${asset.width}×${asset.height}`
                    : "—"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <HardDrive size={12} className="text-[var(--admin-accent)]" />
              <div>
                <span className="text-[10px] text-[var(--admin-muted)] block">Size</span>
                <span className="text-[var(--admin-ink)] font-medium">
                  {formatSize(asset.size)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <FileImage size={12} className="text-[var(--admin-accent)]" />
              <div>
                <span className="text-[10px] text-[var(--admin-muted)] block">Type</span>
                <span className="text-[var(--admin-ink)] font-medium">
                  {asset.mimeType || "—"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-[var(--admin-accent)]" />
              <div>
                <span className="text-[10px] text-[var(--admin-muted)] block">
                  Uploaded
                </span>
                <span className="text-[var(--admin-ink)] font-medium">
                  {formatDate(asset.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Editable fields */}
          <div className="border-t border-[var(--admin-border)] pt-3 space-y-3">
            <div>
              <label className="text-[10px] text-[var(--admin-muted)] uppercase font-semibold block mb-1">
                Alt Text
              </label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Describe this image..."
                className="w-full rounded-lg border border-[var(--admin-border-strong)] px-3 py-2 text-xs outline-none focus:border-[var(--admin-accent)] bg-white transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] text-[var(--admin-muted)] uppercase font-semibold block mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Image title..."
                className="w-full rounded-lg border border-[var(--admin-border-strong)] px-3 py-2 text-xs outline-none focus:border-[var(--admin-accent)] bg-white transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] text-[var(--admin-muted)] uppercase font-semibold block mb-1">
                Folder
              </label>
              {folders.length > 0 ? (
                <select
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                  className="w-full rounded-lg border border-[var(--admin-border-strong)] px-3 py-2 text-xs outline-none focus:border-[var(--admin-accent)] bg-white transition-colors"
                >
                  <option value="">No folder</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.slug}>
                      {f.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                  placeholder="e.g. uploads"
                  className="w-full rounded-lg border border-[var(--admin-border-strong)] px-3 py-2 text-xs outline-none focus:border-[var(--admin-accent)] bg-white transition-colors"
                />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-[var(--admin-border)] pt-3 flex items-center gap-2">
            {hasChanges && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] text-white text-xs font-bold px-4 py-2 rounded-full cursor-pointer border-none shadow-sm transition-colors disabled:opacity-50"
              >
                <Save size={12} />
                {saving ? "Saving..." : "Save"}
              </button>
            )}
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-1.5 bg-transparent hover:bg-rose-50 text-[var(--admin-muted)] hover:text-rose-600 border border-transparent hover:border-rose-200 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ml-auto"
            >
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        </div>
      </div>

      <MediaDeleteDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        assetName={asset.originalName || asset.fileName}
      />
    </>
  );
}

export default MediaDetailsPanel;

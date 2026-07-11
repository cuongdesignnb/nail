"use client";

import React, { useState } from "react";
import { ImagePlus, Replace, X } from "lucide-react";
import { MediaPickerDialog } from "./MediaPickerDialog";
import type { MediaReference } from "@/lib/media/media.types";
import {
  mediaAssetToPickerValue,
  mediaAssetToReference,
  type MediaPickerValueMode,
} from "@/lib/media/media-picker-value";

interface MediaAsset {
  id: string;
  fileName: string;
  originalName: string | null;
  url: string;
  mimeType: string | null;
  size: number | null;
  width: number | null;
  height: number | null;
  alt: string | null;
  title: string | null;
  folder: string | null;
  createdAt: string;
}

interface MediaPickerFieldProps {
  label: string;
  value: string | MediaReference | null;
  alt?: string;
  onChange: (value: any) => void;
  onAltChange?: (alt: string) => void;
  folder?: string;
  aspectRatio?: string;
  multiple?: boolean;
  required?: boolean;
  allowRemove?: boolean;
  allowAltOverride?: boolean;
  valueMode?: MediaPickerValueMode;
}

export function MediaPickerField({
  label,
  value,
  alt = "",
  onChange,
  onAltChange,
  folder,
  aspectRatio = "16/10",
  multiple = false,
  required = false,
  allowRemove = true,
  allowAltOverride = true,
  valueMode = "url",
}: MediaPickerFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const isMediaReference = typeof value === "object" && value !== null;
  const mediaValue = isMediaReference ? value : null;
  const src = mediaValue?.src ?? (typeof value === "string" ? value : "");
  const effectiveAlt = mediaValue?.alt ?? alt ?? "";

  const handleSelect = (asset: MediaAsset | MediaAsset[]) => {
    const selected = Array.isArray(asset) ? asset[0] : asset;
    if (!selected) return;
    const reference = mediaAssetToReference(selected, effectiveAlt);
    onChange(mediaAssetToPickerValue(selected, valueMode, effectiveAlt));
    if (onAltChange && reference.alt) {
      onAltChange(reference.alt);
    }
  };

  const handleRemove = () => {
    onChange(valueMode === "reference" ? null : "");
    if (onAltChange) onAltChange("");
  };

  const handleAltChange = (nextAlt: string) => {
    if (isMediaReference && mediaValue) {
      onChange({ ...mediaValue, alt: nextAlt });
    }
    if (onAltChange) onAltChange(nextAlt);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold text-[var(--admin-ink)] uppercase tracking-wide block">
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>

      {src ? (
        <div className="space-y-2">
          {/* Preview */}
          <div
            className="relative rounded-xl overflow-hidden border border-[var(--admin-border)]/40 bg-[var(--admin-surface-muted)] group cursor-pointer"
            style={{ aspectRatio }}
            onClick={() => setPickerOpen(true)}
          >
            <img
              src={src}
              alt={effectiveAlt || "Selected image"}
              className="w-full h-full object-cover"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span className="bg-white/90 text-[var(--admin-ink)] text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                <Replace size={11} /> Replace
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="text-[11px] text-[var(--admin-accent)] hover:text-[var(--admin-accent)]Hover font-medium transition-colors cursor-pointer"
            >
              Change
            </button>
            {allowRemove && (
              <button
                type="button"
                onClick={handleRemove}
                className="text-[11px] text-[var(--admin-muted)] hover:text-rose-500 font-medium transition-colors cursor-pointer flex items-center gap-0.5"
              >
                <X size={11} /> Remove
              </button>
            )}
          </div>

          {/* Alt text input */}
          {allowAltOverride && (onAltChange || isMediaReference) && (
            <div>
              <label className="text-[10px] text-[var(--admin-muted)] block mb-1">
                Alt Text
              </label>
              <input
                type="text"
                value={effectiveAlt}
                onChange={(e) => handleAltChange(e.target.value)}
                placeholder="Describe this image..."
                className="w-full rounded-lg border border-[var(--admin-border-strong)] px-3 py-1.5 text-xs outline-none focus:border-[var(--admin-accent)] bg-white transition-colors"
              />
            </div>
          )}
        </div>
      ) : (
        /* Empty state - click to open picker */
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="w-full rounded-xl border-2 border-dashed border-[var(--admin-border-strong)] hover:border-[var(--admin-accent)]/40 bg-[var(--admin-surface-muted)] hover:bg-[var(--admin-surface-hover)]/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 py-8"
          style={{ aspectRatio }}
        >
          <ImagePlus size={24} className="text-[var(--admin-placeholder)]" />
          <span className="text-[11px] text-[var(--admin-muted)] font-medium">
            Click to select image
          </span>
        </button>
      )}

      <MediaPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelect}
        folder={folder}
        multiple={multiple}
        title={`Select ${label}`}
      />
    </div>
  );
}

export default MediaPickerField;

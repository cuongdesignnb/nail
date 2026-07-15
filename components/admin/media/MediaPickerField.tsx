"use client";

import { useState } from "react";
import { ImagePlus, Replace, X } from "lucide-react";
import { MediaPickerDialog } from "./MediaPickerDialog";
import type { MediaReference } from "@/lib/media/media.types";
import type { MediaAssetDto } from "@/lib/media/media-asset.dto";
import { mediaAssetToReference } from "@/lib/media/media-picker-value";

type CommonPickerProps = {
  label: string;
  folder?: string;
  aspectRatio?: string;
  required?: boolean;
  allowRemove?: boolean;
  allowAltOverride?: boolean;
};

type ReferencePickerProps = CommonPickerProps & {
  valueMode: "reference";
  value: MediaReference | null;
  onChange: (value: MediaReference | null) => void;
};

type UrlPickerProps = CommonPickerProps & {
  valueMode: "url";
  value: string | null;
  onChange: (value: string | null) => void;
  alt?: string;
  onAltChange?: (alt: string) => void;
};

export type MediaPickerFieldProps = ReferencePickerProps | UrlPickerProps;

export function MediaPickerField(props: MediaPickerFieldProps) {
  const {
    label,
    folder,
    aspectRatio = "16/10",
    required = false,
    allowRemove = true,
    allowAltOverride = true,
  } = props;
  const alt = props.valueMode === "url" ? props.alt ?? "" : "";
  const onAltChange = props.valueMode === "url" ? props.onAltChange : undefined;
  const [pickerOpen, setPickerOpen] = useState(false);
  const mediaValue = props.valueMode === "reference" ? props.value : null;
  const src = props.valueMode === "reference" ? props.value?.src || "" : props.value || "";
  const effectiveAlt = mediaValue?.alt ?? alt;

  const handleSelect = (asset: MediaAssetDto | MediaAssetDto[]) => {
    const selected = Array.isArray(asset) ? asset[0] : asset;
    if (!selected) return;
    const reference = mediaAssetToReference(selected, effectiveAlt);
    if (props.valueMode === "reference") {
      props.onChange(reference);
    } else {
      props.onChange(reference.src);
      if (onAltChange && reference.alt) onAltChange(reference.alt);
    }
  };

  const handleRemove = () => {
    props.onChange(null);
    if (props.valueMode === "url" && onAltChange) onAltChange("");
  };

  const handleAltChange = (nextAlt: string) => {
    if (props.valueMode === "reference" && props.value) {
      props.onChange({ ...props.value, alt: nextAlt });
    } else if (props.valueMode === "url" && onAltChange) {
      onAltChange(nextAlt);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold text-[var(--admin-ink)] uppercase tracking-wide block">
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>

      {src ? (
        <div className="space-y-2">
          <button
            type="button"
            className="relative block w-full rounded-xl overflow-hidden border border-[var(--admin-border)]/40 bg-[var(--admin-surface-muted)] group cursor-pointer"
            style={{ aspectRatio }}
            onClick={() => setPickerOpen(true)}
          >
            <img src={src} alt={effectiveAlt || "Selected image"} className="w-full h-full object-cover" />
            <span className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span className="bg-white/90 text-[var(--admin-ink)] text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                <Replace size={11} /> Replace
              </span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPickerOpen(true)} className="text-[11px] text-[var(--admin-accent)] font-medium">
              Change
            </button>
            {allowRemove && (
              <button type="button" onClick={handleRemove} className="text-[11px] text-[var(--admin-muted)] hover:text-rose-500 font-medium flex items-center gap-0.5">
                <X size={11} /> Remove
              </button>
            )}
          </div>

          {allowAltOverride && (onAltChange || props.valueMode === "reference") && (
            <div>
              <label className="text-[10px] text-[var(--admin-muted)] block mb-1">Alt Text</label>
              <input
                type="text"
                value={effectiveAlt}
                onChange={(event) => handleAltChange(event.target.value)}
                placeholder="Describe this image..."
                className="w-full rounded-lg border border-[var(--admin-border-strong)] px-3 py-1.5 text-xs outline-none focus:border-[var(--admin-accent)] bg-white transition-colors"
              />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="w-full rounded-xl border-2 border-dashed border-[var(--admin-border-strong)] hover:border-[var(--admin-accent)]/40 bg-[var(--admin-surface-muted)] hover:bg-[var(--admin-surface-hover)]/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 py-8"
          style={{ aspectRatio }}
        >
          <ImagePlus size={24} className="text-[var(--admin-placeholder)]" />
          <span className="text-[11px] text-[var(--admin-muted)] font-medium">Select Image</span>
        </button>
      )}

      <MediaPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelect}
        folder={folder}
        applyUploadedAssetImmediately
        title={`Select ${label}`}
      />
    </div>
  );
}

export default MediaPickerField;

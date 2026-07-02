"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImagePlus, Replace, X } from "lucide-react";
import { MediaPickerDialog } from "./MediaPickerDialog";

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
  value: string;
  alt?: string;
  onChange: (url: string) => void;
  onAltChange?: (alt: string) => void;
  folder?: string;
  aspectRatio?: string;
  multiple?: boolean;
  required?: boolean;
}

export function MediaPickerField({
  label,
  value,
  alt = "",
  onChange,
  onAltChange,
  folder,
  aspectRatio = "16/10",
  required = false,
}: MediaPickerFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleSelect = (asset: MediaAsset | MediaAsset[]) => {
    if (Array.isArray(asset)) {
      if (asset.length > 0) {
        onChange(asset[0].url);
        if (onAltChange && asset[0].alt) {
          onAltChange(asset[0].alt);
        }
      }
    } else {
      onChange(asset.url);
      if (onAltChange && asset.alt) {
        onAltChange(asset.alt);
      }
    }
  };

  const handleRemove = () => {
    onChange("");
    if (onAltChange) onAltChange("");
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold text-aera-ink uppercase tracking-wide block">
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>

      {value ? (
        <div className="space-y-2">
          {/* Preview */}
          <div
            className="relative rounded-xl overflow-hidden border border-aera-champagne/40 bg-aera-cream/20 group cursor-pointer"
            style={{ aspectRatio }}
            onClick={() => setPickerOpen(true)}
          >
            <Image
              src={value}
              alt={alt || "Selected image"}
              fill
              className="object-cover"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span className="bg-white/90 text-aera-ink text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                <Replace size={11} /> Replace
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="text-[11px] text-aera-accent hover:text-aera-accentHover font-medium transition-colors cursor-pointer"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="text-[11px] text-aera-muted hover:text-rose-500 font-medium transition-colors cursor-pointer flex items-center gap-0.5"
            >
              <X size={11} /> Remove
            </button>
          </div>

          {/* Alt text input */}
          {onAltChange && (
            <div>
              <label className="text-[10px] text-aera-muted block mb-1">
                Alt Text
              </label>
              <input
                type="text"
                value={alt}
                onChange={(e) => onAltChange(e.target.value)}
                placeholder="Describe this image..."
                className="w-full rounded-lg border border-aera-champagne/60 px-3 py-1.5 text-xs outline-none focus:border-aera-accent bg-white transition-colors"
              />
            </div>
          )}
        </div>
      ) : (
        /* Empty state - click to open picker */
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="w-full rounded-xl border-2 border-dashed border-aera-champagne/60 hover:border-aera-accent/40 bg-aera-cream/10 hover:bg-aera-cream/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 py-8"
          style={{ aspectRatio }}
        >
          <ImagePlus size={24} className="text-aera-muted/50" />
          <span className="text-[11px] text-aera-muted font-medium">
            Click to select image
          </span>
        </button>
      )}

      <MediaPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelect}
        folder={folder}
        title={`Select ${label}`}
      />
    </div>
  );
}

export default MediaPickerField;

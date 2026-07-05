"use client";

import Image from "next/image";
import { ImagePlus, MoveDown, MoveUp, Trash2 } from "lucide-react";
import { useState } from "react";

import { MediaPickerDialog } from "./MediaPickerDialog";
import type { MediaReference } from "@/lib/media/media.types";
import { asArray } from "@/lib/utils/array";

type MediaAsset = {
  id: string;
  fileName: string;
  originalName: string | null;
  url: string;
  alt: string | null;
  title: string | null;
};

type MediaGalleryPickerFieldProps = {
  label: string;
  value: MediaReference[];
  onChange: (items: MediaReference[]) => void;
  folder?: string;
  minItems?: number;
  maxItems?: number;
  aspectRatio?: string;
};

function toReference(asset: MediaAsset): MediaReference {
  return {
    mediaId: asset.id,
    src: asset.url,
    alt: asset.alt || asset.title || asset.originalName || asset.fileName,
    title: asset.title || asset.originalName || asset.fileName,
  };
}

export function MediaGalleryPickerField({
  label,
  value,
  onChange,
  folder,
  maxItems,
  aspectRatio = "4/3",
}: MediaGalleryPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const items = asArray<MediaReference>(value);

  const move = (index: number, direction: -1 | 1) => {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleSelect = (selected: MediaAsset | MediaAsset[]) => {
    const additions = asArray<MediaAsset>(Array.isArray(selected) ? selected : [selected]).map(toReference);
    const next = [...items, ...additions];
    onChange(maxItems ? next.slice(0, maxItems) : next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="text-[11px] font-semibold text-aera-ink uppercase tracking-wide">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={Boolean(maxItems && items.length >= maxItems)}
          className="inline-flex items-center gap-1.5 rounded-full bg-aera-accent px-4 py-2 text-[11px] font-bold text-white transition hover:bg-aera-accentHover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ImagePlus size={13} />
          Add Images
        </button>
      </div>

      {items.length === 0 ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-aera-champagne/60 bg-aera-cream/10 py-8 text-aera-muted transition hover:border-aera-accent/40 hover:bg-aera-cream/30"
        >
          <ImagePlus size={24} className="opacity-50" />
          <span className="text-[11px] font-medium">No images selected yet.</span>
        </button>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div key={`${item.mediaId ?? item.src}-${index}`} className="rounded-xl border border-aera-champagne/40 bg-white p-2">
              <div className="relative overflow-hidden rounded-lg bg-aera-cream" style={{ aspectRatio }}>
                <Image src={item.src} alt={item.alt || label} fill sizes="240px" className="object-cover" />
              </div>
              <input
                value={item.alt}
                onChange={(event) => {
                  const next = [...items];
                  next[index] = { ...item, alt: event.target.value };
                  onChange(next);
                }}
                placeholder="Alt text"
                className="mt-2 w-full rounded-lg border border-aera-champagne/60 px-3 py-1.5 text-xs outline-none focus:border-aera-accent"
              />
              <div className="mt-2 flex items-center justify-end gap-1">
                <button type="button" onClick={() => move(index, -1)} className="rounded-lg p-1.5 text-aera-muted hover:bg-aera-cream">
                  <MoveUp size={13} />
                </button>
                <button type="button" onClick={() => move(index, 1)} className="rounded-lg p-1.5 text-aera-muted hover:bg-aera-cream">
                  <MoveDown size={13} />
                </button>
                <button type="button" onClick={() => remove(index)} className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <MediaPickerDialog
        open={open}
        onClose={() => setOpen(false)}
        onSelect={handleSelect}
        folder={folder}
        multiple
        title={`Select ${label}`}
      />
    </div>
  );
}

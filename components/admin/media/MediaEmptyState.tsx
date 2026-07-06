"use client";

import React from "react";
import { ImagePlus } from "lucide-react";

export function MediaEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--admin-surface-muted)] flex items-center justify-center mb-4">
        <ImagePlus size={28} className="text-[var(--admin-accent)]/60" />
      </div>
      <h3 className="text-sm font-heading font-semibold text-[var(--admin-ink)] mb-1">
        No media assets yet
      </h3>
      <p className="text-xs text-[var(--admin-muted)] max-w-xs">
        Drag & drop images above or click to browse and upload your first
        images to the media library.
      </p>
    </div>
  );
}

export default MediaEmptyState;

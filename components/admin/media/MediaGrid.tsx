"use client";

import React from "react";
import { MediaCard } from "./MediaCard";

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

interface MediaGridProps {
  items: MediaAsset[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  multiSelect?: boolean;
  selectedIds?: string[];
}

export function MediaGrid({
  items,
  selectedId,
  onSelect,
  multiSelect = false,
  selectedIds = [],
}: MediaGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {items.map((asset) => (
        <MediaCard
          key={asset.id}
          asset={asset}
          selected={
            multiSelect
              ? selectedIds.includes(asset.id)
              : selectedId === asset.id
          }
          onSelect={() => onSelect(asset.id)}
        />
      ))}
    </div>
  );
}

export default MediaGrid;

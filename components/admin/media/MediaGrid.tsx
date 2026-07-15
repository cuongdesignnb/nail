"use client";

import React from "react";
import { MediaCard } from "./MediaCard";
import type { MediaAssetDto } from "@/lib/media/media-asset.dto";

interface MediaGridProps {
  items: MediaAssetDto[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  multiSelect?: boolean;
  selectedIds?: string[];
  storageStatuses?: Record<string, "uploaded" | "missing-file" | "failed">;
}

export function MediaGrid({
  items,
  selectedId,
  onSelect,
  multiSelect = false,
  selectedIds = [],
  storageStatuses = {},
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
          storageStatus={storageStatuses[asset.id]}
        />
      ))}
    </div>
  );
}

export default MediaGrid;

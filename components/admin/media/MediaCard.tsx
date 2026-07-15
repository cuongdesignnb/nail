"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import type { MediaAssetDto } from "@/lib/media/media-asset.dto";

interface MediaCardProps {
  asset: MediaAssetDto;
  selected: boolean;
  onSelect: () => void;
  storageStatus?: "uploaded" | "missing-file" | "failed";
}

function formatSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function MediaCard({ asset, selected, onSelect, storageStatus }: MediaCardProps) {
  const [broken, setBroken] = useState(false);
  const statusLabel = broken
    ? "Broken URL"
    : storageStatus === "missing-file"
      ? "Missing file"
      : storageStatus === "failed"
        ? "Failed"
        : "Uploaded";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      onClick={onSelect}
      className={`group relative aspect-square rounded-2xl overflow-hidden border cursor-pointer bg-white shadow-sm hover:shadow-md transition-all duration-200 ${
        selected
          ? "border-[var(--admin-accent)] ring-2 ring-[var(--admin-accent)]/30"
          : "border-[var(--admin-border)]/50 hover:border-[var(--admin-accent)]/40"
      }`}
    >
      {/* Image */}
      <div className="relative w-full h-full">
        {!broken && <Image
          src={asset.url}
          alt={asset.alt || asset.fileName}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setBroken(true)}
        />}
        {broken && <div className="flex h-full items-center justify-center bg-rose-50 px-3 text-center text-[10px] font-semibold text-rose-700">Image could not be loaded</div>}
      </div>

      <span className={`absolute left-2 top-2 z-10 rounded-full px-2 py-1 text-[8px] font-bold ${statusLabel === "Uploaded" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{statusLabel}</span>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <p className="text-[10px] text-white truncate font-medium">
            {asset.originalName || asset.fileName}
          </p>
          <div className="flex items-center gap-2 text-[9px] text-white/70">
            {asset.width && asset.height && (
              <span>
                {asset.width}×{asset.height}
              </span>
            )}
            {asset.size && <span>{formatSize(asset.size)}</span>}
          </div>
        </div>
      </div>

      {/* Selected checkmark */}
      {selected && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 bg-[var(--admin-accent)] text-white p-1 rounded-full z-10 shadow-lg"
        >
          <Check size={10} strokeWidth={3} />
        </motion.span>
      )}
    </motion.div>
  );
}

export default MediaCard;

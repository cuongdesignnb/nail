"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Search, Upload, Check, ImagePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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

interface MediaPickerDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAsset | MediaAsset[]) => void;
  multiple?: boolean;
  folder?: string;
  title?: string;
}

export function MediaPickerDialog({
  open,
  onClose,
  onSelect,
  multiple = false,
  folder: defaultFolder,
  title = "Select Image",
}: MediaPickerDialogProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (defaultFolder) params.set("folder", defaultFolder);
      params.set("pageSize", "60");
      params.set("sort", "newest");

      const res = await fetch(`/api/admin/media?${params.toString()}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        setAssets([]);
        setError(json?.error || json?.message || "Unable to load media assets.");
        return;
      }
      const items = Array.isArray(json?.data?.items) ? json.data.items : [];
      setAssets(items);
    } catch (err) {
      console.error("Failed to fetch media:", err);
      setAssets([]);
      setError("A connection error occurred while loading media.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, defaultFolder]);

  useEffect(() => {
    if (open) {
      fetchAssets();
      setSelectedIds(new Set());
    }
  }, [open, fetchAssets]);

  const toggleSelect = (id: string) => {
    if (multiple) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    } else {
      setSelectedIds(new Set([id]));
    }
  };

  const handleConfirm = () => {
    const selected = assets.filter((a) => selectedIds.has(a.id));
    if (selected.length === 0) return;
    if (multiple) {
      onSelect(selected);
    } else {
      onSelect(selected[0]);
    }
    onClose();
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (defaultFolder) formData.append("folder", defaultFolder);

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json().catch(() => ({}));
      const uploaded = json?.data;
      if (!res.ok || json?.success === false) {
        setError(json?.error || json?.message || "Upload failed.");
        return;
      }
      if (!uploaded?.id || !uploaded?.url) {
        setError("Upload completed but returned an invalid media payload.");
        return;
      }
      setAssets((prev) => [uploaded, ...prev]);
      setSelectedIds(new Set([uploaded.id]));
    } catch (err) {
      console.error("Upload failed:", err);
      setError("A connection error occurred while uploading.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white rounded-2xl shadow-luxury border border-aera-champagne/50 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-aera-champagne/40">
              <h2 className="font-heading text-lg font-semibold text-aera-ink">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-aera-muted hover:text-aera-ink hover:bg-aera-champagne/20 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3 px-6 py-3 border-b border-aera-champagne/20 bg-aera-cream/20">
              <div className="relative flex-grow">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-aera-muted/60"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search images..."
                  className="w-full rounded-lg border border-aera-champagne/60 pl-9 pr-3 py-2 text-xs outline-none focus:border-aera-accent bg-white transition-colors"
                />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-aera-accent hover:bg-aera-accentHover text-white rounded-full transition-colors cursor-pointer border-none shadow-sm disabled:opacity-50"
              >
                <Upload size={13} />
                {uploading ? "Uploading..." : "Upload"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={(e) =>
                  e.target.files?.[0] && uploadFile(e.target.files[0])
                }
                className="hidden"
              />
            </div>

            {/* Grid */}
            <div
              className="flex-grow overflow-y-auto p-6"
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
            >
              {isDragging && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-aera-accent/10 border-2 border-dashed border-aera-accent rounded-2xl m-6">
                  <div className="text-center">
                    <Upload size={32} className="mx-auto text-aera-accent mb-2" />
                    <p className="text-sm font-medium text-aera-accent">
                      Drop to upload
                    </p>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin h-6 w-6 border-2 border-aera-accent border-t-transparent rounded-full" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                  <p className="text-xs font-semibold text-rose-600">{error}</p>
                  <button
                    type="button"
                    onClick={fetchAssets}
                    className="rounded-full bg-aera-accent px-4 py-2 text-xs font-bold text-white transition hover:bg-aera-accentHover"
                  >
                    Retry
                  </button>
                </div>
              ) : assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ImagePlus
                    size={32}
                    className="text-aera-muted/40 mb-3"
                  />
                  <p className="text-xs text-aera-muted">
                    No images found. Upload one to get started.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {assets.map((asset) => {
                    const isSelected = selectedIds.has(asset.id);
                    return (
                      <div
                        key={asset.id}
                        onClick={() => toggleSelect(asset.id)}
                        className={`group relative aspect-square rounded-xl overflow-hidden border cursor-pointer bg-white transition-all duration-200 ${
                          isSelected
                            ? "border-aera-accent ring-2 ring-aera-accent/30"
                            : "border-aera-champagne/50 hover:border-aera-accent/40"
                        }`}
                      >
                        <Image
                          src={asset.url}
                          alt={asset.alt || asset.fileName}
                          fill
                          sizes="150px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Bottom overlay */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[9px] text-white truncate">
                            {asset.originalName || asset.fileName}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 bg-aera-accent text-white p-0.5 rounded-full shadow">
                            <Check size={10} strokeWidth={3} />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-aera-champagne/40 bg-white">
              <p className="text-xs text-aera-muted">
                {selectedIds.size > 0
                  ? `${selectedIds.size} ${selectedIds.size === 1 ? "image" : "images"} selected`
                  : "No image selected"}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-aera-ink bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={selectedIds.size === 0}
                  className="px-5 py-2 text-xs font-bold bg-aera-accent hover:bg-aera-accentHover text-white rounded-full transition-colors cursor-pointer border-none shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {multiple ? "Select Images" : "Select Image"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default MediaPickerDialog;

"use client";

import React, { useState, useRef, useCallback } from "react";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MediaAssetDto } from "@/lib/media/media-asset.dto";

interface MediaUploadDropzoneProps {
  onUploadComplete: (asset: MediaAssetDto) => void;
  folder?: string;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
}

export function MediaUploadDropzone({
  onUploadComplete,
  folder = "uploads",
}: MediaUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      const id = crypto.randomUUID();

      setFiles((prev) => [
        ...prev,
        { id, file, progress: 0, status: "uploading" },
      ]);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch("/api/admin/media/upload", {
          method: "POST",
          body: formData,
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) throw new Error(json.detail || json.error || "Upload failed");
        const uploaded = json?.data as MediaAssetDto | undefined;
        if (!uploaded?.id || !uploaded.url || !uploaded.storageKey) throw new Error("Upload returned an invalid media asset.");

        setFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, progress: 100, status: "done" } : f
          )
        );
        onUploadComplete(uploaded);
      } catch (err) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id
              ? {
                  ...f,
                  status: "error",
                  error: err instanceof Error ? err.message : "Upload failed",
                }
              : f
          )
        );
      }
    },
    [folder, onUploadComplete]
  );

  const handleFiles = useCallback(
    (fileList: FileList) => {
      Array.from(fileList).forEach((file) => uploadFile(file));
    },
    [uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="mb-6">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-[var(--admin-accent)] bg-[var(--admin-accent)]/5 scale-[1.01]"
            : "border-[var(--admin-border-strong)] bg-white hover:border-[var(--admin-accent)]/40 hover:bg-[var(--admin-surface-hover)]/30"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.currentTarget.value = ""; }}
          className="hidden"
        />
        <Upload
          size={28}
          className={`mx-auto mb-3 transition-colors ${
            isDragging ? "text-[var(--admin-accent)]" : "text-[var(--admin-placeholder)]"
          }`}
        />
        <p className="text-sm font-medium text-[var(--admin-ink)]">
          {isDragging ? "Drop files here" : "Drag & drop images here"}
        </p>
        <p className="text-[11px] text-[var(--admin-muted)] mt-1">
          or click to browse · JPEG, PNG, WebP, AVIF · Max 10MB
        </p>
      </div>

      {/* Upload progress list */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-2"
          >
            {files.map((f) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-2.5 border border-[var(--admin-border)]/40 shadow-sm"
              >
                {f.status === "uploading" && (
                  <div className="animate-spin h-4 w-4 border-2 border-[var(--admin-accent)] border-t-transparent rounded-full flex-shrink-0" />
                )}
                {f.status === "done" && (
                  <CheckCircle
                    size={16}
                    className="text-green-500 flex-shrink-0"
                  />
                )}
                {f.status === "error" && (
                  <AlertCircle
                    size={16}
                    className="text-rose-500 flex-shrink-0"
                  />
                )}
                <div className="flex-grow min-w-0">
                  <p className="text-xs text-[var(--admin-ink)] truncate font-medium">
                    {f.file.name}
                  </p>
                  {f.error && (
                    <p className="text-[10px] text-rose-500">{f.error}</p>
                  )}
                </div>
                <button
                  onClick={() => removeFile(f.id)}
                  className="text-[var(--admin-muted)] hover:text-[var(--admin-ink)] transition-colors p-1 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MediaUploadDropzone;

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ExternalLink, ImagePlus, RefreshCw, Search, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { MediaAssetDto } from "@/lib/media/media-asset.dto";
import { MEDIA_FOLDERS } from "@/lib/media/media-folders";

type MediaPickerDialogProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAssetDto | MediaAssetDto[]) => void;
  multiple?: boolean;
  folder?: string;
  title?: string;
  applyUploadedAssetImmediately?: boolean;
};

const FOLDER_OPTIONS = Array.from(new Set(Object.values(MEDIA_FOLDERS)));

function mergeAssets(primary: MediaAssetDto[], secondary: MediaAssetDto[]) {
  const seen = new Set<string>();
  return [...primary, ...secondary].filter((asset) => {
    if (seen.has(asset.id)) return false;
    seen.add(asset.id);
    return true;
  });
}

export function MediaPickerDialog({
  open,
  onClose,
  onSelect,
  multiple = false,
  folder: defaultFolder,
  title = "Select Image",
  applyUploadedAssetImmediately = true,
}: MediaPickerDialogProps) {
  const [assets, setAssets] = useState<MediaAssetDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [folderFilter, setFolderFilter] = useState(defaultFolder || "");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [uploadedAssetId, setUploadedAssetId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  const [retryTokens, setRetryTokens] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const listAbortRef = useRef<AbortController | null>(null);
  const uploadAbortRef = useRef<AbortController | null>(null);
  const selectedIdsRef = useRef(selectedIds);
  const uploadedAssetIdRef = useRef(uploadedAssetId);

  useEffect(() => {
    selectedIdsRef.current = selectedIds;
  }, [selectedIds]);
  useEffect(() => {
    uploadedAssetIdRef.current = uploadedAssetId;
  }, [uploadedAssetId]);

  const closeDialog = useCallback(() => {
    listAbortRef.current?.abort();
    uploadAbortRef.current?.abort();
    setUploading(false);
    onClose();
  }, [onClose]);

  const fetchAssets = useCallback(async () => {
    listAbortRef.current?.abort();
    const controller = new AbortController();
    listAbortRef.current = controller;
    setLoading(true);
    setLoadError("");
    try {
      const params = new URLSearchParams({ pageSize: "60", sort: "newest" });
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (folderFilter) params.set("folder", folderFilter);
      const response = await fetch(`/api/admin/media?${params}`, {
        cache: "no-store",
        signal: controller.signal,
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok || json?.success === false) {
        throw new Error(json?.error || "Unable to load media assets.");
      }
      const items = Array.isArray(json?.data?.items) ? (json.data.items as MediaAssetDto[]) : [];
      setAssets((previous) => {
        const retained = previous.filter(
          (asset) =>
            selectedIdsRef.current.has(asset.id) || uploadedAssetIdRef.current === asset.id,
        );
        return mergeAssets(retained, items);
      });
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        setLoadError(error instanceof Error ? error.message : "Unable to load media assets.");
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [folderFilter, searchQuery]);

  useEffect(() => {
    if (!open) return;
    setFolderFilter(defaultFolder || "");
    setSelectedIds(new Set());
    setUploadedAssetId(null);
    setUploadError("");
  }, [defaultFolder, open]);

  useEffect(() => {
    if (!open) return;
    void fetchAssets();
    return () => {
      listAbortRef.current?.abort();
    };
  }, [fetchAssets, open]);

  useEffect(() => () => uploadAbortRef.current?.abort(), []);

  const toggleSelect = (id: string) => {
    setSelectedIds((previous) => {
      if (!multiple) return new Set([id]);
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConfirm = () => {
    const selected = assets.filter((asset) => selectedIds.has(asset.id));
    if (!selected.length) return;
    onSelect(multiple ? selected : selected[0]);
    closeDialog();
  };

  const uploadFile = async (file: File) => {
    if (uploading) return;
    const controller = new AbortController();
    uploadAbortRef.current = controller;
    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folderFilter || defaultFolder || MEDIA_FOLDERS.UPLOADS);
      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok || json?.success === false) {
        throw new Error(json?.detail || json?.error || "Upload failed.");
      }
      const uploaded = json?.data as MediaAssetDto | undefined;
      if (!uploaded?.id || !uploaded.url || !uploaded.storageKey || !uploaded.fileName) {
        throw new Error("Upload completed but returned an invalid media payload.");
      }

      setAssets((previous) => mergeAssets([uploaded], previous));
      setSelectedIds(new Set([uploaded.id]));
      setUploadedAssetId(uploaded.id);
      setBrokenImages((previous) => {
        const next = new Set(previous);
        next.delete(uploaded.id);
        return next;
      });

      if (applyUploadedAssetImmediately && !multiple) {
        onSelect(uploaded);
        closeDialog();
      } else {
        requestAnimationFrame(() => {
          document.getElementById(`media-asset-${uploaded.id}`)?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        });
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        setUploadError(error instanceof Error ? error.message : "Upload failed.");
      }
    } finally {
      if (!controller.signal.aborted) setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const retryImage = (assetId: string) => {
    setBrokenImages((previous) => {
      const next = new Set(previous);
      next.delete(assetId);
      return next;
    });
    setRetryTokens((previous) => ({ ...previous, [assetId]: Date.now() }));
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.button
          type="button"
          aria-label="Close media picker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeDialog}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white rounded-2xl shadow-luxury border border-[var(--admin-border)]/50 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--admin-border)]/40">
            <div>
              <h2 className="font-heading text-lg font-semibold text-[var(--admin-ink)]">{title}</h2>
              <p className="text-[10px] text-[var(--admin-muted)]">Folder: {folderFilter || "All Media"}</p>
            </div>
            <button type="button" onClick={closeDialog} className="p-2 text-[var(--admin-muted)] hover:text-[var(--admin-ink)] hover:bg-[var(--admin-surface-hover)] rounded-lg">
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 px-6 py-3 border-b border-[var(--admin-border)]/20 bg-[var(--admin-surface-muted)]">
            <div className="relative min-w-[220px] flex-grow">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-placeholder)]" />
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search images..." className="w-full rounded-lg border border-[var(--admin-border-strong)] pl-9 pr-3 py-2 text-xs outline-none focus:border-[var(--admin-accent)] bg-white" />
            </div>
            <select value={folderFilter} onChange={(event) => setFolderFilter(event.target.value)} className="rounded-lg border border-[var(--admin-border-strong)] bg-white px-3 py-2 text-xs">
              <option value="">All Media</option>
              {FOLDER_OPTIONS.map((folder) => <option key={folder} value={folder}>{folder}</option>)}
            </select>
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[var(--admin-accent)] text-white rounded-full disabled:opacity-50">
              <Upload size={13} /> {uploading ? "Uploading..." : "Upload"}
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadFile(file); }} className="hidden" />
          </div>

          {(uploadError || uploadedAssetId) && (
            <div className={`px-6 py-2 text-xs ${uploadError ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
              {uploadError || "Uploaded. The new asset is selected and ready to use."}
            </div>
          )}

          <div
            className="relative flex-grow overflow-y-auto p-6"
            onDrop={(event) => { event.preventDefault(); setIsDragging(false); const file = event.dataTransfer.files[0]; if (file) void uploadFile(file); }}
            onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
          >
            {isDragging && <div className="absolute inset-6 z-20 flex items-center justify-center bg-[var(--admin-accent)]/10 border-2 border-dashed border-[var(--admin-accent)] rounded-2xl"><p className="text-sm font-medium text-[var(--admin-accent)]">Drop to upload</p></div>}
            {loading && assets.length === 0 ? (
              <div className="flex items-center justify-center py-16"><div className="animate-spin h-6 w-6 border-2 border-[var(--admin-accent)] border-t-transparent rounded-full" /></div>
            ) : loadError && assets.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center"><p className="text-xs font-semibold text-rose-600">{loadError}</p><button type="button" onClick={() => void fetchAssets()} className="rounded-full bg-[var(--admin-accent)] px-4 py-2 text-xs font-bold text-white">Retry</button></div>
            ) : assets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center"><ImagePlus size={32} className="text-[var(--admin-muted)]/40 mb-3" /><p className="text-xs text-[var(--admin-muted)]">No images found. Upload one to get started.</p></div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {assets.map((asset) => {
                  const selected = selectedIds.has(asset.id);
                  const broken = brokenImages.has(asset.id);
                  const separator = asset.url.includes("?") ? "&" : "?";
                  const imageUrl = retryTokens[asset.id] ? `${asset.url}${separator}retry=${retryTokens[asset.id]}` : asset.url;
                  return (
                    <div id={`media-asset-${asset.id}`} role="button" tabIndex={0} key={asset.id} onClick={() => toggleSelect(asset.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") toggleSelect(asset.id); }} className={`group relative aspect-square rounded-xl overflow-hidden border cursor-pointer bg-white transition-all ${selected ? "border-[var(--admin-accent)] ring-2 ring-[var(--admin-accent)]/30" : "border-[var(--admin-border)]/50 hover:border-[var(--admin-accent)]/40"}`}>
                      {!broken && <img src={imageUrl} alt={asset.alt || asset.fileName} onError={() => setBrokenImages((previous) => new Set(previous).add(asset.id))} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                      {broken && (
                        <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-rose-50 px-2 text-[9px] text-rose-700">
                          Image could not be loaded
                          <span className="flex gap-1">
                            <span role="button" tabIndex={0} onClick={(event) => { event.stopPropagation(); retryImage(asset.id); }} className="rounded bg-white p-1"><RefreshCw size={11} /></span>
                            <a href={asset.url} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="rounded bg-white p-1"><ExternalLink size={11} /></a>
                          </span>
                        </span>
                      )}
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100"><span className="block text-[9px] text-white truncate">{asset.originalName || asset.fileName}</span></span>
                      {selected && <span className="absolute top-1.5 right-1.5 bg-[var(--admin-accent)] text-white p-0.5 rounded-full shadow"><Check size={10} strokeWidth={3} /></span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--admin-border)]/40 bg-white">
            <p className="text-xs text-[var(--admin-muted)]">{selectedIds.size ? `${selectedIds.size} image${selectedIds.size === 1 ? "" : "s"} selected` : "No image selected"}</p>
            <div className="flex items-center gap-3">
              <button type="button" onClick={closeDialog} className="px-4 py-2 text-xs font-medium text-[var(--admin-ink)] bg-gray-100 rounded-full">Cancel</button>
              <button type="button" onClick={handleConfirm} disabled={!selectedIds.size} className="px-5 py-2 text-xs font-bold bg-[var(--admin-accent)] text-white rounded-full disabled:opacity-40">
                {multiple ? "Select Images" : uploadedAssetId && selectedIds.has(uploadedAssetId) ? "Use Uploaded Image" : "Select Image"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default MediaPickerDialog;

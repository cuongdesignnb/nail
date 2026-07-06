"use client";
import React, { useState, useEffect } from "react";
import { Search, Trash2, Folder, Clock, Calendar, Check, ExternalLink } from "lucide-react";
import Image from "next/image";
import { AdminConfirmDialog, useToast } from "@/components/admin/ui";

interface MediaLibraryGridProps {
  refreshTrigger: number;
  onRefresh: () => void;
}

export function MediaLibraryGrid({ refreshTrigger, onRefresh }: MediaLibraryGridProps) {
  const toast = useToast();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [folderFilter, setFolderFilter] = useState("");

  // Details viewer sidebar overlay
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

  // Delete state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    fetchMedia();
  }, [search, folderFilter, refreshTrigger]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        folder: folderFilter,
      });

      const res = await fetch(`/api/admin/media-library?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setList(json.data || []);
        if (json.data && json.data.length > 0 && !selectedAsset) {
          setSelectedAsset(json.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await fetch(`/api/admin/media-library/${deleteTargetId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSelectedAsset(null);
        onRefresh();
        toast.success("Media asset deleted successfully.");
      } else {
        toast.error("Failed to delete media asset.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting.");
    } finally {
      setDeleteTargetId(null);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left font-sans">
      {/* Grid gallery side */}
      <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 border border-[var(--admin-border)]/45 shadow-luxury">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Search filename or alt text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs border border-[var(--admin-border-strong)] focus:border-[var(--admin-accent)] rounded-full pl-9 pr-4 py-2 bg-transparent text-[var(--admin-ink)] outline-none"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-[var(--admin-muted)]" />
          </div>
          <div className="w-full md:w-44">
            <select
              value={folderFilter}
              onChange={(e) => setFolderFilter(e.target.value)}
              className="w-full text-xs border border-[var(--admin-border-strong)] focus:border-[var(--admin-accent)] rounded-full px-4 py-2 bg-transparent text-[var(--admin-ink)] outline-none"
            >
              <option value="">All Folders</option>
              <option value="services">Services</option>
              <option value="blog">Blog</option>
              <option value="gallery">Gallery</option>
              <option value="avatars">Avatars</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-xs text-[var(--admin-muted)] italic py-10 text-center">Loading media items...</p>
        ) : list.length === 0 ? (
          <p className="text-xs text-[var(--admin-muted)] italic py-10 text-center">No media assets found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {list.map((asset) => {
              const isSelected = selectedAsset && selectedAsset.id === asset.id;
              return (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border cursor-pointer group transition-all duration-200 ${
                    isSelected
                      ? "border-[var(--admin-accent)] ring-2 ring-[var(--admin-accent)]/20 scale-[0.98]"
                      : "border-[var(--admin-border)]/40 hover:border-[var(--admin-accent)] hover:scale-[0.99]"
                  }`}
                >
                  <Image src={asset.url} alt={asset.altText || ""} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white bg-black/50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      View Properties
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-[var(--admin-accent)] text-white rounded-full flex items-center justify-center shadow-md">
                      <Check size={11} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Details side */}
      <div className="lg:col-span-4 bg-white rounded-3xl p-6 md:p-8 border border-[var(--admin-border)]/45 shadow-luxury self-start">
        <h3 className="font-heading text-lg font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border-strong)] pb-3">
          Asset Properties
        </h3>

        {selectedAsset ? (
          <div className="space-y-6">
            {/* Preview */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--admin-border)]/40 bg-[var(--admin-surface-muted)]">
              <Image src={selectedAsset.url} alt="Preview" fill className="object-contain" />
            </div>

            {/* Meta list */}
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] text-[var(--admin-muted)] uppercase block font-semibold">Filename</span>
                <p className="font-medium text-[var(--admin-ink)] mt-0.5 select-all break-all">{selectedAsset.filename}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-[var(--admin-muted)] uppercase block font-semibold">Folder</span>
                  <span className="inline-flex items-center gap-1 text-[var(--admin-accent)] font-medium mt-1 uppercase tracking-wider text-[10px]">
                    <Folder size={10} />
                    {selectedAsset.folder || "general"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--admin-muted)] uppercase block font-semibold">Uploaded</span>
                  <span className="inline-flex items-center gap-1 text-[var(--admin-muted)] mt-1">
                    <Calendar size={10} />
                    {formatDate(selectedAsset.createdAt)}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[var(--admin-muted)] uppercase block font-semibold">URL Path</span>
                <div className="flex gap-1.5 items-center mt-1">
                  <input
                    type="text"
                    readOnly
                    value={selectedAsset.url}
                    className="flex-grow text-[10px] border border-[var(--admin-border-strong)] rounded-lg px-2.5 py-1.5 bg-gray-50 outline-none select-all font-mono"
                  />
                  <a
                    href={selectedAsset.url}
                    target="_blank"
                    className="p-1.5 border border-[var(--admin-border-strong)] hover:border-[var(--admin-accent)] text-[var(--admin-muted)] hover:text-[var(--admin-accent)] rounded-lg"
                    title="Open in new tab"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {selectedAsset.alt && (
                <div>
                  <span className="text-[10px] text-[var(--admin-muted)] uppercase block font-semibold">Alt Text</span>
                  <p className="text-[var(--admin-muted)] mt-0.5 leading-relaxed italic">{selectedAsset.alt}</p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="border-t border-[var(--admin-border)]/20 pt-4 flex gap-2 justify-end">
              <button
                onClick={() => setDeleteTargetId(selectedAsset.id)}
                className="bg-transparent hover:bg-rose-50 text-gray-500 hover:text-rose-600 border border-transparent hover:border-rose-200 px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Delete Asset</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-[var(--admin-muted)] italic py-6 text-center">Select an asset to view its properties.</p>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <AdminConfirmDialog
        open={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Media Asset"
        description="Are you sure you want to permanently delete this media asset? This will break any pages or database items referencing this URL."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
export default MediaLibraryGrid;

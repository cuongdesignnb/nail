"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Image as ImageIcon } from "lucide-react";
import { MediaGrid } from "./MediaGrid";
import { MediaFilterBar } from "./MediaFilterBar";
import { MediaDetailsPanel } from "./MediaDetailsPanel";
import { MediaUploadDropzone } from "./MediaUploadDropzone";
import { MediaEmptyState } from "./MediaEmptyState";

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
  storageKey: string | null;
  provider: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MediaFolder {
  id: string;
  name: string;
  slug: string;
}

export function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedFolder) params.set("folder", selectedFolder);
      if (sortBy) params.set("sort", sortBy);
      params.set("page", String(page));
      params.set("pageSize", "24");

      const res = await fetch(`/api/admin/media?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setAssets(json.data.items || []);
        setTotalPages(json.data.totalPages || 1);
        setTotal(json.data.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch media:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedFolder, sortBy, page]);

  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/media/folders");
      if (res.ok) {
        const json = await res.json();
        setFolders(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch folders:", err);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const selectedAsset = assets.find((a) => a.id === selectedId) || null;

  const handleUpdate = async (id: string, data: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchAssets();
      }
    } catch (err) {
      console.error("Failed to update asset:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSelectedId(null);
        await fetchAssets();
      }
    } catch (err) {
      console.error("Failed to delete asset:", err);
    }
  };

  const handleUploadComplete = () => {
    fetchAssets();
  };

  return (
    <div className="font-sans text-left">
      {/* Header */}
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-aera-ink flex items-center gap-2 font-heading">
          <ImageIcon size={24} className="text-aera-accent" />
          Media Library
        </h1>
        <p className="text-xs text-aera-muted mt-1">
          Upload, organize, and manage all your images in one place.
        </p>
      </section>

      {/* Upload dropzone */}
      <MediaUploadDropzone
        onUploadComplete={handleUploadComplete}
        folder={selectedFolder || "uploads"}
      />

      {/* Filters */}
      <MediaFilterBar
        search={searchQuery}
        onSearchChange={(v) => {
          setSearchQuery(v);
          setPage(1);
        }}
        folder={selectedFolder}
        onFolderChange={(v) => {
          setSelectedFolder(v);
          setPage(1);
        }}
        folders={folders}
        sort={sortBy}
        onSortChange={setSortBy}
        total={total}
      />

      {/* Main grid + details layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        <div className="lg:col-span-8 xl:col-span-9">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin h-6 w-6 border-2 border-aera-accent border-t-transparent rounded-full" />
            </div>
          ) : assets.length === 0 ? (
            <MediaEmptyState />
          ) : (
            <>
              <MediaGrid
                items={assets}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1.5 text-xs rounded-lg border border-aera-champagne/60 bg-white text-aera-ink hover:bg-aera-champagne/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-aera-muted">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-3 py-1.5 text-xs rounded-lg border border-aera-champagne/60 bg-white text-aera-ink hover:bg-aera-champagne/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Details panel */}
        <div className="lg:col-span-4 xl:col-span-3">
          <MediaDetailsPanel
            asset={selectedAsset}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            folders={folders}
          />
        </div>
      </div>
    </div>
  );
}

export default MediaLibraryPage;

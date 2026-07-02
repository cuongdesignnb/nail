"use client";
import React, { useState, useEffect } from "react";
import { Search, Trash2, Folder, Clock, Calendar, Check, ExternalLink } from "lucide-react";
import Image from "next/image";

interface MediaLibraryGridProps {
  refreshTrigger: number;
  onRefresh: () => void;
}

export function MediaLibraryGrid({ refreshTrigger, onRefresh }: MediaLibraryGridProps) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [folderFilter, setFolderFilter] = useState("");

  // Details viewer sidebar overlay
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

  useEffect(() => {
    fetchMedia();
  }, [search, folderFilter, refreshTrigger]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("keyword", search);
      if (folderFilter) params.set("folder", folderFilter);

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;
    try {
      const res = await fetch(`/api/admin/media-library/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSelectedAsset(null);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
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
      
      {/* Explorer side */}
      <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-aera-champagne/45 shadow-luxury flex flex-col space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pb-4 border-b border-aera-champagne/20">
          <div className="sm:col-span-8 relative">
            <input
              type="text"
              placeholder="Search images by name, alt, title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-aera-champagne/60 pl-9 pr-3 py-2 text-xs outline-none focus:border-aera-accent bg-white shadow-sm"
            />
            <Search size={14} className="text-gray-400 absolute left-3 top-[10px]" />
          </div>
          <div className="sm:col-span-4">
            <select
              value={folderFilter}
              onChange={(e) => setFolderFilter(e.target.value)}
              className="w-full rounded-xl border border-aera-champagne/60 px-3 py-2.5 text-xs outline-none focus:border-aera-accent bg-white shadow-sm"
            >
              <option value="">All Folders</option>
              <option value="uploads">Uploads</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-xs text-aera-muted italic py-10 text-center">Loading media items...</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 overflow-y-auto max-h-[60vh] pr-1 pb-4">
            {list.map((item) => {
              const isSelected = selectedAsset?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedAsset(item)}
                  className={`group relative aspect-square rounded-2xl overflow-hidden border p-1 bg-white cursor-pointer shadow-sm hover:shadow transition-all ${
                    isSelected ? "border-aera-accent ring-1 ring-aera-accent/30" : "border-aera-champagne/45"
                  }`}
                >
                  <div className="relative w-full h-full rounded-[0.8rem] overflow-hidden">
                    <Image
                      src={item.url}
                      alt={item.alt || item.fileName}
                      fill
                      sizes="150px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {isSelected && (
                    <span className="absolute top-2 right-2 bg-aera-accent text-white p-0.5 rounded-full z-10 shadow">
                      <Check size={8} />
                    </span>
                  )}
                </div>
              );
            })}
            {list.length === 0 && (
              <p className="text-xs text-aera-muted italic py-10 col-span-5 text-center">No media assets found matching query.</p>
            )}
          </div>
        )}
      </div>

      {/* Details Viewer Sidebar side */}
      <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-aera-champagne/45 shadow-luxury self-start">
        <h3 className="font-heading text-sm font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3 flex items-center gap-1.5">
          <Folder size={16} className="text-aera-accent" />
          <span>Asset Details</span>
        </h3>

        {selectedAsset ? (
          <div className="space-y-4 text-xs">
            {/* Aspect preview */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border bg-aera-cream/20">
              <Image src={selectedAsset.url} alt={selectedAsset.alt || ""} fill className="object-cover" />
            </div>

            <div className="space-y-3 font-sans">
              <div>
                <span className="text-[10px] text-aera-muted uppercase block font-semibold">File Name</span>
                <p className="font-semibold text-aera-ink break-all mt-0.5">{selectedAsset.fileName}</p>
              </div>

              <div>
                <span className="text-[10px] text-aera-muted uppercase block font-semibold">Direct Image URL</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <input
                    type="text"
                    readOnly
                    value={selectedAsset.url}
                    className="flex-grow rounded-lg border px-2.5 py-1.5 text-[10px] bg-gray-50 text-aera-ink truncate outline-none"
                  />
                  <a
                    href={selectedAsset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 border rounded-lg bg-white text-gray-500 hover:text-aera-accent hover:border-aera-accent transition-colors"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-aera-muted uppercase block font-semibold">Folder</span>
                  <p className="text-aera-ink mt-0.5">{selectedAsset.folder || "uploads"}</p>
                </div>
                <div>
                  <span className="text-[10px] text-aera-muted uppercase block font-semibold">Date Registered</span>
                  <p className="text-aera-ink mt-0.5 flex items-center gap-1">
                    <Clock size={11} className="text-aera-accent" />
                    <span>{formatDate(selectedAsset.createdAt)}</span>
                  </p>
                </div>
              </div>

              {selectedAsset.alt && (
                <div>
                  <span className="text-[10px] text-aera-muted uppercase block font-semibold">Alt Text</span>
                  <p className="text-aera-muted mt-0.5 leading-relaxed italic">{selectedAsset.alt}</p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="border-t border-aera-champagne/20 pt-4 flex gap-2 justify-end">
              <button
                onClick={() => handleDelete(selectedAsset.id)}
                className="bg-transparent hover:bg-rose-50 text-gray-500 hover:text-rose-600 border border-transparent hover:border-rose-200 px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Delete Asset</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-aera-muted italic py-6 text-center">Select an asset to view its properties.</p>
        )}
      </div>

    </div>
  );
}
export default MediaLibraryGrid;

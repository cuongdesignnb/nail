"use client";
import React, { useState, useEffect } from "react";
import { Search, FolderOpen, Image as ImageIcon, X, Plus } from "lucide-react";
import Image from "next/image";

interface MediaPickerModalProps {
  onSelect: (url: string, alt: string) => void;
  onClose: () => void;
}

export function MediaPickerModal({ onSelect, onClose }: MediaPickerModalProps) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState("");

  // Upload new state
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, [search, folder]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("keyword", search);
      if (folder) params.set("folder", folder);

      const res = await fetch(`/api/admin/media-library?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setList(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl.trim()) return;

    setUploadLoading(true);
    try {
      // derive filename
      const fileName = uploadUrl.split("/").pop() || "image.jpg";
      const payload = {
        fileName,
        url: uploadUrl,
        alt: uploadAlt || fileName,
        title: uploadTitle || fileName,
        folder: "uploads",
      };

      const res = await fetch("/api/admin/media-library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        onSelect(json.data.url, json.data.alt || "");
      } else {
        alert("Failed to register image. Verify url format.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-aera-ink/65 backdrop-blur-sm font-sans text-left">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-luxury border border-aera-champagne overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-aera-champagne/45 flex justify-between items-center shrink-0">
          <h3 className="font-heading text-base font-normal text-aera-ink flex items-center gap-2">
            <ImageIcon size={18} className="text-aera-accent" />
            Media Library Explorer
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full border-none bg-transparent cursor-pointer text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* Content grid splitter */}
        <div className="flex-grow overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
          {/* Left Side: Explorer Grid */}
          <div className="lg:col-span-8 flex flex-col space-y-4 min-h-0">
            {/* Search filter bar */}
            <div className="flex gap-3">
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Search files..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-aera-champagne/60 pl-9 pr-3 py-2 text-xs outline-none focus:border-aera-accent bg-white"
                />
                <Search size={13} className="text-gray-400 absolute left-3 top-2.5" />
              </div>
              <select
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="rounded-xl border border-aera-champagne/60 px-3 py-2 text-xs outline-none focus:border-aera-accent bg-white"
              >
                <option value="">All Folders</option>
                <option value="uploads">Uploads</option>
              </select>
            </div>

            {/* Media list */}
            {loading ? (
              <p className="text-xs text-aera-muted italic py-10 text-center flex-grow">Loading assets...</p>
            ) : (
              <div className="flex-grow overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-3 min-h-0 pr-1 pb-4">
                {list.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelect(item.url, item.alt || "")}
                    className="group relative aspect-square rounded-2xl overflow-hidden border border-aera-champagne/45 bg-aera-cream/15 p-1 hover:border-aera-accent cursor-pointer shadow-sm hover:shadow transition-all"
                  >
                    <div className="relative w-full h-full rounded-[0.8rem] overflow-hidden">
                      <Image
                        src={item.url}
                        alt={item.alt || item.fileName}
                        fill
                        sizes="100px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>
                ))}
                {list.length === 0 && (
                  <p className="text-xs text-aera-muted italic py-10 col-span-4 text-center">No images registered. Try adding one on the right!</p>
                )}
              </div>
            )}
          </div>

          {/* Right Side: Quick Add Form */}
          <div className="lg:col-span-4 bg-aera-cream/25 rounded-3xl p-5 border border-aera-champagne/45 self-start space-y-4">
            <h4 className="font-heading text-xs font-bold text-aera-accent flex items-center gap-1.5 border-b border-aera-champagne/30 pb-2">
              <Plus size={13} />
              Add External Image URL
            </h4>
            <form onSubmit={handleDirectUpload} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-aera-ink">Image Web URL / Local Path *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /images/blog-1.jpg"
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  className="w-full rounded-lg border border-aera-champagne/60 px-3 py-2 text-xs outline-none focus:border-aera-accent bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-aera-ink">Alt Text Description</label>
                <input
                  type="text"
                  placeholder="e.g. Elegant manicure styling close up"
                  value={uploadAlt}
                  onChange={(e) => setUploadAlt(e.target.value)}
                  className="w-full rounded-lg border border-aera-champagne/60 px-3 py-2 text-xs outline-none focus:border-aera-accent bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-aera-ink">Title Label</label>
                <input
                  type="text"
                  placeholder="e.g. Blog 1 Thumbnail"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full rounded-lg border border-aera-champagne/60 px-3 py-2 text-xs outline-none focus:border-aera-accent bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={uploadLoading || !uploadUrl.trim()}
                className="w-full bg-aera-accent hover:bg-aera-accentHover text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow border-none cursor-pointer"
              >
                {uploadLoading ? "Registering..." : "Insert & Add to Library"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MediaPickerModal;

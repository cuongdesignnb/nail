"use client";
import React, { useState, useEffect, useCallback } from "react";
import { GalleryCategoryDTO } from "@/types/gallery";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Edit, Trash2, Search, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface AdminGalleryTableProps {
  categories: GalleryCategoryDTO[];
  onEdit: (item: any) => void;
  refreshTrigger: number;
  onRefreshNeeded: () => void;
}

export function AdminGalleryTable({
  categories,
  onEdit,
  refreshTrigger,
  onRefreshNeeded,
}: AdminGalleryTableProps) {
  const [items, setItems] = useState<any[]>([]);
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState("");
  const [isHighlight, setIsHighlight] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (keyword) params.append("keyword", keyword);
      if (categoryId) params.append("categoryId", categoryId);
      if (isActive) params.append("isActive", isActive);
      if (isHighlight) params.append("isHighlight", isHighlight);

      const res = await fetch(`/api/admin/gallery-items?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setItems(json.data || []);
        setTotalPages(json.meta?.totalPages || 1);
      }
    } catch (error) {
      console.error("Fetch gallery items failed:", error);
    } finally {
      setLoading(false);
    }
  }, [keyword, categoryId, isActive, isHighlight, page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems, refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this item?")) return;
    try {
      const res = await fetch(`/api/admin/gallery-items/${id}`, { method: "DELETE" });
      if (res.ok) {
        onRefreshNeeded();
      } else {
        alert("Failed to deactivate item");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-aera-champagne/45 shadow-luxury text-left font-sans">
      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search designs..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 border border-aera-champagne/70 rounded-full text-xs font-sans text-aera-ink focus:outline-none focus:border-aera-accent bg-transparent"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-aera-muted" />
        </div>

        {/* Category */}
        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 border border-aera-champagne/70 rounded-full text-xs font-sans text-aera-ink focus:outline-none focus:border-aera-accent bg-white cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Active Status */}
        <select
          value={isActive}
          onChange={(e) => {
            setIsActive(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 border border-aera-champagne/70 rounded-full text-xs font-sans text-aera-ink focus:outline-none focus:border-aera-accent bg-white cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="true">Active Only</option>
          <option value="false">Inactive Only</option>
        </select>

        {/* Highlight Status */}
        <select
          value={isHighlight}
          onChange={(e) => {
            setIsHighlight(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 border border-aera-champagne/70 rounded-full text-xs font-sans text-aera-ink focus:outline-none focus:border-aera-accent bg-white cursor-pointer"
        >
          <option value="">All Tiles</option>
          <option value="true">Highlights Only</option>
          <option value="false">Regular Only</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-xs text-aera-muted italic py-10 text-center">Loading designs list...</p>
      ) : items.length === 0 ? (
        <p className="text-xs text-aera-muted italic py-10 text-center">No designs match your criteria.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans text-aera-ink">
            <thead>
              <tr className="bg-aera-champagne/10 border-b border-aera-champagne/60 text-aera-ink font-semibold">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Title / Tag</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Highlight</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-aera-champagne/30 hover:bg-aera-champagne/5 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-aera-champagne/15 border border-aera-champagne/30">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-semibold text-aera-ink">{item.title}</div>
                      {item.tag && (
                        <div className="text-[9px] font-bold text-aera-accent mt-0.5 tracking-wider uppercase">
                          {item.tag}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-aera-muted">
                    {item.category?.name || <span className="italic text-gray-400">None</span>}
                  </td>
                  <td className="px-4 py-3">
                    {item.isHighlight ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-aera-gold bg-aera-gold/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        <Star size={9} className="fill-aera-gold" />
                        Highlight
                      </span>
                    ) : (
                      <span className="text-[9px] text-gray-400">Regular</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge active={item.isActive} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1 text-aera-accent hover:bg-aera-accent/10 rounded border-none bg-transparent cursor-pointer"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded border-none bg-transparent cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-aera-champagne/45">
          <span className="text-[10px] text-aera-muted">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 border border-aera-champagne/70 rounded-full hover:bg-aera-champagne/10 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer bg-white"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 border border-aera-champagne/70 rounded-full hover:bg-aera-champagne/10 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer bg-white"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminGalleryTable;

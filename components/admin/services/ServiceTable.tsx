"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ServiceCategoryDTO } from "@/types/services";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Edit, Trash2, Search, Star, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface ServiceTableProps {
  categories: ServiceCategoryDTO[];
  onEdit: (service: any) => void;
  refreshTrigger: number;
  onRefreshNeeded: () => void;
}

export function ServiceTable({ categories, onEdit, refreshTrigger, onRefreshNeeded }: ServiceTableProps) {
  const [services, setServices] = useState<any[]>([]);
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState("");
  const [isFeatured, setIsFeatured] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (keyword) params.append("keyword", keyword);
      if (categoryId) params.append("categoryId", categoryId);
      if (isActive) params.append("isActive", isActive);
      if (isFeatured) params.append("isFeatured", isFeatured);

      const res = await fetch(`/api/admin/services?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setServices(json.data || []);
        setTotalPages(json.meta?.totalPages || 1);
      }
    } catch (error) {
      console.error("Fetch services failed:", error);
    } finally {
      setLoading(false);
    }
  }, [keyword, categoryId, isActive, isFeatured, page]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices, refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this service?")) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      if (res.ok) {
        onRefreshNeeded();
      } else {
        alert("Failed to deactivate service");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred deactivating service");
    }
  };

  return (
    <div className="admin-card wide font-sans">
      {/* Table Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-aera-champagne/60 bg-aera-champagne/5 rounded-t-3xl">
        <div className="flex items-center gap-2 bg-white border border-aera-champagne/65 rounded-lg px-3 py-1.5 w-full max-w-[280px]">
          <Search size={14} className="text-aera-muted/60" />
          <input
            placeholder="Search services..."
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
            className="border-none bg-transparent outline-none text-xs text-aera-ink w-full placeholder-aera-muted/40 font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={categoryId}
            onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
            className="rounded-lg border border-aera-champagne/65 bg-white px-3 py-2 text-xs text-aera-ink outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={isActive}
            onChange={(e) => { setIsActive(e.target.value); setPage(1); }}
            className="rounded-lg border border-aera-champagne/65 bg-white px-3 py-2 text-xs text-aera-ink outline-none"
          >
            <option value="">All Status</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>

          <select
            value={isFeatured}
            onChange={(e) => { setIsFeatured(e.target.value); setPage(1); }}
            className="rounded-lg border border-aera-champagne/65 bg-white px-3 py-2 text-xs text-aera-ink outline-none"
          >
            <option value="">Featured Status</option>
            <option value="true">Featured Only</option>
            <option value="false">Normal Only</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse text-left text-xs font-sans text-aera-ink">
          <thead>
            <tr className="bg-aera-champagne/20 border-b border-aera-champagne/60 text-aera-ink font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Service Info</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Featured</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-aera-muted italic">
                  Loading services...
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-aera-muted italic">
                  No services found matching filters.
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="border-b border-aera-champagne/30 hover:bg-aera-champagne/5 transition-colors">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-aera-champagne/15 border border-aera-champagne/30">
                      <Image
                        src={service.image || "/images/about-nail-detail.jpg"}
                        alt={service.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div>
                      <div className="font-semibold text-sm text-aera-ink">{service.name}</div>
                      <div className="text-[10px] text-aera-muted mt-0.5 line-clamp-1 max-w-[200px]">
                        {service.slug}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="text-xs text-aera-muted">
                      {service.category?.name || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="text-xs text-aera-muted">
                      {service.durationLabel || `${service.durationMinutes || service.duration || 0} min`}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap font-medium text-aera-accent">
                    {service.priceLabel || `$${service.price}`}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    {service.isFeatured ? (
                      <span className="text-aera-gold inline-flex items-center gap-1 font-semibold">
                        <Star size={12} fill="currentColor" /> Yes
                      </span>
                    ) : (
                      <span className="text-aera-muted/40">No</span>
                    )}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <StatusBadge active={service.isActive} />
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(service)}
                        className="p-1 text-aera-accent hover:bg-aera-accent/10 rounded border-none bg-transparent cursor-pointer"
                        title="Edit Service"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded border-none bg-transparent cursor-pointer"
                        title="Deactivate Service"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-6 py-4 border-t border-aera-champagne/60 bg-aera-champagne/5 rounded-b-3xl">
          <span className="text-xs text-aera-muted">
            Page <b>{page}</b> of <b>{totalPages}</b>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 border border-aera-champagne/50 hover:bg-aera-champagne/15 rounded-lg disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 border border-aera-champagne/50 hover:bg-aera-champagne/15 rounded-lg disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default ServiceTable;

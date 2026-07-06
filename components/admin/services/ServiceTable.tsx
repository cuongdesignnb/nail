"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ServiceCategoryDTO } from "@/types/services";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Edit, Trash2, Search, Star, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { AdminConfirmDialog } from "@/components/admin/ui/AdminConfirmDialog";
import { asArray, isRecord } from "@/lib/utils/array";

interface ServiceTableProps {
  categories: ServiceCategoryDTO[];
  onEdit: (service: any) => void;
  refreshTrigger: number;
  onRefreshNeeded: () => void;
}

export function ServiceTable({ categories, onEdit, refreshTrigger, onRefreshNeeded }: ServiceTableProps) {
  const safeCategories = asArray<ServiceCategoryDTO>(categories);
  const [services, setServices] = useState<any[]>([]);
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState("");
  const [isFeatured, setIsFeatured] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deactivateId, setDeactivateId] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError("");
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
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        setServices([]);
        setTotalPages(1);
        setError(json?.error || json?.message || "Unable to load services.");
        return;
      }
      setServices(asArray<any>(json?.data));
      const meta = isRecord(json?.meta) ? json.meta : {};
      const nextTotalPages = typeof meta.totalPages === "number" && Number.isFinite(meta.totalPages)
        ? meta.totalPages
        : 1;
      setTotalPages(Math.max(1, nextTotalPages));
    } catch (error) {
      console.error("Fetch services failed:", error);
      setServices([]);
      setTotalPages(1);
      setError("A connection error occurred while loading services.");
    } finally {
      setLoading(false);
    }
  }, [keyword, categoryId, isActive, isFeatured, page]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices, refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        onRefreshNeeded();
      } else {
        setError(json?.error || json?.message || "Failed to deactivate service.");
      }
    } catch (err) {
      console.error(err);
      setError("A connection error occurred while deactivating service.");
    }
  };

  return (
    <div className="admin-card wide font-sans">
      {/* Table Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-[var(--admin-border-strong)] bg-[var(--admin-surface-muted)] rounded-t-3xl">
        <div className="flex items-center gap-2 bg-white border border-[var(--admin-border)]/65 rounded-lg px-3 py-1.5 w-full max-w-[280px]">
          <Search size={14} className="text-[var(--admin-placeholder)]" />
          <input
            placeholder="Search services..."
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
            className="border-none bg-transparent outline-none text-xs text-[var(--admin-ink)] w-full placeholder-[var(--admin-placeholder)] font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={categoryId}
            onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
            className="rounded-lg border border-[var(--admin-border)]/65 bg-white px-3 py-2 text-xs text-[var(--admin-ink)] outline-none w-full md:!w-[150px]"
          >
            <option value="">All Categories</option>
            {safeCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={isActive}
            onChange={(e) => { setIsActive(e.target.value); setPage(1); }}
            className="rounded-lg border border-[var(--admin-border)]/65 bg-white px-3 py-2 text-xs text-[var(--admin-ink)] outline-none w-full md:!w-[140px]"
          >
            <option value="">All Status</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>

          <select
            value={isFeatured}
            onChange={(e) => { setIsFeatured(e.target.value); setPage(1); }}
            className="rounded-lg border border-[var(--admin-border)]/65 bg-white px-3 py-2 text-xs text-[var(--admin-ink)] outline-none w-full md:!w-[140px]"
          >
            <option value="">Featured Status</option>
            <option value="true">Featured Only</option>
            <option value="false">Normal Only</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      {error && (
        <div className="mx-4 mt-4 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs text-rose-700">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-semibold">{error}</span>
            <button
              type="button"
              onClick={fetchServices}
              className="rounded-full bg-white px-4 py-2 text-[11px] font-bold text-rose-700 shadow-sm transition hover:bg-rose-100"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse text-left text-xs font-sans text-[var(--admin-ink)]">
          <thead>
            <tr className="bg-[var(--admin-surface-hover)] border-b border-[var(--admin-border-strong)] text-[var(--admin-ink)] font-semibold uppercase tracking-wider">
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
                <td colSpan={8} className="text-center py-10 text-[var(--admin-muted)] italic">
                  Loading services...
                </td>
              </tr>
            ) : asArray<any>(services).length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-[var(--admin-muted)] italic">
                  No services found matching filters.
                </td>
              </tr>
            ) : (
              asArray<any>(services).map((service) => (
                <tr key={service.id} className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-surface-muted)] transition-colors">
                  <td className="px-6 py-3 whitespace-nowrap">
                    {service.image ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[var(--admin-surface-muted)] border border-[var(--admin-border)]">
                        <Image
                          src={service.image}
                          alt={service.imageAlt || service.name || "Service image"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] text-[var(--admin-accent)]">
                        <Sparkles size={17} />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <div>
                      <div className="font-semibold text-sm text-[var(--admin-ink)]">{service.name}</div>
                      <div className="text-[10px] text-[var(--admin-muted)] mt-0.5 line-clamp-1 max-w-[200px]">
                        {service.slug}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="text-xs text-[var(--admin-muted)]">
                      {service.category?.name || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="text-xs text-[var(--admin-muted)]">
                      {service.durationLabel || `${service.durationMinutes || service.duration || 0} min`}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap font-medium text-[var(--admin-accent)]">
                    {service.priceLabel || `$${service.price}`}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    {service.isFeatured ? (
                      <span className="text-[var(--admin-warning)] inline-flex items-center gap-1 font-semibold">
                        <Star size={12} fill="currentColor" /> Yes
                      </span>
                    ) : (
                      <span className="text-[var(--admin-muted)]/40">No</span>
                    )}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <StatusBadge active={service.isActive} />
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(service)}
                        className="p-1 text-[var(--admin-accent)] hover:bg-[var(--admin-accent)]/10 rounded border-none bg-transparent cursor-pointer"
                        title="Edit Service"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => setDeactivateId(service.id)}
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
        <div className="flex justify-between items-center px-6 py-4 border-t border-[var(--admin-border-strong)] bg-[var(--admin-surface-muted)] rounded-b-3xl">
          <span className="text-xs text-[var(--admin-muted)]">
            Page <b>{page}</b> of <b>{totalPages}</b>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 border border-[var(--admin-border)]/50 hover:bg-[var(--admin-surface-muted)] rounded-lg disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 border border-[var(--admin-border)]/50 hover:bg-[var(--admin-surface-muted)] rounded-lg disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
      <AdminConfirmDialog
        open={deactivateId !== null}
        onClose={() => setDeactivateId(null)}
        onConfirm={() => {
          if (deactivateId) void handleDelete(deactivateId);
        }}
        title="Deactivate Service"
        description="This will hide the service from active selections while preserving its record."
        confirmLabel="Deactivate"
        variant="danger"
      />
    </div>
  );
}
export default ServiceTable;

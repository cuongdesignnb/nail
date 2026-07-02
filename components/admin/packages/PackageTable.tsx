"use client";
import React, { useState, useEffect } from "react";
import { FormField, FormSelect } from "@/components/common/FormField";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Edit2, Trash2, Search, Filter } from "lucide-react";
import Image from "next/image";
import { PackageCategoryDTO } from "@/types/packages";

interface PackageTableProps {
  categories: PackageCategoryDTO[];
  refreshTrigger: number;
  onEdit: (pkg: any) => void;
}

export function PackageTable({ categories, refreshTrigger, onEdit }: PackageTableProps) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchPackages();
  }, [search, catFilter, statusFilter, page, refreshTrigger]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        keyword: search,
        categoryId: catFilter,
        isActive: statusFilter,
        page: page.toString(),
        limit: limit.toString(),
      });
      const res = await fetch(`/api/admin/nail-packages?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setList(json.data || []);
        setTotalPages(json.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load packages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      const res = await fetch(`/api/admin/nail-packages/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchPackages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectCatOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const selectStatusOptions = [
    { value: "", label: "All Statuses" },
    { value: "true", label: "Active Only" },
    { value: "false", label: "Inactive Only" },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-aera-champagne/45 shadow-luxury text-left font-sans">
      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-6 pb-6 border-b border-aera-champagne/20">
        <div className="md:col-span-6 relative">
          <input
            type="text"
            placeholder="Search packages by name, description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-aera-champagne/60 pl-9 pr-3 py-2 text-xs font-sans text-aera-ink outline-none focus:border-aera-accent bg-white shadow-sm"
          />
          <Search size={14} className="text-gray-400 absolute left-3 top-[10px]" />
        </div>
        <div className="md:col-span-3">
          <FormSelect
            label=""
            value={catFilter}
            onChange={(e) => {
              setCatFilter(e.target.value);
              setPage(1);
            }}
            options={selectCatOptions}
            className="mb-0"
          />
        </div>
        <div className="md:col-span-3">
          <FormSelect
            label=""
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            options={selectStatusOptions}
            className="mb-0"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-aera-muted italic py-10 text-center">Loading packages...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-aera-champagne/20 text-aera-muted">
                <th className="py-3 text-left pl-2">Package</th>
                <th className="py-3 text-left">Category</th>
                <th className="py-3 text-center">Price</th>
                <th className="py-3 text-center">Duration</th>
                <th className="py-3 text-center">Order</th>
                <th className="py-3 text-center">Status</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((pkg) => (
                <tr key={pkg.id} className="border-b border-aera-champagne/10 hover:bg-aera-cream/10">
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-3">
                      {pkg.image && (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border bg-aera-champagne/10 shrink-0">
                          <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-aera-ink flex items-center gap-1.5">
                          <span>{pkg.name}</span>
                          {pkg.isPopular && (
                            <span className="bg-aera-accent/10 text-aera-accent border border-aera-accent/20 px-2 py-0.5 rounded-full text-[8px] font-bold">
                              POPULAR
                            </span>
                          )}
                        </h4>
                        <span className="text-[10px] text-aera-muted">{pkg.subtitle}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 font-medium text-aera-muted">{pkg.category?.name || "Uncategorized"}</td>
                  <td className="py-3 text-center font-semibold text-aera-accent">{pkg.priceLabel}</td>
                  <td className="py-3 text-center text-aera-muted">{pkg.durationLabel || pkg.visitCountLabel || "-"}</td>
                  <td className="py-3 text-center">{pkg.sortOrder}</td>
                  <td className="py-3 text-center">
                    <StatusBadge active={pkg.isActive} />
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(pkg)}
                        className="p-1.5 text-gray-500 hover:text-aera-accent bg-transparent border-none cursor-pointer"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="p-1.5 text-gray-500 hover:text-rose-600 bg-transparent border-none cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-aera-muted italic">
                    No packages matching search filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-6 border-t border-aera-champagne/20 mt-6 text-xs text-aera-muted">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-none"
            >
              Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-none"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default PackageTable;

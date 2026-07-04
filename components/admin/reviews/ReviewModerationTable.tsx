"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, Check, EyeOff, Trash2, MessageSquare } from "lucide-react";
import {
  AdminPageHeader,
  AdminTableShell,
  AdminSearchInput,
  AdminPagination,
  AdminConfirmDialog,
  AdminLoadingState,
  AdminEmptyState,
} from "@/components/admin/ui";

interface Review {
  id: string;
  customer: string;
  rating: number;
  text: string;
  approved: boolean;
  createdAt: string;
}

export default function ReviewModerationTable() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const pageSize = 15;

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        status: statusFilter,
      });
      if (search) params.set("search", search);
      if (ratingFilter) params.set("rating", String(ratingFilter));

      const res = await fetch(`/api/admin/reviews?${params}`);
      const json = await res.json();
      if (json.success) {
        setReviews(json.data.reviews);
        setTotal(json.data.total);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, ratingFilter, statusFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, approved } : r))
      );
    } catch (err) {
      console.error("Failed to update review:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/reviews/${deleteId}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r.id !== deleteId));
      setTotal((prev) => prev - 1);
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
    setDeleteId(null);
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className="h-3 w-3"
          fill={s <= rating ? "#A85D1E" : "transparent"}
          stroke={s <= rating ? "#A85D1E" : "#EED9C2"}
        />
      ))}
    </div>
  );

  const columns = [
    { key: "customer", label: "Customer" },
    { key: "rating", label: "Rating" },
    { key: "text", label: "Review" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date" },
    { key: "actions", label: "Actions", width: "180px" },
  ];

  const selectClass =
    "rounded-xl border border-aera-champagne/60 bg-white px-3 py-2 text-xs text-aera-ink focus:border-aera-accent focus:outline-none focus:ring-2 focus:ring-aera-accent/20 w-full md:!w-[140px]";

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Reviews"
        description="Moderate customer reviews — approve, hide, or delete feedback."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Reviews" },
        ]}
      />

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <AdminSearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search by customer..."
        />

        <select
          value={ratingFilter ?? ""}
          onChange={(e) => {
            setRatingFilter(e.target.value ? Number(e.target.value) : null);
            setPage(1);
          }}
          className={selectClass}
        >
          <option value="">All Ratings</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Star{r > 1 ? "s" : ""}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as "all" | "approved" | "pending");
            setPage(1);
          }}
          className={selectClass}
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <AdminLoadingState variant="table" />
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-aera-champagne/30 bg-white">
          <AdminEmptyState
            icon={MessageSquare}
            title="No reviews found"
            description="No reviews match your current filters."
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AdminTableShell columns={columns}>
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-aera-champagne/10 transition-colors">
                <td className="px-5 py-3 text-xs font-semibold text-aera-ink">
                  {review.customer}
                </td>
                <td className="px-5 py-3">{renderStars(review.rating)}</td>
                <td className="px-5 py-3 text-xs text-aera-muted max-w-xs">
                  <p className="line-clamp-2">{review.text}</p>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      review.approved
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                        review.approved ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    {review.approved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-aera-muted whitespace-nowrap">
                  {new Date(review.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    {!review.approved && (
                      <button
                        type="button"
                        onClick={() => handleApprove(review.id, true)}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="Approve"
                      >
                        <Check className="h-3 w-3" />
                        Approve
                      </button>
                    )}
                    {review.approved && (
                      <button
                        type="button"
                        onClick={() => handleApprove(review.id, false)}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold text-amber-700 hover:bg-amber-50 transition-colors"
                        title="Hide"
                      >
                        <EyeOff className="h-3 w-3" />
                        Hide
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setDeleteId(review.id)}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </AdminTableShell>

          <AdminPagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
          />
        </motion.div>
      )}

      <AdminConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}

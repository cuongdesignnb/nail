"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Tag, Percent, DollarSign } from "lucide-react";
import {
  AdminPageHeader,
  AdminTableShell,
  AdminLoadingState,
  AdminEmptyState,
  AdminConfirmDialog,
} from "@/components/admin/ui";

interface Promotion {
  id: string;
  code: string;
  title: string;
  type: string;
  amount: number;
  active: boolean;
  firstBookingOnly: boolean;
  validUntil: string | null;
}

export default function AdminPromotionsPage() {
  const router = useRouter();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/promotions");
        const json = await res.json();
        if (json.success) setPromotions(json.data);
      } catch (err) {
        console.error("Failed to load promotions:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/promotions/${deleteId}`, { method: "DELETE" });
      setPromotions((prev) => prev.filter((p) => p.id !== deleteId));
    } catch (err) {
      console.error("Delete promotion error:", err);
    }
    setDeleteId(null);
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await fetch(`/api/admin/promotions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      setPromotions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, active } : p))
      );
    } catch (err) {
      console.error("Toggle promotion error:", err);
    }
  };

  const columns = [
    { key: "code", label: "Code" },
    { key: "title", label: "Title" },
    { key: "type", label: "Type" },
    { key: "amount", label: "Amount" },
    { key: "firstBooking", label: "First Booking" },
    { key: "validUntil", label: "Valid Until" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions", width: "140px" },
  ];

  return (
    <div className="admin-page-container">
      <AdminPageHeader
        eyebrow="Commerce"
        title="Promotions"
        description="Create promo codes, set validity windows and usage restrictions."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Promotions" },
        ]}
        actions={
          <button
            type="button"
            onClick={() => router.push("/admin/promotions/new")}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--admin-accent)] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[var(--admin-accent)]Hover"
          >
            <Plus className="h-3.5 w-3.5" />
            New Promotion
          </button>
        }
      />

      {loading ? (
        <AdminLoadingState variant="table" />
      ) : promotions.length === 0 ? (
        <div className="rounded-2xl border border-[var(--admin-border)] bg-white">
          <AdminEmptyState
            icon={Tag}
            title="No promotions yet"
            description="Create your first promotion to offer discounts to your customers."
            actionLabel="Create Promotion"
            onAction={() => router.push("/admin/promotions/new")}
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AdminTableShell columns={columns}>
            {promotions.map((promo) => (
              <tr key={promo.id} className="hover:bg-[var(--admin-surface-muted)] transition-colors">
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-[var(--admin-surface-hover)] px-2 py-1 text-[10px] font-bold font-mono text-[var(--admin-ink)]">
                    <Tag className="h-2.5 w-2.5 text-[var(--admin-accent)]" />
                    {promo.code}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs font-semibold text-[var(--admin-ink)]">{promo.title}</td>
                <td className="px-5 py-3 text-xs text-[var(--admin-muted)] capitalize">
                  <span className="flex items-center gap-1">
                    {promo.type === "percentage" ? (
                      <Percent className="h-3 w-3" />
                    ) : (
                      <DollarSign className="h-3 w-3" />
                    )}
                    {promo.type}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs font-semibold text-[var(--admin-ink)]">
                  {promo.type === "percentage" ? `${promo.amount}%` : `$${promo.amount}`}
                </td>
                <td className="px-5 py-3 text-xs text-[var(--admin-muted)]">
                  {promo.firstBookingOnly ? "Yes" : "No"}
                </td>
                <td className="px-5 py-3 text-xs text-[var(--admin-muted)]">
                  {promo.validUntil
                    ? new Date(promo.validUntil).toLocaleDateString()
                    : "No expiry"}
                </td>
                <td className="px-5 py-3">
                  <button
                    type="button"
                    onClick={() => toggleActive(promo.id, !promo.active)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                      promo.active
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                        promo.active ? "bg-emerald-500" : "bg-gray-400"
                      }`}
                    />
                    {promo.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => router.push(`/admin/promotions/${promo.id}/edit`)}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold text-[var(--admin-ink)] hover:bg-[var(--admin-surface-muted)] transition-colors"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(promo.id)}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </AdminTableShell>
        </motion.div>
      )}

      <AdminConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Promotion"
        description="Are you sure you want to delete this promotion? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}

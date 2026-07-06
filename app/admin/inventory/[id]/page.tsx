"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AdminPageHeader,
  AdminLoadingState,
  AdminErrorState,
} from "@/components/admin/ui";
import { InventoryDetail } from "@/components/admin/inventory/InventoryDetail";

export default function AdminInventoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItem = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/inventory/${id}`);
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Failed to load");
      setItem(json.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load inventory item"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  const handleAdjust = async (data: {
    type: string;
    quantity: number;
    reason: string;
  }) => {
    const res = await fetch("/api/admin/inventory/movements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inventoryItemId: id,
        type: data.type,
        quantity: data.quantity,
        reason: data.reason || undefined,
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success)
      throw new Error(json.error || "Failed to adjust");
    // Refetch to get updated stock and movements
    await fetchItem();
  };

  return (
    <div className="min-h-screen">
      <AdminPageHeader
        title={item?.name || "Inventory Item"}
        description="View item details, stock levels, and movement history."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Inventory", href: "/admin/inventory" },
          { label: item?.name || "Details" },
        ]}
        actions={
          <button
            type="button"
            onClick={() => router.push("/admin/inventory")}
            className="rounded-full border border-[var(--admin-border-strong)] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--admin-ink)] transition-colors hover:bg-[var(--admin-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/40 focus-visible:ring-offset-2"
          >
            ← Back to Inventory
          </button>
        }
      />

      {loading && <AdminLoadingState variant="card" />}
      {error && (
        <AdminErrorState
          title="Error loading item"
          description={error}
          onRetry={fetchItem}
        />
      )}

      {!loading && !error && item && (
        <InventoryDetail item={item} onAdjust={handleAdjust} />
      )}
    </div>
  );
}

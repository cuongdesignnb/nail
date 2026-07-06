"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AdminPackagesNavTabs } from "@/components/admin/packages/AdminPackagesNavTabs";
import { PackageTable } from "@/components/admin/packages/PackageTable";
import { NailPackageForm } from "@/components/admin/packages/NailPackageForm";
import { PackageCategoryDTO } from "@/types/packages";
import { Gift, Plus } from "lucide-react";

function ItemsManagerPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const actionParam = searchParams.get("action");

  const [categories, setCategories] = useState<PackageCategoryDTO[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (actionParam === "new") {
      setEditingItem(null);
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setEditingItem(null);
    }
  }, [actionParam]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/package-categories");
      if (res.ok) {
        const json = await res.json();
        setCategories(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("action", "new");
    router.push(`/admin/packages/items?${params.toString()}`);
  };

  const handleSave = () => {
    setIsEditing(false);
    setEditingItem(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    router.push(`/admin/packages/items?${params.toString()}`);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingItem(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    router.push(`/admin/packages/items?${params.toString()}`);
  };

  return (
    <div className="admin-page font-sans text-left p-6">
      {/* Header */}
      <section className="admin-section-heading flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--admin-ink)] flex items-center gap-2 font-heading leading-snug mb-1.5">
            <Gift size={24} className="text-[var(--admin-accent)]" />
            Nail Package Cards
          </h1>
          <p className="text-xs text-[var(--admin-muted)]">
            Manage individual package layouts, pricing cards, and features.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleCreateNew}
            className="bg-[var(--admin-accent)] hover:bg-[var(--admin-accent)]Hover text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 border-none cursor-pointer shadow"
          >
            <Plus size={14} />
            <span>Add Package</span>
          </button>
        )}
      </section>

      {/* Nav tabs */}
      <AdminPackagesNavTabs />

      {/* Content */}
      <div className="mt-4">
        {isEditing ? (
          <NailPackageForm
            categories={categories}
            initialData={editingItem}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <PackageTable
            categories={categories}
            refreshTrigger={refreshTrigger}
            onEdit={handleEdit}
          />
        )}
      </div>
    </div>
  );
}

export default function AdminPackagesItemsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading packages editor...</div>}>
      <ItemsManagerPanel />
    </Suspense>
  );
}

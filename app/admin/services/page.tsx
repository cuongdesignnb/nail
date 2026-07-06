"use client";
import React, { useState, useEffect } from "react";
import { AdminNavTabs } from "@/components/admin/services/AdminNavTabs";
import { ServiceTable } from "@/components/admin/services/ServiceTable";
import { ServiceForm } from "@/components/admin/services/ServiceForm";
import { ServiceCategoryDTO } from "@/types/services";
import { Plus } from "lucide-react";
import { ServicesErrorBoundary } from "@/components/admin/services/ServicesErrorBoundary";
import { asArray } from "@/lib/utils/array";
import { AdminPageHeader, AdminButton } from "@/components/admin/ui";

export default function AdminServicesPage() {
  const [categories, setCategories] = useState<ServiceCategoryDTO[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setCategoryError("");
    try {
      const res = await fetch("/api/admin/service-categories");
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        setCategories([]);
        setCategoryError(json?.error || json?.message || "Unable to load service categories.");
        return;
      }
      setCategories(asArray<ServiceCategoryDTO>(json?.data));
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategories([]);
      setCategoryError("A connection error occurred while loading service categories.");
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    setEditingService(null);
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    setEditingService(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingService(null);
  };

  return (
    <div className="admin-page-container">
      <AdminPageHeader
        eyebrow="Catalog"
        title="Services"
        description="Manage services menu items, details, pricing overrides, and availability."
        actions={
          !isEditing ? (
            <AdminButton onClick={handleCreateNew} size="sm" icon={<Plus size={14} />}>
              Add Service
            </AdminButton>
          ) : undefined
        }
      />

      {/* Sub-Navigation Tabs */}
      <AdminNavTabs />

      {/* Main Content Area */}
      <ServicesErrorBoundary>
        <div className="mt-4">
          {categoryError && (
            <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-semibold">{categoryError}</span>
                <button
                  type="button"
                  onClick={fetchCategories}
                  className="rounded-full bg-white px-4 py-2 text-[11px] font-bold text-amber-800 shadow-sm transition hover:bg-amber-100"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {isEditing ? (
            <ServiceForm
              categories={categories}
              initialData={editingService}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <ServiceTable
              categories={categories}
              onEdit={handleEdit}
              refreshTrigger={refreshTrigger}
              onRefreshNeeded={() => setRefreshTrigger((prev) => prev + 1)}
            />
          )}
        </div>
      </ServicesErrorBoundary>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { AdminNavTabs } from "@/components/admin/services/AdminNavTabs";
import { ServiceTable } from "@/components/admin/services/ServiceTable";
import { ServiceForm } from "@/components/admin/services/ServiceForm";
import { ServiceCategoryDTO } from "@/types/services";
import { Gem, Plus } from "lucide-react";

export default function AdminServicesPage() {
  const [categories, setCategories] = useState<ServiceCategoryDTO[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/service-categories");
      if (res.ok) {
        const json = await res.json();
        setCategories(json.data || []);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
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
    <div className="admin-page font-sans text-left p-6">
      {/* Page Header */}
      <section className="admin-section-heading flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-aera-ink flex items-center gap-2 font-heading leading-snug mb-1.5">
            <Gem size={24} className="text-aera-accent" />
            Services Management
          </h1>
          <p className="text-xs text-aera-muted">
            Manage services menu items, details, pricing overrides, and availability.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleCreateNew}
            className="bg-aera-accent hover:bg-aera-accentHover text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 border-none cursor-pointer shadow"
          >
            <Plus size={14} />
            <span>Add Service</span>
          </button>
        )}
      </section>

      {/* Sub-Navigation Tabs */}
      <AdminNavTabs />

      {/* Main Content Area */}
      <div className="mt-4">
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
    </div>
  );
}

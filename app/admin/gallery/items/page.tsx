"use client";
import React, { useState, useEffect } from "react";
import { AdminGalleryNavTabs } from "@/components/admin/gallery/AdminGalleryNavTabs";
import { AdminGalleryTable } from "@/components/admin/gallery/AdminGalleryTable";
import { GalleryItemForm } from "@/components/admin/gallery/GalleryItemForm";
import { GalleryCategoryDTO } from "@/types/gallery";
import { Image as ImageIcon, Plus } from "lucide-react";

export default function AdminGalleryItemsPage() {
  const [categories, setCategories] = useState<GalleryCategoryDTO[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/gallery-categories");
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
    setEditingItem(null);
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    setEditingItem(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingItem(null);
  };

  return (
    <div className="admin-page font-sans text-left p-6">
      {/* Header */}
      <section className="admin-section-heading flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-aera-ink flex items-center gap-2 font-heading leading-snug mb-1.5">
            <ImageIcon size={24} className="text-aera-accent" />
            Gallery Design Items
          </h1>
          <p className="text-xs text-aera-muted">
            Manage individual nail designs, apply tags, and adjust highlight layouts.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleCreateNew}
            className="bg-aera-accent hover:bg-aera-accentHover text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 border-none cursor-pointer shadow"
          >
            <Plus size={14} />
            <span>Add Design</span>
          </button>
        )}
      </section>

      {/* Nav tabs */}
      <AdminGalleryNavTabs />

      {/* Content */}
      <div className="mt-4">
        {isEditing ? (
          <GalleryItemForm
            categories={categories}
            initialData={editingItem}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <AdminGalleryTable
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

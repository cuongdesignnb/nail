"use client";
import React from "react";
import { AdminGalleryNavTabs } from "@/components/admin/gallery/AdminGalleryNavTabs";
import { GalleryCollectionForm } from "@/components/admin/gallery/GalleryCollectionForm";
import { Layers } from "lucide-react";

export default function AdminCollectionsPage() {
  return (
    <div className="admin-page font-sans text-left p-6">
      {/* Header */}
      <section className="admin-section-heading mb-6">
        <h1 className="text-2xl font-bold text-aera-ink flex items-center gap-2 font-heading leading-snug mb-1.5">
          <Layers size={24} className="text-aera-accent" />
          Featured Nail Collections
        </h1>
        <p className="text-xs text-aera-muted">
          Group nail designs into curated collections showing at the top of the gallery page.
        </p>
      </section>

      {/* Tabs */}
      <AdminGalleryNavTabs />

      {/* Content */}
      <div className="mt-4">
        <GalleryCollectionForm />
      </div>
    </div>
  );
}

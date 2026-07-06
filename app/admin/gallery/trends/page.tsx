"use client";
import React from "react";
import { AdminGalleryNavTabs } from "@/components/admin/gallery/AdminGalleryNavTabs";
import { GalleryTrendForm } from "@/components/admin/gallery/GalleryTrendForm";
import { Sparkles } from "lucide-react";

export default function AdminTrendsPage() {
  return (
    <div className="admin-page font-sans text-left p-6">
      {/* Header */}
      <section className="admin-section-heading mb-6">
        <h1 className="text-2xl font-bold text-[var(--admin-ink)] flex items-center gap-2 font-heading leading-snug mb-1.5">
          <Sparkles size={24} className="text-[var(--admin-accent)]" />
          Trending Inspirations
        </h1>
        <p className="text-xs text-[var(--admin-muted)]">
          Manage quick trend badges displayed in the &quot;Trending Inspirations&quot; horizontal scroll block.
        </p>
      </section>

      {/* Tabs */}
      <AdminGalleryNavTabs />

      {/* Content */}
      <div className="mt-4">
        <GalleryTrendForm />
      </div>
    </div>
  );
}

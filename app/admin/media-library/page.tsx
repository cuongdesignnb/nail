"use client";
import React, { useState } from "react";
import { AdminBlogNavTabs } from "@/components/admin/blog/AdminBlogNavTabs";
import { MediaLibraryGrid } from "@/components/admin/media-library/MediaLibraryGrid";
import { MediaUploadForm } from "@/components/admin/media-library/MediaUploadForm";
import { Image as ImageIcon } from "lucide-react";

export default function AdminMediaLibraryPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="admin-page font-sans text-left p-6">
      {/* Header */}
      <section className="admin-section-heading mb-6">
        <h1 className="text-2xl font-bold text-[var(--admin-ink)] flex items-center gap-2 font-heading leading-snug mb-1.5">
          <ImageIcon size={24} className="text-[var(--admin-accent)]" />
          Media Library Hub
        </h1>
        <p className="text-xs text-[var(--admin-muted)]">
          Upload, organize, and browse reusable media assets for blog posts and pages.
        </p>
      </section>

      {/* Nav Tabs */}
      <AdminBlogNavTabs />

      <div className="space-y-8 mt-4">
        {/* Upload/Register Form */}
        <MediaUploadForm onSuccess={handleUploadSuccess} />

        {/* Media Explorer Grid */}
        <MediaLibraryGrid
          refreshTrigger={refreshTrigger}
          onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
        />
      </div>
    </div>
  );
}

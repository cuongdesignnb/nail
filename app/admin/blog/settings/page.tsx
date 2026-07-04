"use client";
import React from "react";
import { AdminBlogNavTabs } from "@/components/admin/blog/AdminBlogNavTabs";
import { BlogSettingsForm } from "@/components/admin/blog/BlogSettingsForm";
import { Settings } from "lucide-react";

export default function AdminBlogSettingsPage() {
  return (
    <div className="admin-page font-sans text-left p-6">
      {/* Header */}
      <section className="admin-section-heading mb-6">
        <h1 className="text-2xl font-bold text-aera-ink flex items-center gap-2 font-heading leading-snug mb-1.5">
          <Settings size={24} className="text-aera-accent" />
          Journal Page Settings
        </h1>
        <p className="text-xs text-aera-muted">
          Adjust Hero banner headlines, newsletter descriptions, contact details, and SEO metadata.
        </p>
      </section>

      {/* Nav Tabs */}
      <AdminBlogNavTabs />

      {/* Form content */}
      <div className="mt-4">
        <BlogSettingsForm />
      </div>
    </div>
  );
}

"use client";
import React from "react";
import { AdminBlogNavTabs } from "@/components/admin/blog/AdminBlogNavTabs";
import { BlogCategoryForm } from "@/components/admin/blog/BlogCategoryForm";
import { Layers } from "lucide-react";

export default function AdminBlogCategoriesPage() {
  return (
    <div className="admin-page font-sans text-left p-6">
      {/* Header */}
      <section className="admin-section-heading mb-6">
        <h1 className="text-2xl font-bold text-aera-ink flex items-center gap-2 font-heading">
          <Layers size={24} className="text-aera-accent" />
          Category Tabs
        </h1>
        <p className="text-xs text-aera-muted mt-1">
          Manage visual navigation categories and filter labels.
        </p>
      </section>

      {/* Nav Tabs */}
      <AdminBlogNavTabs />

      {/* Category CRUD */}
      <div className="mt-4">
        <BlogCategoryForm />
      </div>
    </div>
  );
}

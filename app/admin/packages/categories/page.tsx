"use client";
import React from "react";
import { AdminPackagesNavTabs } from "@/components/admin/packages/AdminPackagesNavTabs";
import { PackageCategoryForm } from "@/components/admin/packages/PackageCategoryForm";
import { Layers } from "lucide-react";

export default function AdminPackageCategoriesPage() {
  return (
    <div className="admin-page font-sans text-left p-6">
      {/* Header */}
      <section className="admin-section-heading mb-6">
        <h1 className="text-2xl font-bold text-[var(--admin-ink)] flex items-center gap-2 font-heading leading-snug mb-1.5">
          <Layers size={24} className="text-[var(--admin-accent)]" />
          Package Category Tabs
        </h1>
        <p className="text-xs text-[var(--admin-muted)]">
          Manage filter tabs displayed on the public packages page.
        </p>
      </section>

      {/* Tabs */}
      <AdminPackagesNavTabs />

      {/* Categories CRUD block */}
      <div className="mt-4">
        <PackageCategoryForm />
      </div>
    </div>
  );
}

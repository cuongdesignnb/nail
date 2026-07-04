"use client";
import React from "react";
import { AdminPackagesNavTabs } from "@/components/admin/packages/AdminPackagesNavTabs";
import { PackageComparisonForm } from "@/components/admin/packages/PackageComparisonForm";
import { ClipboardList } from "lucide-react";

export default function AdminPackageComparisonPage() {
  return (
    <div className="admin-page font-sans text-left p-6">
      {/* Header */}
      <section className="admin-section-heading mb-6">
        <h1 className="text-2xl font-bold text-aera-ink flex items-center gap-2 font-heading leading-snug mb-1.5">
          <ClipboardList size={24} className="text-aera-accent" />
          Comparison Table
        </h1>
        <p className="text-xs text-aera-muted">
          Manage feature rows inside the comparison table.
        </p>
      </section>

      {/* Tabs */}
      <AdminPackagesNavTabs />

      {/* Comparison CRUD block */}
      <div className="mt-4">
        <PackageComparisonForm />
      </div>
    </div>
  );
}

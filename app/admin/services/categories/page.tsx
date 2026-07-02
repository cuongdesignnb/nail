"use client";
import React from "react";
import { AdminNavTabs } from "@/components/admin/services/AdminNavTabs";
import { ServiceCategoryForm } from "@/components/admin/services/ServiceCategoryForm";
import { Layers } from "lucide-react";

export default function AdminCategoriesPage() {
  return (
    <div className="admin-page font-sans text-left p-6">
      {/* Page Header */}
      <section className="admin-section-heading mb-6">
        <h1 className="text-2xl font-bold text-aera-ink flex items-center gap-2 font-heading">
          <Layers size={24} className="text-aera-accent" />
          Service Categories
        </h1>
        <p className="text-xs text-aera-muted mt-1">
          Group nail treatments into categories like Manicure, Pedicure, and Gel Polish.
        </p>
      </section>

      {/* Sub-Navigation Tabs */}
      <AdminNavTabs />

      {/* Main Content Area */}
      <div className="mt-4">
        <ServiceCategoryForm />
      </div>
    </div>
  );
}

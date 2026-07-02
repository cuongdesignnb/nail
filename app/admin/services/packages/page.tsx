"use client";
import React from "react";
import { AdminNavTabs } from "@/components/admin/services/AdminNavTabs";
import { ServicePackageForm } from "@/components/admin/services/ServicePackageForm";
import { Package } from "lucide-react";

export default function AdminPackagesPage() {
  return (
    <div className="admin-page font-sans text-left p-6">
      {/* Page Header */}
      <section className="admin-section-heading mb-6">
        <h1 className="text-2xl font-bold text-aera-ink flex items-center gap-2 font-heading">
          <Package size={24} className="text-aera-accent" />
          Membership Packages
        </h1>
        <p className="text-xs text-aera-muted mt-1">
          Configure multi-treatment bundles and loyalty pricing tiers.
        </p>
      </section>

      {/* Sub-Navigation Tabs */}
      <AdminNavTabs />

      {/* Main Content Area */}
      <div className="mt-4">
        <ServicePackageForm />
      </div>
    </div>
  );
}

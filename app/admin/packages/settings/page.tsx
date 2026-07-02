"use client";
import React from "react";
import { AdminPackagesNavTabs } from "@/components/admin/packages/AdminPackagesNavTabs";
import { PackageSettingsForm } from "@/components/admin/packages/PackageSettingsForm";
import { Settings } from "lucide-react";

export default function AdminPackageSettingsPage() {
  return (
    <div className="admin-page font-sans text-left p-6">
      {/* Header */}
      <section className="admin-section-heading mb-6">
        <h1 className="text-2xl font-bold text-aera-ink flex items-center gap-2 font-heading">
          <Settings size={24} className="text-aera-accent" />
          Packages Page Settings
        </h1>
        <p className="text-xs text-aera-muted mt-1">
          Adjust Hero banner headlines, SEO text metadata, contact details, and benefits copy.
        </p>
      </section>

      {/* Tabs */}
      <AdminPackagesNavTabs />

      {/* Settings Form block */}
      <div className="mt-4">
        <PackageSettingsForm />
      </div>
    </div>
  );
}

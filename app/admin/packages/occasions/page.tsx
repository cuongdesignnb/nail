"use client";
import React from "react";
import { AdminPackagesNavTabs } from "@/components/admin/packages/AdminPackagesNavTabs";
import { PackageOccasionForm } from "@/components/admin/packages/PackageOccasionForm";
import { Compass } from "lucide-react";

export default function AdminPackageOccasionsPage() {
  return (
    <div className="admin-page font-sans text-left p-6">
      {/* Header */}
      <section className="admin-section-heading mb-6">
        <h1 className="text-2xl font-bold text-aera-ink flex items-center gap-2 font-heading leading-snug mb-1.5">
          <Compass size={24} className="text-aera-accent" />
          Occasion Cards
        </h1>
        <p className="text-xs text-aera-muted">
          Manage beautiful occasion cards (e.g. Bridal Prep, Self-Care Day) shown in the footer grids.
        </p>
      </section>

      {/* Tabs */}
      <AdminPackagesNavTabs />

      {/* Occasions CRUD block */}
      <div className="mt-4">
        <PackageOccasionForm />
      </div>
    </div>
  );
}

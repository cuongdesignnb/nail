"use client";
import React from "react";
import { AdminPackagesNavTabs } from "@/components/admin/packages/AdminPackagesNavTabs";
import { PackageRewardForm } from "@/components/admin/packages/PackageRewardForm";
import { Gem } from "lucide-react";

export default function AdminPackageRewardsPage() {
  return (
    <div className="admin-page font-sans text-left p-6">
      {/* Header */}
      <section className="admin-section-heading mb-6">
        <h1 className="text-2xl font-bold text-[var(--admin-ink)] flex items-center gap-2 font-heading leading-snug mb-1.5">
          <Gem size={24} className="text-[var(--admin-accent)]" />
          Loyalty Perks & Promos
        </h1>
        <p className="text-xs text-[var(--admin-muted)]">
          Manage member rewards, discount perks, and side promotional cards.
        </p>
      </section>

      {/* Tabs */}
      <AdminPackagesNavTabs />

      {/* Rewards CRUD block */}
      <div className="mt-4">
        <PackageRewardForm />
      </div>
    </div>
  );
}

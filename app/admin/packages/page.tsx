"use client";
import React, { useState, useEffect } from "react";
import { AdminPackagesNavTabs } from "@/components/admin/packages/AdminPackagesNavTabs";
import { Gift, Layers, ClipboardList, Gem, Compass, Plus, Star } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AdminPageHeader } from "@/components/admin/ui";

export default function AdminPackagesDashboard() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    packages: 0,
    categories: 0,
    rewards: 0,
    occasions: 0,
  });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // 1. Fetch Packages count
      const resPkgs = await fetch("/api/admin/nail-packages?limit=5");
      let pkgsCount = 0;
      if (resPkgs.ok) {
        const json = await resPkgs.json();
        pkgsCount = json.pagination?.total || 0;
        setRecent(json.data || []);
      }

      // 2. Fetch Categories count
      const resCats = await fetch("/api/admin/package-categories");
      let catsCount = 0;
      if (resCats.ok) {
        const json = await resCats.json();
        catsCount = (json.data || []).length;
      }

      // 3. Fetch Rewards count
      const resRews = await fetch("/api/admin/package-rewards");
      let rewsCount = 0;
      if (resRews.ok) {
        const json = await resRews.json();
        rewsCount = (json.data || []).length;
      }

      // 4. Fetch Occasions count
      const resOccs = await fetch("/api/admin/package-occasions");
      let occsCount = 0;
      if (resOccs.ok) {
        const json = await resOccs.json();
        occsCount = (json.data || []).length;
      }

      setStats({
        packages: pkgsCount,
        categories: catsCount,
        rewards: rewsCount,
        occasions: occsCount,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Packages", count: stats.packages, icon: Gift, color: "text-[var(--admin-accent)] bg-[var(--admin-accent)]/10" },
    { label: "Category Tabs", count: stats.categories, icon: Layers, color: "text-amber-600 bg-amber-50" },
    { label: "Loyalty Perks", count: stats.rewards, icon: Gem, color: "text-emerald-600 bg-emerald-50" },
    { label: "Occasion Cards", count: stats.occasions, icon: Compass, color: "text-indigo-600 bg-indigo-50" },
  ];

  return (
    <div className="admin-page-container">
      <AdminPageHeader
        eyebrow="Catalog"
        title="Nail Packages Manager"
        description="Configure premium nail combo packages, compare layouts, and manage custom membership perks."
      />

      {/* Nav tabs */}
      <AdminPackagesNavTabs />

      {loading ? (
        <p className="text-xs text-[var(--admin-muted)] italic py-10 text-center">Loading dashboard metrics...</p>
      ) : (
        <div className="space-y-8 mt-4">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-[var(--admin-border)]/45 shadow-sm flex items-center gap-4 hover:shadow-luxury transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${card.color}`}>
                    <IconComp size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] text-[var(--admin-muted)] uppercase tracking-wider font-semibold">
                      {card.label}
                    </h4>
                    <span className="text-xl font-bold text-[var(--admin-ink)] block mt-0.5">{card.count}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Recent list */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[var(--admin-border)]/45 shadow-luxury">
              <div className="flex justify-between items-center mb-6 border-b border-[var(--admin-border)] pb-3">
                <h3 className="font-heading text-sm font-normal text-[var(--admin-ink)]">Recent Packages</h3>
                <Link
                  href="/admin/packages/items"
                  className="text-[10px] font-bold text-[var(--admin-accent)] hover:underline uppercase tracking-wider decoration-none"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {recent.map((pkg) => (
                  <div key={pkg.id} className="flex justify-between items-center py-2 border-b border-[var(--admin-border)]/10 last:border-none">
                    <div className="text-left">
                      <h4 className="font-semibold text-xs text-[var(--admin-ink)]">{pkg.name}</h4>
                      <span className="text-[9px] text-[var(--admin-muted)] uppercase tracking-wider">
                        {pkg.category?.name || "Uncategorized"} • {pkg.durationLabel || pkg.visitCountLabel || "no duration"}
                      </span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="text-xs font-bold text-[var(--admin-accent)]">{pkg.priceLabel}</span>
                      <StatusBadge active={pkg.isActive} />
                    </div>
                  </div>
                ))}
                {recent.length === 0 && (
                  <p className="text-xs text-[var(--admin-muted)] italic py-6 text-center">No packages added yet.</p>
                )}
              </div>
            </div>

            {/* Quick action shortcuts */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[var(--admin-border)]/45 shadow-luxury self-start">
              <h3 className="font-heading text-sm font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border)] pb-3">
                Quick Shortcuts
              </h3>
              <div className="flex flex-col gap-3">
                <Link
                  href="/admin/packages/items?action=new"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[var(--admin-accent)] hover:bg-[var(--admin-accent)]Hover text-white py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 decoration-none shadow-sm"
                >
                  <Plus size={14} />
                  <span>Create Package</span>
                </Link>
                <Link
                  href="/admin/content-settings?pageKey=packages"
                  className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-[var(--admin-surface-hover)] text-[var(--admin-muted)] border border-[var(--admin-border-strong)] py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 decoration-none"
                >
                  <Star size={14} className="text-[var(--admin-accent)]" />
                  <span>Manage FAQs & Reviews</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { AdminGalleryNavTabs } from "@/components/admin/gallery/AdminGalleryNavTabs";
import { Image as ImageIcon, Layers, Sparkles, Star, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/common/StatusBadge";
import NextImage from "next/image";
import { AdminPageHeader } from "@/components/admin/ui";

export default function AdminGalleryDashboard() {
  const [stats, setStats] = useState({
    items: 0,
    collections: 0,
    categories: 0,
    testimonials: 0,
  });
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch items to get count and recent items
      const resItems = await fetch("/api/admin/gallery-items?limit=5");
      let itemsCount = 0;
      if (resItems.ok) {
        const json = await resItems.json();
        setRecentItems(json.data || []);
        itemsCount = json.meta?.total || 0;
      }

      // 2. Fetch categories count
      const resCats = await fetch("/api/admin/gallery-categories");
      let catsCount = 0;
      if (resCats.ok) {
        const json = await resCats.json();
        catsCount = (json.data || []).length;
      }

      // 3. Fetch collections count
      const resCols = await fetch("/api/admin/gallery-collections");
      let colsCount = 0;
      if (resCols.ok) {
        const json = await resCols.json();
        colsCount = (json.data || []).length;
      }

      // 4. Fetch testimonials count
      const resTests = await fetch("/api/admin/gallery-testimonials");
      let testsCount = 0;
      if (resTests.ok) {
        const json = await resTests.json();
        testsCount = (json.data || []).length;
      }

      setStats({
        items: itemsCount,
        collections: colsCount,
        categories: catsCount,
        testimonials: testsCount,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Gallery Designs", count: stats.items, icon: ImageIcon, color: "text-[var(--admin-accent)] bg-[var(--admin-accent)]/10" },
    { label: "Curated Collections", count: stats.collections, icon: Layers, color: "text-amber-600 bg-amber-50" },
    { label: "Art Categories", count: stats.categories, icon: Sparkles, color: "text-emerald-600 bg-emerald-50" },
    { label: "Client Testimonials", count: stats.testimonials, icon: Star, color: "text-[var(--admin-warning)] bg-[var(--admin-warning)]/10" },
  ];

  return (
    <div className="admin-page-container">
      <AdminPageHeader
        title="Nail Art Gallery Manager"
        eyebrow="Website"
        description="Publish nail designs, configure collections, and manage inspiration trends."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Gallery" },
        ]}
      />

      {/* Navigation tabs */}
      <AdminGalleryNavTabs />

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
                  className="bg-white rounded-3xl p-6 border border-[var(--admin-border)]/45 shadow-sm flex items-center gap-4"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${card.color}`}>
                    <IconComp size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] text-[var(--admin-muted)] uppercase tracking-wider font-semibold">
                      {card.label}
                    </h4>
                    <p className="text-2xl font-bold text-[var(--admin-ink)] mt-0.5 leading-none">{card.count}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions & Recent Uploads */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Recent Uploads */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 border border-[var(--admin-border)]/45 shadow-luxury">
              <h3 className="font-heading text-lg font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border-strong)] pb-3">
                Recently Added Designs
              </h3>

              {recentItems.length === 0 ? (
                <p className="text-xs text-[var(--admin-muted)] italic py-6">No designs uploaded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans text-[var(--admin-ink)]">
                    <thead>
                      <tr className="bg-[var(--admin-surface-muted)] border-b border-[var(--admin-border-strong)] text-[var(--admin-ink)] font-semibold">
                        <th className="px-4 py-3">Image</th>
                        <th className="px-4 py-3">Title / Tag</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentItems.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-surface-hover)] transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[var(--admin-surface-muted)] border border-[var(--admin-border)]">
                              <NextImage src={item.image} alt={item.title} fill className="object-cover" />
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-[var(--admin-ink)]">
                            <div>
                              <div>{item.title}</div>
                              {item.tag && <div className="text-[8px] text-[var(--admin-accent)] mt-0.5 uppercase">{item.tag}</div>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[var(--admin-muted)]">{item.category?.name || "None"}</td>
                          <td className="px-4 py-3">
                            <StatusBadge active={item.isActive} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Quick Actions Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-[var(--admin-border)]/45 shadow-luxury">
                <h3 className="font-heading text-base font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border-strong)] pb-3">
                  Quick Actions
                </h3>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/admin/gallery/items"
                    className="flex items-center gap-2 px-4 py-3 bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] text-white text-xs font-semibold rounded-2xl cursor-pointer border-none shadow-sm transition decoration-none justify-center"
                  >
                    <Plus size={14} />
                    <span>Upload New Nail Design</span>
                  </Link>

                  <Link
                    href="/admin/gallery/collections"
                    className="flex items-center gap-2 px-4 py-3 bg-[var(--admin-surface-hover)] hover:bg-[var(--admin-surface-hover)] text-[var(--admin-accent)] text-xs font-semibold rounded-2xl cursor-pointer border-none transition decoration-none justify-center"
                  >
                    <Layers size={14} />
                    <span>Manage Collections</span>
                  </Link>

                  <Link
                    href="/admin/gallery/settings"
                    className="flex items-center gap-2 px-4 py-3 bg-[var(--admin-surface-hover)] hover:bg-[var(--admin-surface-hover)] text-[var(--admin-accent)] text-xs font-semibold rounded-2xl cursor-pointer border-none transition decoration-none justify-center"
                  >
                    <Settings size={14} />
                    <span>Customize Gallery Text</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

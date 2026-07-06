"use client";
import React, { useState, useEffect } from "react";
import { AdminBlogNavTabs } from "@/components/admin/blog/AdminBlogNavTabs";
import { FileText, Layers, Clock, ShieldAlert, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { AdminPageHeader } from "@/components/admin/ui";

export default function AdminBlogDashboard() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    scheduled: 0,
    categories: 0,
  });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const resPosts = await fetch("/api/admin/blog-posts?limit=5");
      let total = 0, published = 0, drafts = 0, scheduled = 0;
      if (resPosts.ok) {
        const json = await resPosts.json();
        total = json.pagination?.total || 0;
        setRecent(json.data || []);
      }

      // Count statuses
      const [resPublished, resDrafts, resScheduled, resCats] = await Promise.all([
        fetch("/api/admin/blog-posts?status=PUBLISHED&limit=1"),
        fetch("/api/admin/blog-posts?status=DRAFT&limit=1"),
        fetch("/api/admin/blog-posts?status=SCHEDULED&limit=1"),
        fetch("/api/admin/blog-categories"),
      ]);

      if (resPublished.ok) published = (await resPublished.json()).pagination?.total || 0;
      if (resDrafts.ok) drafts = (await resDrafts.json()).pagination?.total || 0;
      if (resScheduled.ok) scheduled = (await resScheduled.json()).pagination?.total || 0;
      
      let categories = 0;
      if (resCats.ok) {
        categories = ((await resCats.json()).data || []).length;
      }

      setStats({ total, published, drafts, scheduled, categories });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Articles", count: stats.total, icon: FileText, color: "text-[var(--admin-accent)] bg-[var(--admin-accent)]/10" },
    { label: "Published", count: stats.published, icon: Sparkles, color: "text-emerald-600 bg-emerald-50" },
    { label: "Scheduled / Due", count: stats.scheduled, icon: Clock, color: "text-indigo-600 bg-indigo-50" },
    { label: "Drafts / Pending", count: stats.drafts, icon: ShieldAlert, color: "text-amber-600 bg-amber-50" },
  ];

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="admin-page-container">
      <AdminPageHeader
        title="Journal Dashboard"
        eyebrow="Website"
        description="Monitor your publication schedule, categories, and reader reviews dynamically."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Blog" },
        ]}
      />

      {/* Nav Tabs */}
      <AdminBlogNavTabs />

      {loading ? (
        <p className="text-xs text-[var(--admin-muted)] italic py-10 text-center">Loading dashboard metrics...</p>
      ) : (
        <div className="space-y-8 mt-4">
          {/* Stats Cards */}
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

          {/* Details split grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Recent Posts log */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[var(--admin-border)]/45 shadow-luxury">
              <div className="flex justify-between items-center mb-6 border-b border-[var(--admin-border)] pb-3">
                <h3 className="font-heading text-sm font-normal text-[var(--admin-ink)]">Recent Articles</h3>
                <Link
                  href="/admin/blog/posts"
                  className="text-[10px] font-bold text-[var(--admin-accent)] hover:underline uppercase tracking-wider decoration-none"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {recent.map((post) => (
                  <div key={post.id} className="flex justify-between items-center py-2 border-b border-[var(--admin-border)]/10 last:border-none">
                    <div className="text-left max-w-[70%]">
                      <h4 className="font-semibold text-xs text-[var(--admin-ink)] truncate">{post.title}</h4>
                      <span className="text-[9px] text-[var(--admin-muted)] uppercase tracking-wider">
                        {post.category?.name || "Uncategorized"} • {formatDate(post.publishedAt || post.createdAt)}
                      </span>
                    </div>
                    <span className={clsx("px-2 py-0.5 rounded-full text-[8px] font-bold shrink-0", {
                      "bg-amber-100 text-amber-700": post.status === "DRAFT",
                      "bg-emerald-100 text-emerald-700": post.status === "PUBLISHED",
                      "bg-indigo-100 text-indigo-700": post.status === "SCHEDULED",
                    })}>
                      {post.status}
                    </span>
                  </div>
                ))}
                {recent.length === 0 && (
                  <p className="text-xs text-[var(--admin-muted)] italic py-6 text-center">No articles written yet.</p>
                )}
              </div>
            </div>

            {/* Actions shortcuts panel */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[var(--admin-border)]/45 shadow-luxury self-start space-y-4">
              <h3 className="font-heading text-sm font-normal text-[var(--admin-ink)] border-b border-[var(--admin-border)] pb-3">
                Quick Actions
              </h3>
              <div className="flex flex-col gap-3">
                <Link
                  href="/admin/blog/posts?action=new"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[var(--admin-accent)] hover:bg-[var(--admin-accent)]Hover text-white py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 decoration-none shadow-sm"
                >
                  <Plus size={14} />
                  <span>Compose Entry</span>
                </Link>
                <Link
                  href="/admin/content-settings?pageKey=blog"
                  className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-[var(--admin-surface-hover)] text-[var(--admin-muted)] border border-[var(--admin-border-strong)] py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 decoration-none"
                >
                  <Sparkles size={14} className="text-[var(--admin-accent)]" />
                  <span>Manage Reader Reviews</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

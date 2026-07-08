"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Mail, Pencil, Plus, Tags, Trash2, Users } from "lucide-react";
import { AdminConfirmDialog, AdminEmptyState, AdminLoadingState, AdminPageHeader, AdminTableShell } from "@/components/admin/ui";

type Campaign = {
  id: string;
  title: string;
  badge?: string | null;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "EXPIRED";
  popupEnabled: boolean;
  showOnHomepage: boolean;
  startDate?: string | null;
  endDate?: string | null;
  _count?: { leads: number; vouchers: number };
};

function chipClass(status: string) {
  if (status === "ACTIVE") return "bg-emerald-50 text-emerald-700";
  if (status === "PAUSED") return "bg-amber-50 text-amber-700";
  if (status === "EXPIRED") return "bg-red-50 text-red-700";
  return "bg-gray-50 text-gray-600";
}

function dateLabel(value?: string | null) {
  return value ? new Date(value).toLocaleDateString() : "-";
}

export default function AdminPromotionsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/promotions", { cache: "no-store" });
      const json = await res.json();
      if (json.success) setCampaigns(json.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete() {
    if (!deleteId) return;
    await fetch(`/api/admin/promotions/${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    load();
  }

  const columns = [
    { key: "campaign", label: "Campaign" },
    { key: "badge", label: "Badge" },
    { key: "status", label: "Status" },
    { key: "popup", label: "Popup" },
    { key: "home", label: "Homepage" },
    { key: "claims", label: "Claims" },
    { key: "vouchers", label: "Vouchers" },
    { key: "start", label: "Start" },
    { key: "end", label: "End" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="admin-page-container">
      <AdminPageHeader
        eyebrow="Marketing"
        title="Promotion Campaigns"
        description="Manage homepage offers, scroll popups, voucher claims, and campaign email templates."
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Promotions" }]}
        actions={
          <>
            <button type="button" onClick={() => router.push("/admin/promotions/leads")} className="inline-flex items-center gap-2 rounded-full border border-[var(--admin-border-strong)] bg-white px-4 py-2 text-xs font-bold text-[var(--admin-ink)]">
              <Users className="h-3.5 w-3.5" />
              Leads
            </button>
            <button type="button" onClick={() => router.push("/admin/promotions/vouchers")} className="inline-flex items-center gap-2 rounded-full border border-[var(--admin-border-strong)] bg-white px-4 py-2 text-xs font-bold text-[var(--admin-ink)]">
              <Mail className="h-3.5 w-3.5" />
              Vouchers
            </button>
            <button type="button" onClick={() => router.push("/admin/promotions/new")} className="inline-flex items-center gap-2 rounded-full bg-[var(--admin-accent)] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white">
              <Plus className="h-3.5 w-3.5" />
              New Campaign
            </button>
          </>
        }
      />

      {loading ? (
        <AdminLoadingState variant="table" />
      ) : campaigns.length === 0 ? (
        <div className="rounded-2xl border border-[var(--admin-border)] bg-white">
          <AdminEmptyState icon={Tags} title="No campaigns yet" description="Create a campaign to show offers on the homepage and collect voucher leads." actionLabel="Create Campaign" onAction={() => router.push("/admin/promotions/new")} />
        </div>
      ) : (
        <AdminTableShell columns={columns}>
          {campaigns.map((campaign) => (
            <tr key={campaign.id} className="hover:bg-[var(--admin-surface-muted)]">
              <td className="px-5 py-3 text-xs font-semibold text-[var(--admin-ink)]">{campaign.title}</td>
              <td className="px-5 py-3 text-xs text-[var(--admin-muted)]">{campaign.badge || "-"}</td>
              <td className="px-5 py-3"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${chipClass(campaign.status)}`}>{campaign.status}</span></td>
              <td className="px-5 py-3 text-xs">{campaign.popupEnabled ? "Yes" : "No"}</td>
              <td className="px-5 py-3 text-xs">{campaign.showOnHomepage ? "Yes" : "No"}</td>
              <td className="px-5 py-3 text-xs font-semibold">{campaign._count?.leads ?? 0}</td>
              <td className="px-5 py-3 text-xs font-semibold">{campaign._count?.vouchers ?? 0}</td>
              <td className="px-5 py-3 text-xs text-[var(--admin-muted)]">{dateLabel(campaign.startDate)}</td>
              <td className="px-5 py-3 text-xs text-[var(--admin-muted)]">{dateLabel(campaign.endDate)}</td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => router.push(`/admin/promotions/${campaign.id}/edit`)} className="rounded-lg px-2 py-1 text-[10px] font-bold text-[var(--admin-ink)] hover:bg-[var(--admin-surface-muted)]"><Pencil className="inline h-3 w-3" /> Edit</button>
                  <button type="button" onClick={() => router.push(`/admin/promotions/leads?campaignId=${campaign.id}`)} className="rounded-lg px-2 py-1 text-[10px] font-bold text-[var(--admin-ink)] hover:bg-[var(--admin-surface-muted)]"><Eye className="inline h-3 w-3" /> Leads</button>
                  <button type="button" onClick={() => setDeleteId(campaign.id)} className="rounded-lg px-2 py-1 text-[10px] font-bold text-red-600 hover:bg-red-50"><Trash2 className="inline h-3 w-3" /></button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTableShell>
      )}

      <AdminConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Campaign" description="This will delete the campaign and its promotion leads/vouchers. Continue?" confirmLabel="Delete" variant="danger" />
    </div>
  );
}

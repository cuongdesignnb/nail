"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Mail, RefreshCw, Users } from "lucide-react";
import { AdminEmptyState, AdminLoadingState, AdminPageHeader, AdminTableShell } from "@/components/admin/ui";

type Lead = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  emailStatus: string;
  createdAt: string;
  campaign: { title: string };
  voucherCode?: { code: string } | null;
};

function statusClass(status: string) {
  if (status === "SENT") return "bg-emerald-50 text-emerald-700";
  if (status === "FAILED") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
}

function PromotionLeadsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const campaignId = params.get("campaignId");
    const res = await fetch(`/api/admin/promotions/leads${campaignId ? `?campaignId=${campaignId}` : ""}`, { cache: "no-store" });
    const json = await res.json();
    if (json.success) setLeads(json.data || []);
    setLoading(false);
  }, [params]);

  useEffect(() => {
    load();
  }, [load]);

  async function resend(id: string) {
    await fetch(`/api/admin/promotions/leads/${id}/resend`, { method: "POST" });
    load();
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "campaign", label: "Campaign" },
    { key: "voucher", label: "Voucher" },
    { key: "emailStatus", label: "Email Status" },
    { key: "created", label: "Created" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="admin-page-container">
      <AdminPageHeader
        eyebrow="Promotions"
        title="Promotion Leads"
        description="Review voucher claims and resend voucher emails when SMTP delivery fails."
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Promotions", href: "/admin/promotions" }, { label: "Leads" }]}
        actions={
          <button type="button" onClick={() => router.push("/admin/promotions")} className="inline-flex items-center gap-2 rounded-full border border-[var(--admin-border-strong)] bg-white px-4 py-2 text-xs font-bold text-[var(--admin-ink)]">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        }
      />
      {loading ? (
        <AdminLoadingState variant="table" />
      ) : leads.length === 0 ? (
        <div className="rounded-2xl border border-[var(--admin-border)] bg-white">
          <AdminEmptyState icon={Users} title="No leads yet" description="Voucher claims will appear here." />
        </div>
      ) : (
        <AdminTableShell columns={columns}>
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-[var(--admin-surface-muted)]">
              <td className="px-5 py-3 text-xs font-semibold text-[var(--admin-ink)]">{lead.fullName}</td>
              <td className="px-5 py-3 text-xs text-[var(--admin-muted)]">{lead.email}</td>
              <td className="px-5 py-3 text-xs text-[var(--admin-muted)]">{lead.phone}</td>
              <td className="px-5 py-3 text-xs">{lead.campaign.title}</td>
              <td className="px-5 py-3 text-xs font-mono">{lead.voucherCode?.code || "-"}</td>
              <td className="px-5 py-3">
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClass(lead.emailStatus)}`}>{lead.emailStatus}</span>
              </td>
              <td className="px-5 py-3 text-xs text-[var(--admin-muted)]">{new Date(lead.createdAt).toLocaleString()}</td>
              <td className="px-5 py-3">
                <button type="button" onClick={() => resend(lead.id)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold text-[var(--admin-ink)] hover:bg-[var(--admin-surface-muted)]">
                  {lead.emailStatus === "FAILED" ? <RefreshCw className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                  Resend
                </button>
              </td>
            </tr>
          ))}
        </AdminTableShell>
      )}
    </div>
  );
}

export default function PromotionLeadsPage() {
  return (
    <Suspense fallback={<div className="admin-page-container">Loading promotion leads...</div>}>
      <PromotionLeadsContent />
    </Suspense>
  );
}

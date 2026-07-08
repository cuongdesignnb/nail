"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Ban, CheckCircle2, Ticket } from "lucide-react";
import { AdminEmptyState, AdminLoadingState, AdminPageHeader, AdminTableShell } from "@/components/admin/ui";

type Voucher = {
  id: string;
  code: string;
  status: string;
  discountType: string;
  discountValue?: string | number | null;
  expiresAt?: string | null;
  usedAt?: string | null;
  campaign: { title: string };
  lead?: { fullName: string; email: string } | null;
};

function statusClass(status: string) {
  if (status === "ISSUED") return "bg-emerald-50 text-emerald-700";
  if (status === "USED") return "bg-gray-100 text-gray-700";
  if (status === "CANCELLED") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
}

function discount(voucher: Voucher) {
  if (voucher.discountType === "PERCENT") return `${Number(voucher.discountValue || 0)}%`;
  if (voucher.discountType === "FIXED_AMOUNT") return `$${Number(voucher.discountValue || 0)}`;
  return voucher.discountType.replace("_", " ");
}

export default function PromotionVouchersPage() {
  const router = useRouter();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/vouchers", { cache: "no-store" });
    const json = await res.json();
    if (json.success) setVouchers(json.data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function markUsed(id: string) {
    await fetch(`/api/admin/vouchers/${id}/mark-used`, { method: "POST" });
    load();
  }

  async function cancel(id: string) {
    await fetch(`/api/admin/vouchers/${id}/cancel`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason: "Cancelled by admin" }) });
    load();
  }

  const columns = [
    { key: "code", label: "Code" },
    { key: "campaign", label: "Campaign" },
    { key: "customer", label: "Customer" },
    { key: "discount", label: "Discount" },
    { key: "status", label: "Status" },
    { key: "expires", label: "Expires" },
    { key: "used", label: "Used At" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="admin-page-container">
      <AdminPageHeader
        eyebrow="Promotions"
        title="Voucher Codes"
        description="Manage issued promotion vouchers and manual redemption status."
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Promotions", href: "/admin/promotions" }, { label: "Vouchers" }]}
        actions={<button type="button" onClick={() => router.push("/admin/promotions")} className="inline-flex items-center gap-2 rounded-full border border-[var(--admin-border-strong)] bg-white px-4 py-2 text-xs font-bold text-[var(--admin-ink)]"><ArrowLeft className="h-3.5 w-3.5" />Back</button>}
      />
      {loading ? <AdminLoadingState variant="table" /> : vouchers.length === 0 ? (
        <div className="rounded-2xl border border-[var(--admin-border)] bg-white"><AdminEmptyState icon={Ticket} title="No vouchers yet" description="Issued vouchers will appear after customers claim campaigns." /></div>
      ) : (
        <AdminTableShell columns={columns}>
          {vouchers.map((voucher) => (
            <tr key={voucher.id} className="hover:bg-[var(--admin-surface-muted)]">
              <td className="px-5 py-3 text-xs font-mono font-semibold text-[var(--admin-ink)]">{voucher.code}</td>
              <td className="px-5 py-3 text-xs">{voucher.campaign.title}</td>
              <td className="px-5 py-3 text-xs text-[var(--admin-muted)]">{voucher.lead ? `${voucher.lead.fullName} (${voucher.lead.email})` : "-"}</td>
              <td className="px-5 py-3 text-xs">{discount(voucher)}</td>
              <td className="px-5 py-3"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClass(voucher.status)}`}>{voucher.status}</span></td>
              <td className="px-5 py-3 text-xs text-[var(--admin-muted)]">{voucher.expiresAt ? new Date(voucher.expiresAt).toLocaleDateString() : "-"}</td>
              <td className="px-5 py-3 text-xs text-[var(--admin-muted)]">{voucher.usedAt ? new Date(voucher.usedAt).toLocaleString() : "-"}</td>
              <td className="px-5 py-3">
                <div className="flex gap-1">
                  <button type="button" disabled={voucher.status !== "ISSUED"} onClick={() => markUsed(voucher.id)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold text-emerald-700 hover:bg-emerald-50 disabled:opacity-40"><CheckCircle2 className="h-3 w-3" />Used</button>
                  <button type="button" disabled={voucher.status !== "ISSUED"} onClick={() => cancel(voucher.id)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold text-red-600 hover:bg-red-50 disabled:opacity-40"><Ban className="h-3 w-3" />Cancel</button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTableShell>
      )}
    </div>
  );
}

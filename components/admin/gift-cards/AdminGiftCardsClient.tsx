"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BadgeDollarSign,
  Copy,
  CreditCard,
  DollarSign,
  Eye,
  Gift,
  Mail,
  MailWarning,
  MoreHorizontal,
  Plus,
  RotateCcw,
  XCircle,
} from "lucide-react";
import {
  AdminButton,
  AdminKpiCard,
  AdminPageHeader,
  AdminPagination,
} from "@/components/admin/ui";
import { adminRoutes } from "@/lib/admin/admin-routes";
import GiftCardEmptyState from "./GiftCardEmptyState";
import GiftCardFilters, { emptyGiftCardFilters, type GiftCardFilterState } from "./GiftCardFilters";

interface GiftCardRow {
  id: string;
  code: string;
  type: string;
  recipient: string;
  purchaser: string;
  value: string;
  remainingBalance: string;
  status: string;
  emailStatus: string;
  createdAt: string;
  orderNumber: string;
}

interface GiftCardKpis {
  salesToday: number;
  activeBalance: number;
  redeemedThisMonth: number;
  pendingEmail: number;
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);
}

const STATUS_MAP: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  ISSUED: { label: "Issued", dot: "bg-[var(--admin-success)]", bg: "bg-[var(--admin-success-soft)]", text: "text-[var(--admin-success)]" },
  PARTIALLY_REDEEMED: { label: "Partial", dot: "bg-[var(--admin-accent)]", bg: "bg-[var(--admin-accent-soft)]", text: "text-[var(--admin-accent)]" },
  REDEEMED: { label: "Redeemed", dot: "bg-[var(--admin-neutral)]", bg: "bg-[var(--admin-neutral-soft)]", text: "text-[var(--admin-neutral)]" },
  CANCELLED: { label: "Cancelled", dot: "bg-[var(--admin-danger)]", bg: "bg-[var(--admin-danger-soft)]", text: "text-[var(--admin-danger)]" },
  REFUNDED: { label: "Refunded", dot: "bg-[var(--admin-danger)]", bg: "bg-[var(--admin-danger-soft)]", text: "text-[var(--admin-danger)]" },
  EXPIRED: { label: "Expired", dot: "bg-[var(--admin-muted)]", bg: "bg-[var(--admin-surface-muted)]", text: "text-[var(--admin-muted)]" },
  PENDING: { label: "Pending", dot: "bg-[var(--admin-warning)]", bg: "bg-[var(--admin-warning-soft)]", text: "text-[var(--admin-warning)]" },
  SENT: { label: "Sent", dot: "bg-[var(--admin-success)]", bg: "bg-[var(--admin-success-soft)]", text: "text-[var(--admin-success)]" },
  FAILED: { label: "Failed", dot: "bg-[var(--admin-danger)]", bg: "bg-[var(--admin-danger-soft)]", text: "text-[var(--admin-danger)]" },
};

function StatusChip({ value }: { value: string }) {
  const config = STATUS_MAP[value] ?? {
    label: value.replace(/_/g, " "),
    dot: "bg-[var(--admin-muted)]",
    bg: "bg-[var(--admin-surface-muted)]",
    text: "text-[var(--admin-muted)]",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function RowActionMenu({ card, onAction }: { card: GiftCardRow; onAction: (action: string, card: GiftCardRow) => void }) {
  const [open, setOpen] = useState(false);
  const actions = [
    { key: "view", label: "View Details", icon: Eye },
    { key: "copy", label: "Copy Code", icon: Copy },
    { key: "resend", label: "Resend Email", icon: Mail },
    { key: "redeem", label: "Redeem", icon: CreditCard },
    ...(card.type === "AMOUNT" ? [{ key: "adjust", label: "Adjust Balance", icon: DollarSign }] : []),
    { key: "void", label: "Void", icon: XCircle, danger: true },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--admin-radius-sm)] text-[var(--admin-muted)] transition-colors hover:bg-[var(--admin-surface-hover)] hover:text-[var(--admin-ink)]"
        aria-label="Gift card actions"
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full z-40 mt-1 min-w-[180px] overflow-hidden rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-1.5 shadow-[var(--admin-shadow-lg)]"
          >
            {actions.map((action) => (
              <button
                key={action.key}
                onClick={() => { setOpen(false); onAction(action.key, card); }}
                className={`flex w-full items-center gap-2.5 rounded-[var(--admin-radius-sm)] px-3 py-2 text-[13px] transition-colors ${
                  "danger" in action && action.danger
                    ? "text-[var(--admin-danger)] hover:bg-[var(--admin-danger-soft)]"
                    : "text-[var(--admin-ink-secondary)] hover:bg-[var(--admin-surface-hover)] hover:text-[var(--admin-ink)]"
                }`}
              >
                <action.icon size={14} />
                {action.label}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}

function buildParams(filters: GiftCardFilterState) {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("search", filters.query.trim());
  if (filters.type !== "ALL") params.set("type", filters.type);
  if (filters.status !== "ALL") params.set("status", filters.status);
  if (filters.emailStatus !== "ALL") params.set("emailStatus", filters.emailStatus);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  return params;
}

function exportCsv(cards: GiftCardRow[]) {
  const headers = ["Code", "Recipient", "Purchaser", "Type", "Value", "Remaining", "Status", "Email", "Created", "Order"];
  const rows = cards.map((card) => [
    card.code,
    card.recipient,
    card.purchaser,
    card.type,
    card.value,
    card.remainingBalance,
    card.status,
    card.emailStatus,
    new Date(card.createdAt).toLocaleDateString(),
    card.orderNumber,
  ]);
  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `gift-cards-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function AdminGiftCardsClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<GiftCardRow[]>([]);
  const [kpis, setKpis] = useState<GiftCardKpis>({ salesToday: 0, activeBalance: 0, redeemedThisMonth: 0, pendingEmail: 0 });
  const [filters, setFilters] = useState<GiftCardFilterState>(emptyGiftCardFilters);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = buildParams(filters);
      const res = await fetch(`/api/admin/gift-cards?${params}`);
      if (res.status === 401) {
        window.location.href = "/login?next=/admin/gift-cards";
        return;
      }
      const json = await res.json();
      if (json.data) {
        setCards(json.data.cards || []);
        setKpis(json.data.kpis || { salesToday: 0, activeBalance: 0, redeemedThisMonth: 0, pendingEmail: 0 });
      }
    } catch {
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalCards = cards.length;
  const pagedCards = cards.slice((page - 1) * pageSize, page * pageSize);

  const handleAction = async (action: string, card: GiftCardRow) => {
    if (action === "view") {
      router.push(adminRoutes.giftCardDetail(card.id));
      return;
    }
    if (action === "copy") {
      await navigator.clipboard.writeText(card.code);
      return;
    }
    if (action === "resend") {
      await fetch(`/api/admin/gift-cards/${card.id}/resend`, { method: "POST" });
      fetchData();
      return;
    }
    if (action === "void") {
      if (confirm("Are you sure you want to void this gift card?")) {
        await fetch(`/api/admin/gift-cards/${card.id}/void`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
        fetchData();
      }
      return;
    }
    router.push(adminRoutes.giftCardDetail(card.id));
  };

  function updateFilters(next: GiftCardFilterState) {
    setFilters(next);
    setPage(1);
  }

  function clearFilters() {
    setFilters(emptyGiftCardFilters);
    setPage(1);
  }

  return (
    <div className="admin-page-container">
      <AdminPageHeader
        eyebrow="Commerce"
        title="Gift Cards"
        description="Manage purchases, balances and delivery status."
        actions={
          <AdminButton
            variant="primary"
            size="lg"
            icon={<Plus size={16} />}
            onClick={() => router.push(adminRoutes.newGiftCard)}
          >
            Issue Gift Card
          </AdminButton>
        }
      />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminKpiCard icon={<BadgeDollarSign size={20} />} label="Sales Today" value={money(kpis.salesToday)} loading={loading} />
        <AdminKpiCard icon={<Gift size={20} />} label="Active Balance" value={money(kpis.activeBalance)} loading={loading} />
        <AdminKpiCard icon={<RotateCcw size={20} />} label="Redeemed This Month" value={money(kpis.redeemedThisMonth)} loading={loading} />
        <AdminKpiCard icon={<MailWarning size={20} />} label="Pending Email" value={String(kpis.pendingEmail)} loading={loading} />
      </div>

      <GiftCardFilters
        value={filters}
        onChange={updateFilters}
        onClear={clearFilters}
        onExport={() => exportCsv(cards)}
        isLoading={loading}
      />

      <div className="overflow-hidden rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow-sm)]">
        {loading ? (
          <div className="p-6">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-12 animate-pulse rounded-[var(--admin-radius-sm)] bg-[var(--admin-surface-muted)]" />
              ))}
            </div>
          </div>
        ) : pagedCards.length === 0 ? (
          <GiftCardEmptyState onIssue={() => router.push(adminRoutes.newGiftCard)} />
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-surface-muted)]">
                    {["Code", "Recipient", "Purchaser", "Type", "Value", "Remaining", "Status", "Delivery", "Created", ""].map((heading) => (
                      <th key={heading} className="sticky top-0 z-10 bg-[var(--admin-surface-muted)] px-4 py-3 text-left text-[11px] font-extrabold uppercase tracking-wider text-[var(--admin-muted)]">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedCards.map((card, index) => (
                    <motion.tr
                      key={card.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-[var(--admin-border-muted)] transition-colors hover:bg-[var(--admin-surface-hover)]"
                    >
                      <td className="px-4 py-3.5 font-mono text-[13px] font-semibold text-[var(--admin-ink)]">{card.code}</td>
                      <td className="px-4 py-3.5 text-[13px] text-[var(--admin-ink)]">{card.recipient}</td>
                      <td className="px-4 py-3.5 text-[13px] text-[var(--admin-ink-secondary)]">{card.purchaser}</td>
                      <td className="px-4 py-3.5 text-[13px] text-[var(--admin-ink-secondary)]">{card.type}</td>
                      <td className="px-4 py-3.5 text-[13px] font-bold text-[var(--admin-ink)]">{card.value}</td>
                      <td className="px-4 py-3.5 text-[13px] font-bold text-[var(--admin-accent)]">{card.remainingBalance}</td>
                      <td className="px-4 py-3.5"><StatusChip value={card.status} /></td>
                      <td className="px-4 py-3.5"><StatusChip value={card.emailStatus} /></td>
                      <td className="px-4 py-3.5 text-[13px] text-[var(--admin-muted)]">{new Date(card.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3.5"><RowActionMenu card={card} onAction={handleAction} /></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col divide-y divide-[var(--admin-border-muted)] lg:hidden">
              {pagedCards.map((card, index) => (
                <motion.div key={card.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.02 }} className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-[13px] font-semibold text-[var(--admin-ink)]">{card.code}</span>
                      <div className="mt-0.5 text-[12px] text-[var(--admin-muted)]">{card.recipient}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusChip value={card.status} />
                      <RowActionMenu card={card} onAction={handleAction} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1.5 text-[12px]">
                    <div><span className="text-[var(--admin-muted)]">Type: </span><span className="text-[var(--admin-ink-secondary)]">{card.type}</span></div>
                    <div><span className="text-[var(--admin-muted)]">Value: </span><span className="font-bold text-[var(--admin-ink)]">{card.value}</span></div>
                    <div><span className="text-[var(--admin-muted)]">Remaining: </span><span className="font-bold text-[var(--admin-accent)]">{card.remainingBalance}</span></div>
                    <div><span className="text-[var(--admin-muted)]">Email: </span><StatusChip value={card.emailStatus} /></div>
                  </div>
                </motion.div>
              ))}
            </div>

            {totalCards > pageSize && (
              <div className="border-t border-[var(--admin-border)] px-4">
                <AdminPagination page={page} pageSize={pageSize} total={totalCards} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

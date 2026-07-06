"use client";

import React, { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Calendar, Search, Plus, Eye } from "lucide-react";
import Link from "next/link";
import {
  AdminPageHeader,
  AdminLoadingState,
  AdminEmptyState,
  AdminStatusChip,
  AdminButton,
} from "@/components/admin/ui";

interface Booking {
  id: string;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  services: string[];
  technician: string;
  scheduledStartAt: string;
  status: string;
  paymentStatus: string;
  paymentProvider: string;
  chargeMode: string | null;
  paidAmount: number;
  totalAmount: number;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "Pending", label: "Pending" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "Checked In", label: "Checked In" },
  { value: "In Service", label: "In Service" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "No Show", label: "No Show" },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/admin/bookings?${params}`);
      if (res.status === 401) { window.location.href = "/login?next=/admin/bookings"; return; }
      const json = await res.json();
      setBookings(json.data || []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  return (
    <div className="admin-page-container">
      {/* Header */}
      <AdminPageHeader
        eyebrow="Operations"
        title="Bookings"
        description="Manage appointments, track status & payments"
        actions={
          <Link href="/booking">
            <AdminButton variant="primary" size="lg" icon={<Plus size={16} />}>
              New Booking
            </AdminButton>
          </Link>
        }
      />

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)]"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, code, email..."
            className="w-full rounded-[var(--admin-radius-md)] border border-[var(--admin-border-strong)] bg-[var(--admin-surface)] py-2.5 pl-9 pr-3 text-[13px] text-[var(--admin-ink)] placeholder:text-[var(--admin-placeholder)] transition-colors focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="appearance-none rounded-[var(--admin-radius-md)] border border-[var(--admin-border-strong)] bg-[var(--admin-surface)] px-3.5 py-2.5 text-[13px] text-[var(--admin-ink-secondary)] transition-colors focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table / Content */}
      <div className="overflow-hidden rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow-sm)]">
        {loading ? (
          <div className="p-8">
            <AdminLoadingState variant="table" />
          </div>
        ) : bookings.length === 0 ? (
          <AdminEmptyState
            icon={Calendar}
            title="No bookings found"
            description="Bookings will appear here once created."
          />
        ) : (
          <>
            {/* Desktop table — hidden on mobile */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[var(--admin-border)]">
                    {["Code", "Client", "Services", "Technician", "Scheduled", "Status", "Payment", "Paid", ""].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[11px] font-extrabold uppercase tracking-wider text-[var(--admin-muted)]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <motion.tr
                      key={b.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-[var(--admin-border-muted)] transition-colors hover:bg-[var(--admin-surface-hover)]"
                    >
                      <td className="px-4 py-3.5 text-[13px] font-bold text-[var(--admin-accent)]">
                        {b.bookingCode}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-[13px] font-semibold text-[var(--admin-ink)]">{b.customerName}</div>
                        <div className="text-[11px] text-[var(--admin-muted)]">{b.customerEmail}</div>
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-[var(--admin-ink-secondary)]">
                        {b.services?.join(", ") || "—"}
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-[var(--admin-ink-secondary)]">
                        {b.technician || "Any"}
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-[var(--admin-ink-secondary)]">
                        {format(new Date(b.scheduledStartAt), "MMM d, h:mm a")}
                      </td>
                      <td className="px-4 py-3.5">
                        <AdminStatusChip status={b.status} size="sm" />
                      </td>
                      <td className="px-4 py-3.5">
                        <div
                          className={`text-xs font-bold ${
                            ["Paid", "Deposit Paid"].includes(b.paymentStatus)
                              ? "text-[var(--admin-success)]"
                              : "text-[var(--admin-warning)]"
                          }`}
                        >
                          {b.paymentStatus}
                        </div>
                        <div className="mt-0.5 text-[10px] text-[var(--admin-muted)]">
                          {b.paymentProvider}{b.chargeMode ? ` · ${b.chargeMode}` : ""}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[13px] font-bold text-[var(--admin-ink)]">
                        ${Number(b.paidAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="inline-flex items-center justify-center rounded-[var(--admin-radius-sm)] p-1.5 text-[var(--admin-accent)] transition-colors hover:bg-[var(--admin-accent-soft)]"
                          aria-label={`View booking ${b.bookingCode}`}
                        >
                          <Eye size={16} />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards — shown only on mobile */}
            <div className="flex flex-col divide-y divide-[var(--admin-border-muted)] md:hidden">
              {bookings.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="p-4"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <span className="text-[13px] font-bold text-[var(--admin-accent)]">{b.bookingCode}</span>
                      <div className="mt-0.5 text-[13px] font-semibold text-[var(--admin-ink)]">{b.customerName}</div>
                      <div className="text-[11px] text-[var(--admin-muted)]">{b.customerEmail}</div>
                    </div>
                    <AdminStatusChip status={b.status} size="sm" />
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-y-1.5 text-[12px]">
                    <div>
                      <span className="text-[var(--admin-muted)]">Services: </span>
                      <span className="text-[var(--admin-ink-secondary)]">{b.services?.join(", ") || "—"}</span>
                    </div>
                    <div>
                      <span className="text-[var(--admin-muted)]">Tech: </span>
                      <span className="text-[var(--admin-ink-secondary)]">{b.technician || "Any"}</span>
                    </div>
                    <div>
                      <span className="text-[var(--admin-muted)]">Scheduled: </span>
                      <span className="text-[var(--admin-ink-secondary)]">{format(new Date(b.scheduledStartAt), "MMM d, h:mm a")}</span>
                    </div>
                    <div>
                      <span className="text-[var(--admin-muted)]">Paid: </span>
                      <span className="font-bold text-[var(--admin-ink)]">${Number(b.paidAmount || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div
                      className={`text-xs font-bold ${
                        ["Paid", "Deposit Paid"].includes(b.paymentStatus)
                          ? "text-[var(--admin-success)]"
                          : "text-[var(--admin-warning)]"
                      }`}
                    >
                      {b.paymentStatus}
                      <span className="ml-1 font-normal text-[var(--admin-muted)]">
                        {b.paymentProvider}{b.chargeMode ? ` · ${b.chargeMode}` : ""}
                      </span>
                    </div>
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="inline-flex items-center justify-center rounded-[var(--admin-radius-sm)] p-1.5 text-[var(--admin-accent)] transition-colors hover:bg-[var(--admin-accent-soft)]"
                      aria-label={`View booking ${b.bookingCode}`}
                    >
                      <Eye size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

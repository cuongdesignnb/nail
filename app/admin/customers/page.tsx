"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { UserCircle, Search, Eye } from "lucide-react";
import Link from "next/link";
import {
  AdminPageHeader,
  AdminLoadingState,
  AdminEmptyState,
} from "@/components/admin/ui";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpend: number;
  lastVisit: string | null;
  lastPayment: string | null;
  paymentProvider: string | null;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/customers?${params}`);
      if (res.status === 401) { window.location.href = "/login?next=/admin/customers"; return; }
      const json = await res.json();
      setCustomers(json.data || []);
    } catch { setCustomers([]); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="admin-page-container">
      <AdminPageHeader
        eyebrow="Operations"
        title="Customers"
        description="View customer profiles, booking history & preferences"
      />

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)]"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, phone..."
          className="w-full rounded-[var(--admin-radius-md)] border border-[var(--admin-border-strong)] bg-[var(--admin-surface)] py-2.5 pl-9 pr-3 text-[13px] text-[var(--admin-ink)] placeholder:text-[var(--admin-placeholder)] transition-colors focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow-sm)]">
        {loading ? (
          <div className="p-8">
            <AdminLoadingState variant="table" />
          </div>
        ) : customers.length === 0 ? (
          <AdminEmptyState
            icon={UserCircle}
            title="No customers found"
            description="Customer records will appear here as they book."
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[var(--admin-border)]">
                    {["Name", "Email", "Phone", "Bookings", "Total Paid", "Last Payment", "Provider", ""].map((h) => (
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
                  {customers.map((c, i) => (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-[var(--admin-border-muted)] transition-colors hover:bg-[var(--admin-surface-hover)]"
                    >
                      <td className="px-4 py-3.5 text-[13px] font-semibold text-[var(--admin-ink)]">
                        {c.firstName} {c.lastName}
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-[var(--admin-ink-secondary)]">{c.email}</td>
                      <td className="px-4 py-3.5 text-[13px] text-[var(--admin-ink-secondary)]">{c.phone || "—"}</td>
                      <td className="px-4 py-3.5 text-[13px] font-bold text-[var(--admin-accent)]">{c.totalBookings}</td>
                      <td className="px-4 py-3.5 text-[13px] font-bold text-[var(--admin-ink)]">${c.totalSpend?.toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-xs text-[var(--admin-muted)]">
                        {c.lastPayment ? new Date(c.lastPayment).toLocaleDateString() : "Never"}
                      </td>
                      <td className="px-4 py-3.5 text-xs capitalize text-[var(--admin-ink-secondary)]">{c.paymentProvider || "—"}</td>
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/admin/customers/${c.id}`}
                          className="inline-flex items-center justify-center rounded-[var(--admin-radius-sm)] p-1.5 text-[var(--admin-accent)] transition-colors hover:bg-[var(--admin-accent-soft)]"
                          aria-label={`View customer ${c.firstName} ${c.lastName}`}
                        >
                          <Eye size={16} />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col divide-y divide-[var(--admin-border-muted)] md:hidden">
              {customers.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[13px] font-semibold text-[var(--admin-ink)]">
                        {c.firstName} {c.lastName}
                      </div>
                      <div className="mt-0.5 text-[12px] text-[var(--admin-muted)]">{c.email}</div>
                      {c.phone && <div className="text-[12px] text-[var(--admin-muted)]">{c.phone}</div>}
                    </div>
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="inline-flex items-center justify-center rounded-[var(--admin-radius-sm)] p-1.5 text-[var(--admin-accent)] transition-colors hover:bg-[var(--admin-accent-soft)]"
                      aria-label={`View customer ${c.firstName} ${c.lastName}`}
                    >
                      <Eye size={16} />
                    </Link>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-y-1 text-[12px]">
                    <div>
                      <span className="text-[var(--admin-muted)]">Bookings: </span>
                      <span className="font-bold text-[var(--admin-accent)]">{c.totalBookings}</span>
                    </div>
                    <div>
                      <span className="text-[var(--admin-muted)]">Spent: </span>
                      <span className="font-bold text-[var(--admin-ink)]">${c.totalSpend?.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[var(--admin-muted)]">Last paid: </span>
                      <span className="text-[var(--admin-ink-secondary)]">
                        {c.lastPayment ? new Date(c.lastPayment).toLocaleDateString() : "Never"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--admin-muted)]">Provider: </span>
                      <span className="capitalize text-[var(--admin-ink-secondary)]">{c.paymentProvider || "—"}</span>
                    </div>
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

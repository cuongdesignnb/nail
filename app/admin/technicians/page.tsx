"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, Search, Star } from "lucide-react";
import Link from "next/link";
import {
  AdminPageHeader,
  AdminLoadingState,
  AdminEmptyState,
  AdminCard,
  AdminStatusChip,
} from "@/components/admin/ui";

interface Technician {
  id: string;
  name: string;
  email: string;
  specialty: string;
  rating: number;
  isActive: boolean;
  bookingsCount: number;
}

export default function AdminTechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/technicians${search ? `?search=${search}` : ""}`);
      if (res.status === 401) { window.location.href = "/login?next=/admin/technicians"; return; }
      const json = await res.json();
      setTechnicians(json.data || []);
    } catch { setTechnicians([]); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="admin-page-container">
      <AdminPageHeader
        eyebrow="Operations"
        title="Technicians"
        description="Manage your nail artists and specialists"
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
          placeholder="Search technicians..."
          className="w-full rounded-[var(--admin-radius-md)] border border-[var(--admin-border-strong)] bg-[var(--admin-surface)] py-2.5 pl-9 pr-3 text-[13px] text-[var(--admin-ink)] placeholder:text-[var(--admin-placeholder)] transition-colors focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20"
        />
      </div>

      {/* Content */}
      {loading ? (
        <AdminLoadingState variant="card" />
      ) : technicians.length === 0 ? (
        <AdminCard>
          <AdminEmptyState
            icon={Users}
            title="No technicians found"
            description="Technician profiles will appear here once added."
          />
        </AdminCard>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {technicians.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/admin/technicians/${t.id}`} className="block no-underline">
                <AdminCard hover>
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold text-[var(--admin-ink)]">{t.name}</h3>
                      <p className="mt-0.5 text-xs text-[var(--admin-muted)]">{t.specialty || "General"}</p>
                    </div>
                    <AdminStatusChip
                      status={t.isActive ? "Active" : "Inactive"}
                      size="sm"
                    />
                  </div>

                  <div className="mt-4 flex gap-6">
                    <div>
                      <span className="text-[11px] text-[var(--admin-muted)]">Rating</span>
                      <div className="mt-0.5 flex items-center gap-1">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-[var(--admin-ink)]">
                          {t.rating?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-[var(--admin-muted)]">Bookings</span>
                      <div className="mt-0.5 text-sm font-bold text-[var(--admin-ink)]">
                        {t.bookingsCount || 0}
                      </div>
                    </div>
                  </div>
                </AdminCard>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

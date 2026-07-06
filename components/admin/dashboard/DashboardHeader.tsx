'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RefreshCw, CalendarPlus, CalendarDays } from 'lucide-react';

interface DashboardHeaderProps {
  adminName: string;
  onRefresh: () => void;
  loading: boolean;
}

export default function DashboardHeader({
  adminName,
  onRefresh,
  loading,
}: DashboardHeaderProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-1"
    >
      <span className="text-[11px] font-bold uppercase tracking-[1.2px] text-[var(--admin-muted)]">
        {today}
      </span>
      <h1 className="font-heading text-2xl font-bold text-[var(--admin-ink)] sm:text-3xl">
        Welcome back, {adminName}
      </h1>
      <p className="text-sm text-[var(--admin-muted)]">
        Your salon dashboard overview
      </p>

      <div className="mt-3 flex items-center gap-2.5 flex-wrap">
        <Link
          href="/booking"
          className="inline-flex items-center gap-1.5 rounded-[var(--admin-radius-md)] bg-[var(--admin-accent)] px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[var(--admin-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/40"
        >
          <CalendarPlus size={15} strokeWidth={2} />
          Create Booking
        </Link>

        <Link
          href="/admin/calendar"
          className="inline-flex items-center gap-1.5 rounded-[var(--admin-radius-md)] border border-[var(--admin-border-strong)] bg-[var(--admin-surface)] px-5 py-2.5 text-[13px] font-semibold text-[var(--admin-accent)] transition-colors hover:bg-[var(--admin-surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/40"
        >
          <CalendarDays size={15} strokeWidth={2} />
          View Calendar
        </Link>

        <button
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh data"
          className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--admin-radius-md)] border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-accent)] transition-colors hover:bg-[var(--admin-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            strokeWidth={2}
            className={loading ? "animate-[admin-spin_0.7s_linear_infinite]" : ""}
          />
        </button>
      </div>
    </motion.div>
  );
}

'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import type { DashboardOverview } from '@/lib/dashboard/dashboard.types';

import DashboardHeader from './DashboardHeader';
import DashboardDateRangeControl from './DashboardDateRangeControl';
import DashboardKpiGrid from './DashboardKpiGrid';
import DashboardSkeleton from './DashboardSkeleton';
import RevenueOverviewCard from './RevenueOverviewCard';
import BookingStatusCard from './BookingStatusCard';
import TodayScheduleCard from './TodayScheduleCard';
import QuickActionsCard from './QuickActionsCard';
import UpcomingAppointmentsCard from './UpcomingAppointmentsCard';
import TopTechniciansCard from './TopTechniciansCard';
import TopServicesCard from './TopServicesCard';
import InventoryAlertsCard from './InventoryAlertsCard';
import RecentReviewsCard from './RecentReviewsCard';
import ServiceCategoryDistributionCard from './ServiceCategoryDistributionCard';
import AtAGlanceCard from './AtAGlanceCard';

export default function AdminDashboardClient() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState('today');

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/dashboard?range=${range}`);
      if (res.status === 401 || res.status === 403) {
        window.location.href = '/login?next=/admin';
        return;
      }
      if (!res.ok) throw new Error(`Failed to load dashboard (${res.status})`);
      const json = await res.json();
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /* ── Get admin name (cookie or fallback) ────────────────── */
  const adminName = (() => {
    if (typeof document === 'undefined') return 'Admin';
    try {
      const match = document.cookie
        .split('; ')
        .find((c) => c.startsWith('adminName='));
      return match ? decodeURIComponent(match.split('=')[1]) : 'Admin';
    } catch {
      return 'Admin';
    }
  })();

  /* ── Loading state ──────────────────────────────────────── */
  if (loading && !data) {
    return (
      <div className="admin-page-container">
        <DashboardSkeleton />
      </div>
    );
  }

  /* ── Error state ────────────────────────────────────────── */
  if (error && !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-[420px] rounded-[var(--admin-radius-xl)] border border-[var(--admin-danger-soft)] bg-[var(--admin-surface)] p-12 text-center shadow-admin-md"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[var(--admin-radius-lg)] bg-[var(--admin-danger-soft)]">
            <AlertCircle size={28} className="text-[var(--admin-danger)]" strokeWidth={1.8} />
          </div>
          <h2 className="mb-2 font-heading text-xl font-semibold text-[var(--admin-ink)]">
            Unable to load dashboard
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-[var(--admin-muted)]">
            {error}
          </p>
          <button
            onClick={fetchDashboard}
            className="inline-flex items-center gap-1.5 rounded-[var(--admin-radius-md)] bg-[var(--admin-accent)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--admin-accent-hover)]"
          >
            <RefreshCw size={14} strokeWidth={2} />
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  if (!data) return null;

  /* ── Success state ──────────────────────────────────────── */
  return (
    <div className="admin-page-container">
      {/* ── Row 1: Header + Date Range ────────────────────── */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <DashboardHeader
          adminName={adminName}
          onRefresh={fetchDashboard}
          loading={loading}
        />
        <DashboardDateRangeControl
          value={range}
          onChange={setRange}
          disabled={loading}
        />
      </div>

      {/* ── Row 2: KPI Grid ───────────────────────────────── */}
      <div className="mb-5">
        <DashboardKpiGrid kpis={data.kpis} />
      </div>

      {/* ── Main Grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-5">
        {/* Row 3: Revenue (7) + Booking Status (5) */}
        <div className="col-span-12 lg:col-span-7">
          <RevenueOverviewCard
            data={data.revenueSeries}
            currency={data.meta.range.currency}
            loading={loading}
          />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <BookingStatusCard
            data={data.bookingStatus}
            loading={loading}
          />
        </div>

        {/* Row 4: Today's Schedule (7) + Quick Actions (5) */}
        <div className="col-span-12 lg:col-span-7">
          <TodayScheduleCard
            appointments={data.todaySchedule}
            loading={loading}
          />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <QuickActionsCard />
        </div>

        {/* Row 5: Upcoming (8) + Inventory (4) */}
        <div className="col-span-12 lg:col-span-8">
          <UpcomingAppointmentsCard
            appointments={data.upcomingAppointments}
            loading={loading}
          />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <InventoryAlertsCard
            alerts={data.inventoryAlerts}
            loading={loading}
          />
        </div>

        {/* Row 6: Top Techs (4) + Top Services (4) + Categories (4) */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <TopTechniciansCard
            technicians={data.topTechnicians}
            loading={loading}
          />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <TopServicesCard
            services={data.topServices}
            loading={loading}
          />
        </div>
        <div className="col-span-12 md:col-span-12 lg:col-span-4">
          <ServiceCategoryDistributionCard
            data={data.serviceCategoryDistribution}
            loading={loading}
          />
        </div>

        {/* Row 7: Reviews (7) + At a Glance (5) */}
        <div className="col-span-12 lg:col-span-7">
          <RecentReviewsCard
            reviews={data.recentReviews}
            loading={loading}
          />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <AtAGlanceCard data={data.atAGlance} loading={loading} />
        </div>
      </div>
    </div>
  );
}


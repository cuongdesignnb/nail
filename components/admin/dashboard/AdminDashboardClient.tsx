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
      <div style={{ background: '#fffaf4', minHeight: '100vh', padding: '32px 24px' }}>
        <DashboardSkeleton />
      </div>
    );
  }

  /* ── Error state ────────────────────────────────────────── */
  if (error && !data) {
    return (
      <div
        style={{
          background: '#fffaf4',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: 'rgba(255, 253, 249, 0.95)',
            border: '1px solid rgba(197, 48, 48, 0.12)',
            borderRadius: 20,
            padding: '48px 40px',
            textAlign: 'center',
            maxWidth: 420,
            boxShadow: '0 4px 24px rgba(77, 43, 20, 0.06)',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'rgba(197, 48, 48, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <AlertCircle size={28} color="#c53030" strokeWidth={1.8} />
          </div>
          <h2
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 20,
              color: '#2f1c11',
              margin: '0 0 8px',
            }}
          >
            Unable to load dashboard
          </h2>
          <p
            style={{
              fontSize: 13,
              color: '#7f6d61',
              margin: '0 0 20px',
              lineHeight: 1.5,
            }}
          >
            {error}
          </p>
          <button
            onClick={fetchDashboard}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 24px',
              borderRadius: 12,
              background: '#9b591d',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
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
    <div
      style={{
        background: '#fffaf4',
        minHeight: '100vh',
        padding: '32px 24px 60px',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* ── Row 1: Header + Date Range ────────────────────── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 24,
          }}
        >
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
        <div style={{ marginBottom: 20 }}>
          <DashboardKpiGrid kpis={data.kpis} />
        </div>

        {/* ── Main Grid ─────────────────────────────────────── */}
        <div className="dashboard-grid">
          {/* Row 3: Revenue (7) + Booking Status (5) */}
          <div style={{ gridColumn: 'span 7' }} className="dash-span-7">
            <RevenueOverviewCard
              data={data.revenueSeries}
              currency={data.meta.range.currency}
              loading={loading}
            />
          </div>
          <div style={{ gridColumn: 'span 5' }} className="dash-span-5">
            <BookingStatusCard
              data={data.bookingStatus}
              loading={loading}
            />
          </div>

          {/* Row 4: Today's Schedule (7) + Quick Actions (5) */}
          <div style={{ gridColumn: 'span 7' }} className="dash-span-7">
            <TodayScheduleCard
              appointments={data.todaySchedule}
              loading={loading}
            />
          </div>
          <div style={{ gridColumn: 'span 5' }} className="dash-span-5">
            <QuickActionsCard />
          </div>

          {/* Row 5: Upcoming (8) + Inventory (4) */}
          <div style={{ gridColumn: 'span 8' }} className="dash-span-8">
            <UpcomingAppointmentsCard
              appointments={data.upcomingAppointments}
              loading={loading}
            />
          </div>
          <div style={{ gridColumn: 'span 4' }} className="dash-span-4">
            <InventoryAlertsCard
              alerts={data.inventoryAlerts}
              loading={loading}
            />
          </div>

          {/* Row 6: Top Techs (4) + Top Services (4) + Categories (4) */}
          <div style={{ gridColumn: 'span 4' }} className="dash-span-4">
            <TopTechniciansCard
              technicians={data.topTechnicians}
              loading={loading}
            />
          </div>
          <div style={{ gridColumn: 'span 4' }} className="dash-span-4">
            <TopServicesCard
              services={data.topServices}
              loading={loading}
            />
          </div>
          <div style={{ gridColumn: 'span 4' }} className="dash-span-4">
            <ServiceCategoryDistributionCard
              data={data.serviceCategoryDistribution}
              loading={loading}
            />
          </div>

          {/* Row 7: Reviews (7) + At a Glance (5) */}
          <div style={{ gridColumn: 'span 7' }} className="dash-span-7">
            <RecentReviewsCard
              reviews={data.recentReviews}
              loading={loading}
            />
          </div>
          <div style={{ gridColumn: 'span 5' }} className="dash-span-5">
            <AtAGlanceCard data={data.atAGlance} loading={loading} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 20px;
        }
        .dashboard-grid > div > :global(*) {
          height: 100%;
        }

        @media (max-width: 1100px) {
          .dash-span-7,
          .dash-span-5,
          .dash-span-8 {
            grid-column: span 6 !important;
          }
          .dash-span-4 {
            grid-column: span 6 !important;
          }
        }

        @media (max-width: 768px) {
          .dashboard-grid > div {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </div>
  );
}

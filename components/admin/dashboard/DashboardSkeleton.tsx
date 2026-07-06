'use client';

import React from 'react';

function Bone({
  w = '100%',
  h = 16,
  r = 8,
  mb = 0,
}: {
  w?: string | number;
  h?: number;
  r?: number;
  mb?: number;
}) {
  return (
    <div
      className="animate-pulse"
      style={{
        width: w,
        height: h,
        borderRadius: r,
        background: 'var(--admin-accent-muted)',
        marginBottom: mb,
      }}
    />
  );
}

function SkeletonCard({
  h = 200,
  span = 12,
}: {
  h?: number;
  span?: number;
}) {
  return (
    <div
      className="flex flex-col gap-3 rounded-[var(--admin-radius-xl)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-[var(--admin-shadow-md)]"
      style={{ gridColumn: `span ${span}`, minHeight: h }}
    >
      <div className="flex items-center gap-2.5">
        <Bone w={36} h={36} r={10} />
        <Bone w="40%" h={14} />
      </div>
      <Bone w="60%" h={12} />
      <Bone w="80%" h={12} />
      <div className="flex-1" />
      <Bone w="30%" h={12} />
    </div>
  );
}

function KpiSkeleton() {
  return (
    <div className="flex flex-col gap-2.5 rounded-[var(--admin-radius-xl)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-[var(--admin-shadow-md)]">
      <div className="flex items-center gap-2.5">
        <Bone w={40} h={40} r={12} />
        <Bone w="50%" h={12} />
      </div>
      <Bone w="70%" h={28} r={6} />
      <Bone w="40%" h={12} />
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-5 pb-10">
      {/* Header skeleton */}
      <div className="flex flex-col gap-2">
        <Bone w={140} h={14} />
        <Bone w={280} h={28} r={6} />
        <Bone w={200} h={14} />
      </div>

      {/* KPI row */}
      <div
        className="skeleton-kpi-grid grid gap-5"
        style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
      >
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
      </div>

      {/* Charts row */}
      <div
        className="skeleton-main-grid grid gap-5"
        style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}
      >
        <SkeletonCard span={7} h={340} />
        <SkeletonCard span={5} h={340} />
        <SkeletonCard span={7} h={300} />
        <SkeletonCard span={5} h={300} />
        <SkeletonCard span={8} h={280} />
        <SkeletonCard span={4} h={280} />
        <SkeletonCard span={4} h={260} />
        <SkeletonCard span={4} h={260} />
        <SkeletonCard span={4} h={260} />
        <SkeletonCard span={7} h={260} />
        <SkeletonCard span={5} h={260} />
      </div>

      <style jsx global>{`
        @media (max-width: 1100px) {
          .skeleton-kpi-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .skeleton-main-grid > div {
            grid-column: span 12 !important;
          }
        }
        @media (max-width: 768px) {
          .skeleton-kpi-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

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
      style={{
        width: w,
        height: h,
        borderRadius: r,
        background: 'rgba(155, 89, 29, 0.07)',
        animation: 'skeletonPulse 1.6s ease-in-out infinite',
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
      style={{
        gridColumn: `span ${span}`,
        background: 'rgba(255, 253, 249, 0.95)',
        border: '1px solid rgba(116, 55, 15, 0.08)',
        borderRadius: 20,
        boxShadow: '0 4px 24px rgba(77, 43, 20, 0.06)',
        padding: 24,
        minHeight: h,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Bone w={36} h={36} r={10} />
        <Bone w="40%" h={14} />
      </div>
      <Bone w="60%" h={12} />
      <Bone w="80%" h={12} />
      <div style={{ flex: 1 }} />
      <Bone w="30%" h={12} />
    </div>
  );
}

function KpiSkeleton() {
  return (
    <div
      style={{
        background: 'rgba(255, 253, 249, 0.95)',
        border: '1px solid rgba(116, 55, 15, 0.08)',
        borderRadius: 20,
        boxShadow: '0 4px 24px rgba(77, 43, 20, 0.06)',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        padding: '0 0 40px',
      }}
    >
      {/* Header skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Bone w={140} h={14} />
        <Bone w={280} h={28} r={6} />
        <Bone w={200} h={14} />
      </div>

      {/* KPI row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
        }}
        className="skeleton-kpi-grid"
      >
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
      </div>

      {/* Charts row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 20,
        }}
        className="skeleton-main-grid"
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
        @keyframes skeletonPulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
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

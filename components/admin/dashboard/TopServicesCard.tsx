'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';
import type { DashboardOverview } from '@/lib/dashboard/dashboard.types';
import DashboardCard from './DashboardCard';
import DashboardEmptyState from './DashboardEmptyState';
import { formatCurrency } from './dashboard-formatters';

interface TopServicesCardProps {
  services: DashboardOverview['topServices'];
  loading?: boolean;
}

export default function TopServicesCard({
  services,
  loading = false,
}: TopServicesCardProps) {
  const maxCount = Math.max(...services.map((s) => s.bookingCount), 1);

  return (
    <DashboardCard
      title="Top Services"
      icon={BarChart3}
      loading={loading}
      action={{ label: 'View All', href: '/admin/services' }}
    >
      {services.length === 0 ? (
        <DashboardEmptyState
          icon={BarChart3}
          message="No service booking data."
        />
      ) : (
        <div className="flex flex-col gap-3.5">
          {services.map((service, i) => {
            const pct = Math.round((service.bookingCount / maxCount) * 100);
            return (
              <div key={service.id}>
                {/* Name row */}
                <div className="flex justify-between items-baseline mb-1.5">
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className="text-xs font-bold"
                      style={{
                        color: i < 3
                          ? 'var(--admin-accent)'
                          : 'var(--admin-muted)',
                      }}
                    >
                      {i + 1}.
                    </span>
                    <span
                      className="text-[13px] font-semibold"
                      style={{ color: 'var(--admin-ink)' }}
                    >
                      {service.name}
                    </span>
                  </div>
                  <span
                    className="text-xs font-semibold whitespace-nowrap"
                    style={{ color: 'var(--admin-muted)' }}
                  >
                    {service.bookingCount} bookings
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  className="w-full h-1.5 overflow-hidden"
                  style={{
                    borderRadius: 'var(--admin-radius-xs)',
                    background: 'var(--admin-accent-soft)',
                  }}
                >
                  <div
                    className="h-full transition-[width] duration-[600ms] ease-out"
                    style={{
                      width: `${pct}%`,
                      borderRadius: 'var(--admin-radius-xs)',
                      background: `linear-gradient(90deg, var(--admin-accent), var(--admin-accent))`,
                    }}
                  />
                </div>

                {/* Revenue */}
                <div
                  className="text-[11px] mt-1"
                  style={{ color: 'var(--admin-muted)' }}
                >
                  Revenue: {formatCurrency(service.revenue)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardCard>
  );
}

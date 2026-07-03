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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {services.map((service, i) => {
            const pct = Math.round((service.bookingCount / maxCount) * 100);
            return (
              <div key={service.id}>
                {/* Name row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: 6,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: i < 3 ? '#9b591d' : '#7f6d61',
                      }}
                    >
                      {i + 1}.
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#2f1c11',
                      }}
                    >
                      {service.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#7f6d61',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {service.bookingCount} bookings
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    width: '100%',
                    height: 6,
                    borderRadius: 3,
                    background: 'rgba(155, 89, 29, 0.06)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      borderRadius: 3,
                      background: 'linear-gradient(90deg, #9b591d, #a85d1e)',
                      transition: 'width 0.6s ease-out',
                    }}
                  />
                </div>

                {/* Revenue */}
                <div
                  style={{
                    fontSize: 11,
                    color: '#7f6d61',
                    marginTop: 4,
                  }}
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

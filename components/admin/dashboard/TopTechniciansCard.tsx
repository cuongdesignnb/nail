'use client';

import React from 'react';
import { Trophy } from 'lucide-react';
import type { DashboardOverview } from '@/lib/dashboard/dashboard.types';
import DashboardCard from './DashboardCard';
import DashboardEmptyState from './DashboardEmptyState';
import { formatCurrency } from './dashboard-formatters';

interface TopTechniciansCardProps {
  technicians: DashboardOverview['topTechnicians'];
  loading?: boolean;
}

export default function TopTechniciansCard({
  technicians,
  loading = false,
}: TopTechniciansCardProps) {
  return (
    <DashboardCard
      title="Top Technicians"
      icon={Trophy}
      loading={loading}
      action={{ label: 'View All', href: '/admin/technicians' }}
    >
      {technicians.length === 0 ? (
        <DashboardEmptyState
          icon={Trophy}
          message="No technician data available."
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {technicians.map((tech, i) => (
            <div
              key={tech.id}
              className="flex items-center gap-3 px-3 py-2.5 transition-colors duration-150 hover:bg-[var(--admin-surface-hover)]"
              style={{ borderRadius: 'var(--admin-radius-md)' }}
            >
              {/* Rank */}
              <span
                className="text-[13px] font-bold w-5 text-center shrink-0"
                style={{
                  color: i < 3
                    ? 'var(--admin-accent)'
                    : 'var(--admin-muted)',
                }}
              >
                {i + 1}.
              </span>

              {/* Avatar */}
              {tech.avatar ? (
                <img
                  src={tech.avatar}
                  alt={tech.name}
                  className="w-9 h-9 object-cover shrink-0"
                  style={{ borderRadius: 'var(--admin-radius-sm)' }}
                />
              ) : (
                <div
                  className="w-9 h-9 flex items-center justify-center text-sm font-bold shrink-0"
                  style={{
                    borderRadius: 'var(--admin-radius-sm)',
                    background: 'var(--admin-accent-muted)',
                    color: 'var(--admin-accent)',
                  }}
                >
                  {tech.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div
                  className="text-[13px] font-semibold leading-tight"
                  style={{ color: 'var(--admin-ink)' }}
                >
                  {tech.name}
                </div>
                <div
                  className="text-xs mt-px"
                  style={{ color: 'var(--admin-muted)' }}
                >
                  {tech.completedAppointments} appointments
                </div>
              </div>

              {/* Revenue */}
              <div
                className="text-xs font-semibold whitespace-nowrap"
                style={{ color: 'var(--admin-accent)' }}
              >
                {formatCurrency(tech.bookedValue)}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

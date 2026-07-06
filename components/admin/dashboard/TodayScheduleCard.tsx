'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, CalendarCheck } from 'lucide-react';
import type { DashboardAppointment } from '@/lib/dashboard/dashboard.types';
import DashboardCard from './DashboardCard';
import DashboardEmptyState from './DashboardEmptyState';
import {
  formatTime,
  STATUS_COLORS,
  STATUS_BG_COLORS,
} from './dashboard-formatters';

interface TodayScheduleCardProps {
  appointments: DashboardAppointment[];
  loading?: boolean;
}

export default function TodayScheduleCard({
  appointments,
  loading = false,
}: TodayScheduleCardProps) {
  const sorted = [...appointments].sort(
    (a, b) =>
      new Date(a.scheduledStartAt).getTime() -
      new Date(b.scheduledStartAt).getTime()
  );

  return (
    <DashboardCard
      title="Today's Schedule"
      icon={Clock}
      loading={loading}
      action={{ label: 'View Full Calendar', href: '/admin/calendar' }}
    >
      {sorted.length === 0 ? (
        <DashboardEmptyState
          icon={CalendarCheck}
          message="No appointments scheduled for today."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-separate text-[13px]" style={{ borderSpacing: '0 4px' }}>
            <thead>
              <tr>
                {['Time', 'Customer', 'Services', 'Technician', 'Status'].map(
                  (h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap border-b border-[var(--admin-border-muted)] px-2.5 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--admin-muted)]"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {sorted.map((apt) => (
                <tr
                  key={apt.id}
                  className="cursor-pointer transition-colors duration-150 hover:bg-[var(--admin-surface-hover)]"
                >
                  <td className="whitespace-nowrap px-2.5 py-2.5 font-semibold text-[var(--admin-ink)]">
                    {formatTime(apt.scheduledStartAt)}
                  </td>
                  <td className="whitespace-nowrap px-2.5 py-2.5 text-[var(--admin-ink)]">
                    {apt.customerName}
                  </td>
                  <td className="max-w-[180px] truncate whitespace-nowrap px-2.5 py-2.5 text-[var(--admin-muted)]">
                    {apt.services.join(', ')}
                  </td>
                  <td className="whitespace-nowrap px-2.5 py-2.5 text-[var(--admin-ink)]">
                    {apt.technicianName}
                  </td>
                  <td className="px-2.5 py-2.5">
                    <span
                      className="inline-block whitespace-nowrap rounded-[var(--admin-radius-sm)] px-2.5 py-0.5 text-[11px] font-semibold"
                      style={{
                        color: STATUS_COLORS[apt.status] || 'var(--admin-muted)',
                        background:
                          STATUS_BG_COLORS[apt.status] ||
                          'var(--admin-neutral-soft)',
                      }}
                    >
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardCard>
  );
}

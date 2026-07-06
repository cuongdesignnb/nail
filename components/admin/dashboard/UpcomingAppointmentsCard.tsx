'use client';

import React from 'react';
import Link from 'next/link';
import { CalendarRange, CalendarCheck } from 'lucide-react';
import type { DashboardAppointment } from '@/lib/dashboard/dashboard.types';
import DashboardCard from './DashboardCard';
import DashboardEmptyState from './DashboardEmptyState';
import {
  formatTime,
  formatShortDate,
  formatCurrency,
  STATUS_COLORS,
  STATUS_BG_COLORS,
} from './dashboard-formatters';

interface UpcomingAppointmentsCardProps {
  appointments: DashboardAppointment[];
  loading?: boolean;
}

export default function UpcomingAppointmentsCard({
  appointments,
  loading = false,
}: UpcomingAppointmentsCardProps) {
  return (
    <DashboardCard
      title="Upcoming Appointments"
      icon={CalendarRange}
      loading={loading}
      action={{ label: 'View All Bookings', href: '/admin/bookings' }}
    >
      {appointments.length === 0 ? (
        <DashboardEmptyState
          icon={CalendarCheck}
          message="No upcoming appointments."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-separate text-[13px]" style={{ borderSpacing: '0 4px' }}>
            <thead>
              <tr>
                {[
                  'Code',
                  'Customer',
                  'Services',
                  'Technician',
                  'Date / Time',
                  'Status',
                  'Amount',
                ].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap border-b border-[var(--admin-border-muted)] px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--admin-muted)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr
                  key={apt.id}
                  className="transition-colors duration-150 hover:bg-[var(--admin-surface-hover)]"
                >
                  <td className="whitespace-nowrap px-2 py-2.5 font-mono text-xs font-semibold text-[var(--admin-accent)]">
                    {apt.bookingCode}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-[var(--admin-ink)]">
                    {apt.customerName}
                  </td>
                  <td className="max-w-[160px] truncate whitespace-nowrap px-2 py-2.5 text-[var(--admin-muted)]">
                    {apt.services.join(', ')}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-[var(--admin-ink)]">
                    {apt.technicianName}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-[var(--admin-ink)]">
                    <span className="font-semibold">
                      {formatShortDate(apt.scheduledStartAt)}
                    </span>
                    <span className="ml-1.5 text-[var(--admin-muted)]">
                      {formatTime(apt.scheduledStartAt)}
                    </span>
                  </td>
                  <td className="px-2 py-2.5">
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
                  <td className="whitespace-nowrap px-2 py-2.5 font-semibold text-[var(--admin-ink)]">
                    {formatCurrency(apt.totalAmount)}
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

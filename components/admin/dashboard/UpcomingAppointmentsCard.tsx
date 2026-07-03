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
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0 4px',
              fontSize: 13,
            }}
          >
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
                    style={{
                      textAlign: 'left',
                      padding: '6px 8px',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#7f6d61',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      borderBottom: '1px solid rgba(116, 55, 15, 0.06)',
                      whiteSpace: 'nowrap',
                    }}
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
                  style={{ transition: 'background 0.15s' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      'rgba(155, 89, 29, 0.03)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = 'transparent')
                  }
                >
                  <td
                    style={{
                      padding: '10px 8px',
                      fontFamily: 'monospace',
                      fontSize: 12,
                      color: '#9b591d',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {apt.bookingCode}
                  </td>
                  <td
                    style={{
                      padding: '10px 8px',
                      color: '#2f1c11',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {apt.customerName}
                  </td>
                  <td
                    style={{
                      padding: '10px 8px',
                      color: '#7f6d61',
                      maxWidth: 160,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {apt.services.join(', ')}
                  </td>
                  <td
                    style={{
                      padding: '10px 8px',
                      color: '#2f1c11',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {apt.technicianName}
                  </td>
                  <td
                    style={{
                      padding: '10px 8px',
                      color: '#2f1c11',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>
                      {formatShortDate(apt.scheduledStartAt)}
                    </span>
                    <span style={{ color: '#7f6d61', marginLeft: 6 }}>
                      {formatTime(apt.scheduledStartAt)}
                    </span>
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 600,
                        color: STATUS_COLORS[apt.status] || '#7f6d61',
                        background:
                          STATUS_BG_COLORS[apt.status] ||
                          'rgba(127, 109, 97, 0.10)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '10px 8px',
                      fontWeight: 600,
                      color: '#2f1c11',
                      whiteSpace: 'nowrap',
                    }}
                  >
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

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
                {['Time', 'Customer', 'Services', 'Technician', 'Status'].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '6px 10px',
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
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {sorted.map((apt) => (
                <tr
                  key={apt.id}
                  style={{
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
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
                      padding: '10px',
                      fontWeight: 600,
                      color: '#2f1c11',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatTime(apt.scheduledStartAt)}
                  </td>
                  <td
                    style={{
                      padding: '10px',
                      color: '#2f1c11',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {apt.customerName}
                  </td>
                  <td
                    style={{
                      padding: '10px',
                      color: '#7f6d61',
                      maxWidth: 180,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {apt.services.join(', ')}
                  </td>
                  <td
                    style={{
                      padding: '10px',
                      color: '#2f1c11',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {apt.technicianName}
                  </td>
                  <td style={{ padding: '10px' }}>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardCard>
  );
}

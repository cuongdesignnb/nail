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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {technicians.map((tech, i) => (
            <div
              key={tech.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 12,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'rgba(155, 89, 29, 0.04)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
              }
            >
              {/* Rank */}
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: i < 3 ? '#9b591d' : '#7f6d61',
                  width: 20,
                  textAlign: 'center',
                  flexShrink: 0,
                }}
              >
                {i + 1}.
              </span>

              {/* Avatar */}
              {tech.avatar ? (
                <img
                  src={tech.avatar}
                  alt={tech.name}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'rgba(155, 89, 29, 0.10)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#9b591d',
                    flexShrink: 0,
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
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#2f1c11',
                    lineHeight: 1.3,
                  }}
                >
                  {tech.name}
                </div>
                <div style={{ fontSize: 12, color: '#7f6d61', marginTop: 1 }}>
                  {tech.completedAppointments} appointments
                </div>
              </div>

              {/* Revenue */}
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#9b591d',
                  whiteSpace: 'nowrap',
                }}
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

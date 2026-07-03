'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { PieChart as PieChartIcon, CalendarCheck } from 'lucide-react';
import DashboardCard from './DashboardCard';
import DashboardEmptyState from './DashboardEmptyState';
import { STATUS_COLORS } from './dashboard-formatters';

interface BookingStatusData {
  status: string;
  count: number;
}

interface BookingStatusCardProps {
  data: BookingStatusData[];
  loading?: boolean;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: BookingStatusData }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div
      style={{
        background: 'rgba(255, 253, 249, 0.97)',
        border: '1px solid rgba(116, 55, 15, 0.12)',
        borderRadius: 10,
        padding: '8px 12px',
        boxShadow: '0 4px 16px rgba(77, 43, 20, 0.1)',
      }}
    >
      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#2f1c11' }}>
        {d.name}
      </p>
      <p style={{ margin: '2px 0 0', fontSize: 12, color: '#7f6d61' }}>
        {d.value} bookings
      </p>
    </div>
  );
}

export default function BookingStatusCard({
  data,
  loading = false,
}: BookingStatusCardProps) {
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <DashboardCard title="Booking Status" icon={PieChartIcon} loading={loading}>
      {data.length === 0 || total === 0 ? (
        <DashboardEmptyState
          icon={CalendarCheck}
          message="No booking data available."
        />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status] || '#7f6d61'}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#2f1c11',
                  lineHeight: 1.1,
                }}
              >
                {total}
              </div>
              <div style={{ fontSize: 11, color: '#7f6d61', marginTop: 2 }}>
                Bookings
              </div>
            </div>
          </div>

          {/* Legend */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px 16px',
              justifyContent: 'center',
            }}
          >
            {data.map((d) => (
              <div
                key={d.status}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  color: '#2f1c11',
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 3,
                    background: STATUS_COLORS[d.status] || '#7f6d61',
                    flexShrink: 0,
                  }}
                />
                <span>{d.status}</span>
                <span style={{ color: '#7f6d61', fontWeight: 600 }}>
                  {d.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardCard>
  );
}

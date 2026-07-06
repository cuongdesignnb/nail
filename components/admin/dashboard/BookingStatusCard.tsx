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
    <div className="rounded-[10px] border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 shadow-[var(--admin-shadow-md)]">
      <p className="m-0 text-[13px] font-semibold text-[var(--admin-ink)]">
        {d.name}
      </p>
      <p className="m-0 mt-0.5 text-xs text-[var(--admin-muted)]">
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
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-[200px] w-full">
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
                      fill={STATUS_COLORS[entry.status] || 'var(--admin-muted)'}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="font-heading text-2xl font-bold leading-none text-[var(--admin-ink)]">
                {total}
              </div>
              <div className="mt-0.5 text-[11px] text-[var(--admin-muted)]">
                Bookings
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {data.map((d) => (
              <div
                key={d.status}
                className="flex items-center gap-1.5 text-xs text-[var(--admin-ink)]"
              >
                <div
                  className="h-2 w-2 shrink-0 rounded-[3px]"
                  style={{
                    background: STATUS_COLORS[d.status] || 'var(--admin-muted)',
                  }}
                />
                <span>{d.status}</span>
                <span className="font-semibold text-[var(--admin-muted)]">
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

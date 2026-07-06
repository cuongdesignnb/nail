'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Layers, BarChart3 } from 'lucide-react';
import type { DashboardOverview } from '@/lib/dashboard/dashboard.types';
import DashboardCard from './DashboardCard';
import DashboardEmptyState from './DashboardEmptyState';

interface ServiceCategoryDistributionCardProps {
  data: DashboardOverview['serviceCategoryDistribution'];
  loading?: boolean;
}

/* Chart palette — uses CSS vars at render time so theming propagates */
const WARM_COLORS = [
  'var(--admin-accent)',
  'var(--admin-accent-hover)',
  '#c87533',
  '#d4a464',
  'var(--admin-warning)',
  '#b8956a',
  'var(--admin-muted)',
  'var(--admin-info)',
  'var(--admin-success)',
  'var(--admin-danger)',
];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div
      className="border px-3 py-2"
      style={{
        background: 'var(--admin-surface)',
        borderColor: 'var(--admin-border)',
        borderRadius: 'var(--admin-radius-sm)',
        boxShadow: 'var(--admin-shadow-md)',
      }}
    >
      <p
        className="m-0 text-[13px] font-semibold"
        style={{ color: 'var(--admin-ink)' }}
      >
        {d.name}
      </p>
      <p
        className="mt-0.5 mb-0 text-xs"
        style={{ color: 'var(--admin-muted)' }}
      >
        {d.value} bookings
      </p>
    </div>
  );
}

export default function ServiceCategoryDistributionCard({
  data,
  loading = false,
}: ServiceCategoryDistributionCardProps) {
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <DashboardCard title="Service Categories" icon={Layers} loading={loading}>
      {data.length === 0 || total === 0 ? (
        <DashboardEmptyState
          icon={BarChart3}
          message="No category distribution data."
        />
      ) : (
        <div className="flex flex-col items-center gap-4">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell
                    key={entry.id}
                    fill={WARM_COLORS[i % WARM_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex flex-col gap-1.5 w-full">
            {data.map((d, i) => (
              <div
                key={d.id}
                className="flex items-center gap-2 text-xs"
              >
                <div
                  className="w-2 h-2 shrink-0"
                  style={{
                    borderRadius: 'var(--admin-radius-xs)',
                    background: WARM_COLORS[i % WARM_COLORS.length],
                  }}
                />
                <span
                  className="flex-1"
                  style={{ color: 'var(--admin-ink)' }}
                >
                  {d.name}
                </span>
                <span
                  className="font-semibold"
                  style={{ color: 'var(--admin-muted)' }}
                >
                  {d.count}
                </span>
                <span
                  className="font-medium w-9 text-right"
                  style={{ color: 'var(--admin-accent)' }}
                >
                  {d.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardCard>
  );
}

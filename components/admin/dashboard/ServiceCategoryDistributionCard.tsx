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

const WARM_COLORS = [
  '#9b591d',
  '#a85d1e',
  '#c87533',
  '#d4a464',
  '#e6a023',
  '#b8956a',
  '#7f6d61',
  '#5b7b9a',
  '#3f9142',
  '#c53030',
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              width: '100%',
            }}
          >
            {data.map((d, i) => (
              <div
                key={d.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 3,
                    background: WARM_COLORS[i % WARM_COLORS.length],
                    flexShrink: 0,
                  }}
                />
                <span style={{ flex: 1, color: '#2f1c11' }}>
                  {d.name}
                </span>
                <span style={{ color: '#7f6d61', fontWeight: 600 }}>
                  {d.count}
                </span>
                <span style={{ color: '#9b591d', fontWeight: 500, width: 36, textAlign: 'right' }}>
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

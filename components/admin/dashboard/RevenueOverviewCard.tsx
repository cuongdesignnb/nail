'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';
import DashboardCard from './DashboardCard';
import DashboardEmptyState from './DashboardEmptyState';
import { formatCurrency } from './dashboard-formatters';

interface RevenueDataPoint {
  date: string;
  label: string;
  value: number;
}

interface RevenueOverviewCardProps {
  data: RevenueDataPoint[];
  currency?: string;
  loading?: boolean;
}

function CustomTooltip({
  active,
  payload,
  label,
  currency,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  currency: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="border px-3.5 py-2.5"
      style={{
        background: 'var(--admin-surface)',
        borderColor: 'var(--admin-border)',
        borderRadius: 'var(--admin-radius-md)',
        boxShadow: 'var(--admin-shadow-md)',
      }}
    >
      <p
        className="m-0 text-[11px]"
        style={{ color: 'var(--admin-muted)' }}
      >
        {label}
      </p>
      <p
        className="mt-1 mb-0 text-[15px] font-bold font-heading"
        style={{ color: 'var(--admin-ink)' }}
      >
        {formatCurrency(payload[0].value, currency)}
      </p>
    </div>
  );
}

export default function RevenueOverviewCard({
  data,
  currency = 'USD',
  loading = false,
}: RevenueOverviewCardProps) {
  return (
    <DashboardCard title="Revenue Overview" icon={TrendingUp} loading={loading}>
      {data.length === 0 ? (
        <DashboardEmptyState
          icon={BarChart3}
          message="No revenue data for this period."
        />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--admin-accent)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor="var(--admin-accent)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--admin-border-muted)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: 'var(--admin-muted)' }}
              axisLine={{ stroke: 'var(--admin-border)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--admin-muted)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) =>
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency,
                  notation: 'compact',
                  maximumFractionDigits: 0,
                }).format(v)
              }
            />
            <Tooltip content={<CustomTooltip currency={currency} />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--admin-accent)"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: 'var(--admin-accent)',
                stroke: 'var(--admin-surface)',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </DashboardCard>
  );
}

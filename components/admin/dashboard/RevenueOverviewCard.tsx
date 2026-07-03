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
      style={{
        background: 'rgba(255, 253, 249, 0.97)',
        border: '1px solid rgba(116, 55, 15, 0.12)',
        borderRadius: 12,
        padding: '10px 14px',
        boxShadow: '0 4px 20px rgba(77, 43, 20, 0.1)',
      }}
    >
      <p style={{ margin: 0, fontSize: 11, color: '#7f6d61' }}>{label}</p>
      <p
        style={{
          margin: '4px 0 0',
          fontSize: 15,
          fontWeight: 700,
          color: '#2f1c11',
          fontFamily: 'Georgia, serif',
        }}
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
                  stopColor="rgba(168, 93, 30, 0.2)"
                  stopOpacity={1}
                />
                <stop
                  offset="100%"
                  stopColor="rgba(168, 93, 30, 0.02)"
                  stopOpacity={1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(116, 55, 15, 0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#7f6d61' }}
              axisLine={{ stroke: 'rgba(116, 55, 15, 0.08)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#7f6d61' }}
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
              stroke="#a85d1e"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: '#a85d1e',
                stroke: '#fffaf4',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </DashboardCard>
  );
}

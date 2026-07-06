'use client';

import React from 'react';
import {
  LayoutGrid,
  Users,
  UserCheck,
  Scissors,
  Gift,
  Percent,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import type { AtAGlance } from '@/lib/dashboard/dashboard.types';
import DashboardCard from './DashboardCard';

interface AtAGlanceCardProps {
  data: AtAGlance;
  loading?: boolean;
}

interface GlanceItem {
  label: string;
  key: keyof AtAGlance;
  icon: React.ElementType;
  highlight?: 'amber' | 'red';
}

const items: GlanceItem[] = [
  { label: 'Total Clients', key: 'totalClients', icon: Users },
  { label: 'Active Technicians', key: 'activeTechnicians', icon: UserCheck },
  { label: 'Active Services', key: 'activeServices', icon: Scissors },
  { label: 'Active Packages', key: 'activePackages', icon: Gift },
  { label: 'Active Promotions', key: 'activePromotions', icon: Percent },
  {
    label: 'Pending Confirmations',
    key: 'pendingConfirmations',
    icon: Clock,
    highlight: 'amber',
  },
  {
    label: 'Low Stock Items',
    key: 'lowStockItems',
    icon: AlertTriangle,
    highlight: 'red',
  },
];

function getHighlightClasses(
  highlight: 'amber' | 'red' | undefined,
  value: number
) {
  if (!highlight || value === 0) {
    return {
      iconColor: 'text-[var(--admin-accent)]',
      iconBg: 'bg-[var(--admin-accent-soft)]',
      valueColor: 'text-[var(--admin-ink)]',
    };
  }
  if (highlight === 'red') {
    return {
      iconColor: 'text-[var(--admin-danger)]',
      iconBg: 'bg-[var(--admin-danger-soft)]',
      valueColor: 'text-[var(--admin-danger)]',
    };
  }
  return {
    iconColor: 'text-[var(--admin-warning)]',
    iconBg: 'bg-[var(--admin-warning-soft)]',
    valueColor: 'text-[var(--admin-warning)]',
  };
}

export default function AtAGlanceCard({
  data,
  loading = false,
}: AtAGlanceCardProps) {
  return (
    <DashboardCard title="At a Glance" icon={LayoutGrid} loading={loading}>
      <div className="grid grid-cols-2 gap-2.5">
        {items.map((item) => {
          const ItemIcon = item.icon;
          const value = data[item.key];
          const cls = getHighlightClasses(item.highlight, value);

          return (
            <div
              key={item.key}
              className="group flex items-center gap-2.5 rounded-[var(--admin-radius-md)] px-3 py-2.5 transition-colors duration-150 hover:bg-[var(--admin-surface-hover)]"
            >
              <div
                className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] ${cls.iconBg}`}
              >
                <ItemIcon
                  size={16}
                  className={cls.iconColor}
                  strokeWidth={1.8}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-px text-[11px] leading-tight text-[var(--admin-muted)]">
                  {item.label}
                </div>
                <div
                  className={`font-heading text-lg font-bold leading-none ${cls.valueColor}`}
                >
                  {value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}

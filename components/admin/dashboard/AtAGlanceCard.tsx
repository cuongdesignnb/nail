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

function getHighlightStyles(
  highlight: 'amber' | 'red' | undefined,
  value: number
) {
  if (!highlight || value === 0) {
    return {
      iconColor: '#9b591d',
      iconBg: 'rgba(155, 89, 29, 0.08)',
      valueColor: '#2f1c11',
    };
  }
  if (highlight === 'red') {
    return {
      iconColor: '#c53030',
      iconBg: 'rgba(197, 48, 48, 0.08)',
      valueColor: '#c53030',
    };
  }
  return {
    iconColor: '#e6a023',
    iconBg: 'rgba(230, 160, 35, 0.10)',
    valueColor: '#e6a023',
  };
}

export default function AtAGlanceCard({
  data,
  loading = false,
}: AtAGlanceCardProps) {
  return (
    <DashboardCard title="At a Glance" icon={LayoutGrid} loading={loading}>
      <div
        className="glance-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 10,
        }}
      >
        {items.map((item) => {
          const ItemIcon = item.icon;
          const value = data[item.key];
          const styles = getHighlightStyles(item.highlight, value);

          return (
            <div
              key={item.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 12,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'rgba(155, 89, 29, 0.03)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
              }
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: styles.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ItemIcon
                  size={16}
                  color={styles.iconColor}
                  strokeWidth={1.8}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: '#7f6d61',
                    lineHeight: 1.3,
                    marginBottom: 1,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: styles.valueColor,
                    fontFamily: 'Georgia, serif',
                    lineHeight: 1.1,
                  }}
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

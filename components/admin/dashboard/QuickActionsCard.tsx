'use client';

import React from 'react';
import Link from 'next/link';
import {
  Zap,
  CalendarPlus,
  UserPlus,
  Scissors,
  UserCog,
  Package,
  Percent,
  FileBarChart,
} from 'lucide-react';
import DashboardCard from './DashboardCard';

const actions = [
  { label: 'Create Booking', href: '/booking', icon: CalendarPlus },
  { label: 'Add Customer', href: '/admin/customers', icon: UserPlus },
  { label: 'Add Service', href: '/admin/services', icon: Scissors },
  { label: 'Add Technician', href: '/admin/technicians', icon: UserCog },
  { label: 'Manage Inventory', href: '/admin/inventory', icon: Package },
  { label: 'Create Promotion', href: '/admin/promotions', icon: Percent },
  { label: 'Export Report', href: '/admin/reports', icon: FileBarChart },
];

export default function QuickActionsCard() {
  return (
    <DashboardCard title="Quick Actions" icon={Zap}>
      <div className="quick-actions-grid">
        {actions.map((action) => {
          const ActionIcon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: '16px 8px',
                borderRadius: 14,
                textDecoration: 'none',
                transition: 'background 0.2s, transform 0.15s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(155, 89, 29, 0.06)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: 'rgba(155, 89, 29, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ActionIcon size={20} color="#9b591d" strokeWidth={1.8} />
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#2f1c11',
                  textAlign: 'center',
                  lineHeight: 1.3,
                }}
              >
                {action.label}
              </span>
            </Link>
          );
        })}

        <style jsx>{`
          .quick-actions-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 4px;
          }
          @media (max-width: 768px) {
            .quick-actions-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}</style>
      </div>
    </DashboardCard>
  );
}

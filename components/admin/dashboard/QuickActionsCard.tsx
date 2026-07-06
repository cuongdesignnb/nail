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
      <div className="grid grid-cols-2 gap-1 md:grid-cols-3">
        {actions.map((action) => {
          const ActionIcon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="group flex flex-col items-center gap-2 rounded-[14px] px-2 py-4 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--admin-accent-soft)]/50 focus-visible:outline-2 focus-visible:outline-[var(--admin-accent)]"
              aria-label={action.label}
            >
              <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[var(--admin-radius-md)] bg-[var(--admin-accent-soft)]">
                <ActionIcon size={20} className="text-[var(--admin-accent)]" strokeWidth={1.8} />
              </div>
              <span className="text-center text-xs font-medium leading-tight text-[var(--admin-ink)]">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </DashboardCard>
  );
}

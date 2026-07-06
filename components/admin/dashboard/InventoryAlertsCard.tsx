'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, Package } from 'lucide-react';
import type { DashboardOverview } from '@/lib/dashboard/dashboard.types';
import DashboardCard from './DashboardCard';

interface InventoryAlertsCardProps {
  alerts: DashboardOverview['inventoryAlerts'];
  loading?: boolean;
}

export default function InventoryAlertsCard({
  alerts,
  loading = false,
}: InventoryAlertsCardProps) {
  return (
    <DashboardCard
      title="Inventory Alerts"
      icon={AlertTriangle}
      loading={loading}
      action={{ label: 'Manage Inventory', href: '/admin/inventory' }}
    >
      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 px-5 py-10">
          <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[14px] bg-[var(--admin-success-soft)]">
            <CheckCircle size={24} className="text-[var(--admin-success)]" strokeWidth={1.8} />
          </div>
          <p className="m-0 text-center text-[13px] text-[var(--admin-muted)]">
            Inventory levels are healthy.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {alerts.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2.5 rounded-[var(--admin-radius-md)] border border-[var(--admin-danger-soft)] bg-[var(--admin-danger-soft)]/30 px-3 py-2.5"
            >
              <Package
                size={16}
                className="shrink-0 text-[var(--admin-danger)]"
                strokeWidth={1.8}
              />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold text-[var(--admin-ink)]">
                  {item.name}
                </div>
                <div className="mt-0.5 text-[11px] text-[var(--admin-muted)]">
                  {item.currentStock} / {item.reorderLevel} {item.unit}s
                </div>
              </div>
              <span className="inline-block whitespace-nowrap rounded-[var(--admin-radius-xs)] bg-[var(--admin-danger-soft)] px-2 py-[3px] text-[10px] font-bold uppercase tracking-wide text-[var(--admin-danger)]">
                Low Stock
              </span>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              background: 'rgba(63, 145, 66, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle size={24} color="#3f9142" strokeWidth={1.8} />
          </div>
          <p
            style={{
              fontSize: 13,
              color: '#7f6d61',
              textAlign: 'center',
              margin: 0,
            }}
          >
            Inventory levels are healthy.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {alerts.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 12,
                background: 'rgba(197, 48, 48, 0.03)',
                border: '1px solid rgba(197, 48, 48, 0.06)',
              }}
            >
              <Package
                size={16}
                color="#c53030"
                strokeWidth={1.8}
                style={{ flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#2f1c11',
                  }}
                >
                  {item.name}
                </div>
                <div style={{ fontSize: 11, color: '#7f6d61', marginTop: 2 }}>
                  {item.currentStock} / {item.reorderLevel} {item.unit}s
                </div>
              </div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#c53030',
                  background: 'rgba(197, 48, 48, 0.10)',
                  textTransform: 'uppercase',
                  letterSpacing: 0.3,
                  whiteSpace: 'nowrap',
                }}
              >
                Low Stock
              </span>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

'use client';

import React from 'react';
import { CalendarCheck, DollarSign, UserPlus, Star } from 'lucide-react';
import type { DashboardKpi } from '@/lib/dashboard/dashboard.types';
import DashboardKpiCard from './DashboardKpiCard';

interface DashboardKpiGridProps {
  kpis: {
    appointments: DashboardKpi;
    collectedRevenue: DashboardKpi;
    newClients: DashboardKpi;
    averageRating: DashboardKpi;
  };
}

export default function DashboardKpiGrid({ kpis }: DashboardKpiGridProps) {
  const items = [
    {
      label: kpis.appointments.label,
      formattedValue: kpis.appointments.formattedValue,
      changeLabel: kpis.appointments.changeLabel,
      trend: kpis.appointments.trend,
      icon: CalendarCheck,
    },
    {
      label: kpis.collectedRevenue.label,
      formattedValue: kpis.collectedRevenue.formattedValue,
      changeLabel: kpis.collectedRevenue.changeLabel,
      trend: kpis.collectedRevenue.trend,
      icon: DollarSign,
    },
    {
      label: kpis.newClients.label,
      formattedValue: kpis.newClients.formattedValue,
      changeLabel: kpis.newClients.changeLabel,
      trend: kpis.newClients.trend,
      icon: UserPlus,
    },
    {
      label: kpis.averageRating.label,
      formattedValue: kpis.averageRating.formattedValue,
      changeLabel: kpis.averageRating.changeLabel,
      trend: kpis.averageRating.trend,
      icon: Star,
    },
  ];

  return (
    <div className="kpi-grid" style={{ display: 'grid', gap: 20 }}>
      {items.map((item, i) => (
        <DashboardKpiCard key={item.label} {...item} index={i} />
      ))}
      <style jsx>{`
        .kpi-grid {
          grid-template-columns: repeat(4, 1fr);
        }
        @media (max-width: 1100px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .kpi-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

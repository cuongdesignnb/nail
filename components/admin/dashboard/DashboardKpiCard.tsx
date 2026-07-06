'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface DashboardKpiCardProps {
  label: string;
  formattedValue: string;
  changeLabel: string;
  trend: 'up' | 'down' | 'neutral' | 'new';
  icon: LucideIcon;
  index: number;
}

const trendConfig = {
  up: {
    textClass: 'text-[var(--admin-success)]',
    bgClass: 'bg-[var(--admin-success-soft)]',
    Icon: TrendingUp,
  },
  down: {
    textClass: 'text-[var(--admin-danger)]',
    bgClass: 'bg-[var(--admin-danger-soft)]',
    Icon: TrendingDown,
  },
  neutral: {
    textClass: 'text-[var(--admin-muted)]',
    bgClass: 'bg-[var(--admin-neutral-soft)]',
    Icon: Minus,
  },
  new: {
    textClass: 'text-[var(--admin-info)]',
    bgClass: 'bg-[var(--admin-info-soft)]',
    Icon: Sparkles,
  },
};

export default function DashboardKpiCard({
  label,
  formattedValue,
  changeLabel,
  trend,
  icon: Icon,
  index,
}: DashboardKpiCardProps) {
  const t = trendConfig[trend];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: 'easeOut',
        delay: index * 0.08,
      }}
      className="flex min-h-[132px] flex-col gap-3.5 rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-[var(--admin-shadow-sm)] transition-all duration-200 hover:shadow-[var(--admin-shadow-md)] hover:border-[var(--admin-border-strong)]"
    >
      {/* Top row: icon + label */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--admin-radius-md)] bg-[var(--admin-accent-soft)]">
          <Icon size={20} className="text-[var(--admin-accent)]" strokeWidth={1.8} />
        </div>
        <span className="text-[13px] font-medium text-[var(--admin-muted)] tracking-wide">
          {label}
        </span>
      </div>

      {/* Value — using Inter (font-sans), NOT Playfair */}
      <div className="text-[28px] font-bold leading-tight text-[var(--admin-ink)]">
        {formattedValue}
      </div>

      {/* Trend badge */}
      <div className="flex items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${t.bgClass} ${t.textClass}`}>
          <t.Icon size={13} strokeWidth={2.2} />
          {changeLabel}
        </span>
      </div>
    </motion.div>
  );
}

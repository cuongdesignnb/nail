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
  up: { color: '#3f9142', bg: 'rgba(63, 145, 66, 0.10)', Icon: TrendingUp },
  down: { color: '#c53030', bg: 'rgba(197, 48, 48, 0.10)', Icon: TrendingDown },
  neutral: { color: '#7f6d61', bg: 'rgba(127, 109, 97, 0.10)', Icon: Minus },
  new: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.10)', Icon: Sparkles },
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
      style={{
        background: 'rgba(255, 253, 249, 0.95)',
        border: '1px solid rgba(116, 55, 15, 0.08)',
        borderRadius: 20,
        boxShadow: '0 4px 24px rgba(77, 43, 20, 0.06)',
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Top row: icon + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'rgba(155, 89, 29, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={20} color="#9b591d" strokeWidth={1.8} />
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: '#7f6d61',
            letterSpacing: 0.2,
          }}
        >
          {label}
        </span>
      </div>

      {/* Value */}
      <div
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 28,
          fontWeight: 700,
          color: '#2f1c11',
          lineHeight: 1.1,
        }}
      >
        {formattedValue}
      </div>

      {/* Trend badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 8px',
            borderRadius: 8,
            background: t.bg,
            fontSize: 12,
            fontWeight: 600,
            color: t.color,
          }}
        >
          <t.Icon size={13} strokeWidth={2.2} />
          {changeLabel}
        </div>
      </div>
    </motion.div>
  );
}

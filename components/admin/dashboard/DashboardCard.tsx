'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export interface DashboardCardAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  action?: DashboardCardAction;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export default function DashboardCard({
  title,
  icon: Icon,
  action,
  children,
  className = '',
  loading = false,
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`relative flex flex-col overflow-hidden rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-[var(--admin-shadow-sm)] ${className}`}
    >
      {/* Shimmer overlay when loading */}
      {loading && (
        <div className="pointer-events-none absolute inset-0 z-[2] animate-[admin-shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-[var(--admin-accent-soft)]/20 to-transparent" />
      )}

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--admin-radius-sm)] bg-[var(--admin-accent-soft)]">
            <Icon size={18} className="text-[var(--admin-accent)]" strokeWidth={1.8} />
          </div>
          <h3 className="font-heading text-base font-semibold text-[var(--admin-ink)]">
            {title}
          </h3>
        </div>

        {action && (
          <>
            {action.href ? (
              <Link
                href={action.href}
                className="whitespace-nowrap text-[13px] font-medium text-[var(--admin-accent)] transition-colors hover:text-[var(--admin-accent-hover)]"
              >
                {action.label} →
              </Link>
            ) : (
              <button
                onClick={action.onClick}
                className="whitespace-nowrap bg-transparent text-[13px] font-medium text-[var(--admin-accent)] transition-colors hover:text-[var(--admin-accent-hover)]"
              >
                {action.label}
              </button>
            )}
          </>
        )}
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1">{children}</div>
    </motion.div>
  );
}

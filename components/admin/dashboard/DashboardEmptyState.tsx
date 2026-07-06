'use client';

import React from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface DashboardEmptyStateProps {
  icon: LucideIcon;
  message: string;
  action?: { label: string; href: string };
}

export default function DashboardEmptyState({
  icon: Icon,
  message,
  action,
}: DashboardEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-5 py-10">
      <div className="flex h-14 w-14 items-center justify-center rounded-[var(--admin-radius-lg)] bg-[var(--admin-accent-soft)]/60">
        <Icon size={26} className="text-[var(--admin-accent)]" strokeWidth={1.5} />
      </div>
      <p className="m-0 text-center text-sm leading-relaxed text-[var(--admin-muted)]">
        {message}
      </p>
      {action && (
        <Link
          href={action.href}
          className="mt-1 text-[13px] font-medium text-[var(--admin-accent)] no-underline transition-colors hover:text-[var(--admin-accent-hover)]"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}

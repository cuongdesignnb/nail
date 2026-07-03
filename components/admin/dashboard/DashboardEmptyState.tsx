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
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'rgba(155, 89, 29, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={26} color="#9b591d" strokeWidth={1.5} />
      </div>
      <p
        style={{
          fontSize: 14,
          color: '#7f6d61',
          textAlign: 'center',
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {message}
      </p>
      {action && (
        <Link
          href={action.href}
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: '#9b591d',
            textDecoration: 'none',
            marginTop: 4,
          }}
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}

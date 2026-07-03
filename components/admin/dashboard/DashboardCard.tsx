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
      className={className}
      style={{
        background: 'rgba(255, 253, 249, 0.95)',
        border: '1px solid rgba(116, 55, 15, 0.08)',
        borderRadius: 20,
        boxShadow: '0 4px 24px rgba(77, 43, 20, 0.06)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Shimmer overlay when loading */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, transparent 0%, rgba(155,89,29,0.04) 50%, transparent 100%)',
            animation: 'shimmer 1.8s infinite',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(155, 89, 29, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={18} color="#9b591d" strokeWidth={1.8} />
          </div>
          <h3
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 16,
              fontWeight: 600,
              color: '#2f1c11',
              margin: 0,
            }}
          >
            {title}
          </h3>
        </div>

        {action && (
          <>
            {action.href ? (
              <Link
                href={action.href}
                style={{
                  fontSize: 13,
                  color: '#9b591d',
                  textDecoration: 'none',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}
              >
                {action.label} →
              </Link>
            ) : (
              <button
                onClick={action.onClick}
                style={{
                  fontSize: 13,
                  color: '#9b591d',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}
              >
                {action.label}
              </button>
            )}
          </>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>

      {/* Shimmer keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </motion.div>
  );
}

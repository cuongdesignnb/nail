'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RefreshCw, CalendarPlus, CalendarDays } from 'lucide-react';

interface DashboardHeaderProps {
  adminName: string;
  onRefresh: () => void;
  loading: boolean;
}

export default function DashboardHeader({
  adminName,
  onRefresh,
  loading,
}: DashboardHeaderProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      {/* Left: text */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: '#9b591d',
            textTransform: 'uppercase',
            letterSpacing: 1.2,
          }}
        >
          {today}
        </span>
        <h1
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#2f1c11',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Welcome back, {adminName}
        </h1>
        <p
          style={{
            fontSize: 14,
            color: '#7f6d61',
            margin: 0,
          }}
        >
          Your salon dashboard overview
        </p>
      </div>

      {/* Right: actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <Link
          href="/booking"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 20px',
            borderRadius: 12,
            background: '#9b591d',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          <CalendarPlus size={15} strokeWidth={2} />
          Create Booking
        </Link>

        <Link
          href="/admin/calendar"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 20px',
            borderRadius: 12,
            background: 'rgba(155, 89, 29, 0.08)',
            color: '#9b591d',
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
            border: '1px solid rgba(155, 89, 29, 0.15)',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          <CalendarDays size={15} strokeWidth={2} />
          View Calendar
        </Link>

        <button
          onClick={onRefresh}
          disabled={loading}
          title="Refresh data"
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: '1px solid rgba(116, 55, 15, 0.12)',
            background: 'rgba(255, 253, 249, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'border-color 0.2s',
          }}
        >
          <RefreshCw
            size={16}
            color="#9b591d"
            strokeWidth={2}
            style={{
              animation: loading ? 'spin 1s linear infinite' : 'none',
            }}
          />
        </button>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </motion.div>
  );
}

'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

interface DashboardDateRangeControlProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const options = [
  { value: 'today', label: 'Today' },
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

export default function DashboardDateRangeControl({
  value,
  onChange,
  disabled = false,
}: DashboardDateRangeControlProps) {
  return (
    <div className="relative inline-flex items-center">
      <Calendar
        size={15}
        className="pointer-events-none absolute left-3 z-[1] text-[var(--admin-accent)]"
        strokeWidth={2}
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label="Select date range"
        className="min-w-[150px] cursor-pointer appearance-none rounded-[var(--admin-radius-md)] border border-[var(--admin-border)] bg-[var(--admin-surface)] py-2.5 pl-[34px] pr-9 text-[13px] font-medium text-[var(--admin-ink)] outline-none transition-colors duration-200 hover:border-[var(--admin-border-strong)] focus-visible:outline-2 focus-visible:outline-[var(--admin-accent)] disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23B76E45' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

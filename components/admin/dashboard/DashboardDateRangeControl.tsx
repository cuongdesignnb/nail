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
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <Calendar
        size={15}
        color="#9b591d"
        strokeWidth={2}
        style={{
          position: 'absolute',
          left: 12,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          padding: '10px 36px 10px 34px',
          borderRadius: 12,
          border: '1px solid rgba(116, 55, 15, 0.12)',
          background: 'rgba(255, 253, 249, 0.95)',
          color: '#2f1c11',
          fontSize: 13,
          fontWeight: 500,
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239b591d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          opacity: disabled ? 0.6 : 1,
          transition: 'border-color 0.2s',
          minWidth: 150,
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

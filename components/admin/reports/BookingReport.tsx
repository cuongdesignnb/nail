"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { AdminLoadingState } from "@/components/admin/ui";
import ExportControls from "./ExportControls";

interface BookingReportProps {
  from?: string;
  to?: string;
}

interface BookingData {
  byStatus: { status: string; count: number }[];
  dailyBookings: { date: string; count: number }[];
  total: number;
  cancelledCount: number;
  noShowCount: number;
  cancellationRate: number;
  noShowRate: number;
}

const STATUS_COLORS: Record<string, string> = {
  Completed: "#22c55e",
  Confirmed: "#3b82f6",
  Pending: "#f59e0b",
  Cancelled: "#ef4444",
  NoShow: "#8b5cf6",
  CheckedIn: "#A85D1E",
};

export default function BookingReport({ from, to }: BookingReportProps) {
  const [data, setData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        const res = await fetch(`/api/admin/reports/bookings?${params}`);
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error("Failed to load booking report:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [from, to]);

  if (loading) return <AdminLoadingState variant="card" />;
  if (!data) return <div className="text-sm text-[var(--admin-muted)] p-8 text-center">No booking data available</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: data.total },
          { label: "Cancelled", value: data.cancelledCount },
          { label: "Cancellation Rate", value: `${data.cancellationRate}%` },
          { label: "No-Show Rate", value: `${data.noShowRate}%` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[var(--admin-border)] bg-white p-5"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--admin-muted)]">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-[var(--admin-ink)]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-5">
          <h3 className="text-sm font-bold text-[var(--admin-ink)] mb-4">Bookings by Status</h3>
          {data.byStatus.length > 0 ? (
            <div className="flex flex-col items-center gap-4">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data.byStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={45}
                    paddingAngle={2}
                  >
                    {data.byStatus.map((entry) => (
                      <Cell
                        key={entry.status}
                        fill={STATUS_COLORS[entry.status] || "#ccc"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#FFF9F4",
                      border: "1px solid #EED9C2",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 justify-center">
                {data.byStatus.map((s) => (
                  <div key={s.status} className="flex items-center gap-1.5 text-xs">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: STATUS_COLORS[s.status] || "#ccc" }}
                    />
                    <span className="text-[var(--admin-ink)] font-medium">{s.status}</span>
                    <span className="text-[var(--admin-muted)]">({s.count})</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--admin-muted)] py-8 text-center">No data</p>
          )}
        </div>

        {/* Bookings Over Time */}
        <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[var(--admin-ink)] flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[var(--admin-accent)]" />
              Bookings Over Time
            </h3>
            <ExportControls data={data.dailyBookings} filename="bookings-daily" />
          </div>
          {data.dailyBookings.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.dailyBookings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EED9C2" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#8A4B19" }} />
                <YAxis tick={{ fontSize: 10, fill: "#8A4B19" }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "#FFF9F4",
                    border: "1px solid #EED9C2",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="#A85D1E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-[var(--admin-muted)] py-8 text-center">No data</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

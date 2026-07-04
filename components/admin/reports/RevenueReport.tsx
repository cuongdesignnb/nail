"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { AdminLoadingState } from "@/components/admin/ui";
import ExportControls from "./ExportControls";

interface RevenueReportProps {
  from?: string;
  to?: string;
}

interface RevenueData {
  dailyRevenue: { date: string; revenue: number }[];
  paymentMethods: { method: string; total: number }[];
  totalCollected: number;
  avgPerBooking: number;
  totalBookings: number;
}

const COLORS = ["#A85D1E", "#8A4B19", "#EED9C2", "#2F1C11", "#D4A574"];

export default function RevenueReport({ from, to }: RevenueReportProps) {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        const res = await fetch(`/api/admin/reports/revenue?${params}`);
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error("Failed to load revenue report:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [from, to]);

  if (loading) return <AdminLoadingState variant="card" />;
  if (!data) return <div className="text-sm text-aera-muted p-8 text-center">No revenue data available</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Collected", value: `$${data.totalCollected.toLocaleString()}` },
          { label: "Average per Booking", value: `$${data.avgPerBooking.toLocaleString()}` },
          { label: "Completed Bookings", value: data.totalBookings.toLocaleString() },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-aera-champagne/30 bg-white p-5"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-aera-muted">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-aera-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Over Time */}
      <div className="rounded-2xl border border-aera-champagne/30 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-aera-ink flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-aera-accent" />
            Revenue Over Time
          </h3>
          <ExportControls data={data.dailyRevenue} filename="revenue-daily" />
        </div>
        {data.dailyRevenue.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.dailyRevenue}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A85D1E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#A85D1E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EED9C2" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#8A4B19" }} />
              <YAxis tick={{ fontSize: 10, fill: "#8A4B19" }} />
              <Tooltip
                contentStyle={{
                  background: "#FFF9F4",
                  border: "1px solid #EED9C2",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#A85D1E"
                strokeWidth={2}
                fill="url(#revenueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-aera-muted py-8 text-center">No data for the selected range</p>
        )}
      </div>

      {/* Payment Methods */}
      {data.paymentMethods.length > 0 && (
        <div className="rounded-2xl border border-aera-champagne/30 bg-white p-5">
          <h3 className="text-sm font-bold text-aera-ink mb-4">Revenue by Payment Method</h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={data.paymentMethods}
                  dataKey="total"
                  nameKey="method"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                >
                  {data.paymentMethods.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
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
            <div className="space-y-2">
              {data.paymentMethods.map((pm, i) => (
                <div key={pm.method} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="font-semibold text-aera-ink capitalize">{pm.method}</span>
                  <span className="text-aera-muted">${pm.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

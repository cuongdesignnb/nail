"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Scissors } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AdminLoadingState, AdminTableShell } from "@/components/admin/ui";
import ExportControls from "./ExportControls";

interface ServiceReportProps {
  from?: string;
  to?: string;
}

interface ServiceData {
  id: string;
  name: string;
  price: number;
  bookings: number;
  revenue: number;
}

export default function ServiceReport({ from, to }: ServiceReportProps) {
  const [data, setData] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        const res = await fetch(`/api/admin/reports/services?${params}`);
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error("Failed to load service report:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [from, to]);

  if (loading) return <AdminLoadingState variant="card" />;

  const topByBookings = [...data].sort((a, b) => b.bookings - a.bookings).slice(0, 10);
  const topByRevenue = [...data].sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  const columns = [
    { key: "name", label: "Service" },
    { key: "price", label: "Price" },
    { key: "bookings", label: "Bookings" },
    { key: "revenue", label: "Revenue" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[var(--admin-ink)] flex items-center gap-2">
          <Scissors className="h-4 w-4 text-[var(--admin-accent)]" />
          Service Performance
        </h3>
        <ExportControls
          data={data.map((s) => ({
            Service: s.name,
            Price: s.price,
            Bookings: s.bookings,
            Revenue: s.revenue,
          }))}
          filename="service-performance"
        />
      </div>

      {/* Top by Bookings Chart */}
      {topByBookings.length > 0 && (
        <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-5">
          <h4 className="text-xs font-bold text-[var(--admin-ink)] mb-4 uppercase tracking-wider">
            Top Services by Bookings
          </h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topByBookings} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#EED9C2" />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#8A4B19" }} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 10, fill: "#2F1C11" }}
              />
              <Tooltip
                contentStyle={{
                  background: "#FFF9F4",
                  border: "1px solid #EED9C2",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="bookings" fill="#A85D1E" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Services Table */}
      <AdminTableShell
        columns={columns}
        empty={data.length === 0}
        emptyTitle="No service data"
        emptyDescription="No completed bookings with services in the selected range."
      >
        {topByRevenue.map((svc) => (
          <tr key={svc.id} className="hover:bg-[var(--admin-surface-muted)] transition-colors">
            <td className="px-5 py-3 text-xs font-semibold text-[var(--admin-ink)]">{svc.name}</td>
            <td className="px-5 py-3 text-xs text-[var(--admin-muted)]">${svc.price}</td>
            <td className="px-5 py-3 text-xs font-semibold text-[var(--admin-ink)]">{svc.bookings}</td>
            <td className="px-5 py-3 text-xs font-semibold text-[var(--admin-ink)]">
              ${svc.revenue.toLocaleString()}
            </td>
          </tr>
        ))}
      </AdminTableShell>
    </motion.div>
  );
}

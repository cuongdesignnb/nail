"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Users } from "lucide-react";
import { AdminLoadingState, AdminTableShell } from "@/components/admin/ui";
import ExportControls from "./ExportControls";

interface TechnicianReportProps {
  from?: string;
  to?: string;
}

interface TechData {
  id: string;
  name: string;
  specialty: string;
  avatar: string | null;
  completed: number;
  revenue: number;
  avgRating: number;
}

export default function TechnicianReport({ from, to }: TechnicianReportProps) {
  const [data, setData] = useState<TechData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        const res = await fetch(`/api/admin/reports/technicians?${params}`);
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error("Failed to load technician report:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [from, to]);

  if (loading) return <AdminLoadingState variant="table" />;

  const columns = [
    { key: "name", label: "Technician" },
    { key: "specialty", label: "Specialty" },
    { key: "completed", label: "Completed" },
    { key: "revenue", label: "Revenue" },
    { key: "rating", label: "Rating" },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className="h-3 w-3"
            fill={s <= rating ? "#A85D1E" : "transparent"}
            stroke={s <= rating ? "#A85D1E" : "#EED9C2"}
          />
        ))}
        <span className="ml-1 text-[10px] text-[var(--admin-muted)]">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[var(--admin-ink)] flex items-center gap-2">
          <Users className="h-4 w-4 text-[var(--admin-accent)]" />
          Technician Performance
        </h3>
        <ExportControls
          data={data.map((t) => ({
            Name: t.name,
            Specialty: t.specialty,
            Completed: t.completed,
            Revenue: t.revenue,
            Rating: t.avgRating,
          }))}
          filename="technician-performance"
        />
      </div>

      <AdminTableShell
        columns={columns}
        empty={data.length === 0}
        emptyTitle="No technician data"
        emptyDescription="No completed appointments in the selected range."
      >
        {data.map((tech) => (
          <tr key={tech.id} className="hover:bg-[var(--admin-surface-muted)] transition-colors">
            <td className="px-5 py-3">
              <div className="flex items-center gap-3">
                {tech.avatar ? (
                  <img
                    src={tech.avatar}
                    alt={tech.name}
                    className="h-8 w-8 rounded-full object-cover border border-[var(--admin-border)]/40"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-[var(--admin-surface-muted)] flex items-center justify-center text-[10px] font-bold text-[var(--admin-ink)]">
                    {tech.name.charAt(0)}
                  </div>
                )}
                <span className="text-xs font-semibold text-[var(--admin-ink)]">{tech.name}</span>
              </div>
            </td>
            <td className="px-5 py-3 text-xs text-[var(--admin-muted)]">{tech.specialty}</td>
            <td className="px-5 py-3 text-xs font-semibold text-[var(--admin-ink)]">{tech.completed}</td>
            <td className="px-5 py-3 text-xs font-semibold text-[var(--admin-ink)]">
              ${tech.revenue.toLocaleString()}
            </td>
            <td className="px-5 py-3">{renderStars(tech.avgRating)}</td>
          </tr>
        ))}
      </AdminTableShell>
    </motion.div>
  );
}

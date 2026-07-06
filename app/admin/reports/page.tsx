"use client";

import React, { useEffect, useState, useCallback } from "react";
import { BarChart3, Download, Calendar } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AdminPageHeader, AdminButton } from "@/components/admin/ui";

type TabKey = "revenue" | "bookings" | "technicians" | "services" | "inventory";

const TABS: { key: TabKey; label: string }[] = [
  { key: "revenue", label: "Revenue" },
  { key: "bookings", label: "Bookings" },
  { key: "technicians", label: "Technicians" },
  { key: "services", label: "Services" },
  { key: "inventory", label: "Inventory" },
];

const COLORS = ["#a85d1e", "#c4803e", "#d9b894", "#eed9c2", "#8a4b19", "#74370f"];

export default function AdminReportsPage() {
  const [tab, setTab] = useState<TabKey>("revenue");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("last30");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/reports/${tab}?range=${range}`);
      if (res.status === 401) { window.location.href = "/login?next=/admin/reports"; return; }
      const json = await res.json();
      setData(json.data);
    } catch { setData(null); }
    finally { setLoading(false); }
  }, [tab, range]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const exportCsv = () => {
    if (!data?.rows) return;
    const headers = Object.keys(data.rows[0] || {}).join(",");
    const rows = data.rows.map((r: any) => Object.values(r).join(",")).join("\n");
    const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${tab}-report.csv`;
    a.click();
  };

  return (
    <div className="admin-page-container">
      <AdminPageHeader
        eyebrow="Analytics"
        title="Reports"
        description="Business analytics & insights"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Reports" },
        ]}
        actions={
          <div className="flex gap-2">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="px-3.5 py-2 border border-[var(--admin-border)] rounded-[var(--admin-radius-md)] text-[13px] bg-white text-[var(--admin-ink)] focus:outline-none focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)]/20"
            >
              <option value="last7">Last 7 days</option>
              <option value="last30">Last 30 days</option>
              <option value="thisMonth">This Month</option>
              <option value="thisYear">This Year</option>
            </select>
            <AdminButton
              variant="secondary"
              size="md"
              icon={<Download size={14} />}
              onClick={exportCsv}
            >
              Export CSV
            </AdminButton>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[var(--admin-border)]">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-[13px] transition-all duration-[var(--admin-transition-fast)] border-b-2 bg-transparent cursor-pointer ${
              tab === t.key
                ? "font-bold text-[var(--admin-accent)] border-[var(--admin-accent)]"
                : "font-medium text-[var(--admin-muted)] border-transparent hover:text-[var(--admin-ink)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-[var(--admin-surface)] rounded-[var(--admin-radius-xl)] border border-[var(--admin-border)] p-6 shadow-[var(--admin-shadow-sm)]">
        {loading ? (
          <div className="py-10 text-center text-[var(--admin-muted)] text-sm">Loading report...</div>
        ) : !data ? (
          <div className="py-16 text-center">
            <BarChart3 size={40} className="text-[var(--admin-border-strong)] mb-3 mx-auto" />
            <p className="text-[15px] font-semibold text-[var(--admin-ink)]">No data available</p>
            <p className="text-[13px] text-[var(--admin-muted)] mt-1">Report data will appear here once you have business activity.</p>
          </div>
        ) : (
          <div>
            {/* Summary Cards */}
            {data.summary && (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 mb-6">
                {Object.entries(data.summary).map(([key, value]) => (
                  <div key={key} className="p-4 bg-[var(--admin-surface-muted)] rounded-[var(--admin-radius-lg)]">
                    <div className="text-[11px] text-[var(--admin-muted)] uppercase tracking-wider font-bold">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                    <div className="text-[22px] font-extrabold text-[var(--admin-ink)] mt-1">{String(value)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Chart */}
            {data.chart && data.chart.length > 0 && (
              <div className="h-[300px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(116,55,15,0.06)" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#7f6d61" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#7f6d61" }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid rgba(116,55,15,0.1)" }} />
                    <Area type="monotone" dataKey="value" stroke="#a85d1e" fill="rgba(168,93,30,0.1)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Table */}
            {data.rows && data.rows.length > 0 && (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[var(--admin-border)]">
                    {Object.keys(data.rows[0]).map((h) => (
                      <th key={h} className="px-3.5 py-2.5 text-[11px] font-extrabold tracking-wider uppercase text-[var(--admin-muted)] text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row: any, i: number) => (
                    <tr key={i} className="border-b border-[var(--admin-border)]/30 hover:bg-[var(--admin-surface-hover)] transition-colors">
                      {Object.values(row).map((v, j) => (
                        <td key={j} className="px-3.5 py-2.5 text-[13px] text-[var(--admin-ink)]">{String(v)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

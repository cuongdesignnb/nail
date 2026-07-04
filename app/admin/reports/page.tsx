"use client";

import React, { useEffect, useState, useCallback } from "react";
import { BarChart3, Download, Calendar } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
    <div style={{ padding: "0 32px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#2f1c11", fontFamily: "var(--font-display)" }}>Reports</h1>
          <p style={{ fontSize: 13, color: "#7f6d61", marginTop: 4 }}>Business analytics & insights</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={range} onChange={(e) => setRange(e.target.value)} style={{ padding: "8px 14px", border: "1px solid rgba(116,55,15,0.12)", borderRadius: 10, fontSize: 13, background: "white" }}>
            <option value="last7">Last 7 days</option>
            <option value="last30">Last 30 days</option>
            <option value="thisMonth">This Month</option>
            <option value="thisYear">This Year</option>
          </select>
          <button onClick={exportCsv} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "1px solid rgba(116,55,15,0.12)", borderRadius: 10, fontSize: 13, fontWeight: 600, background: "white", color: "#4a2d1e", cursor: "pointer" }}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid rgba(116,55,15,0.08)", paddingBottom: 0 }}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "10px 18px", fontSize: 13, fontWeight: tab === t.key ? 700 : 500, color: tab === t.key ? "#a85d1e" : "#7f6d61", background: "transparent", border: "none", borderBottom: tab === t.key ? "2px solid #a85d1e" : "2px solid transparent", cursor: "pointer", transition: "all 0.15s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid rgba(116,55,15,0.08)", padding: 24 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#7f6d61" }}>Loading report...</div>
        ) : !data ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <BarChart3 size={40} style={{ color: "#d9b894", marginBottom: 12 }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: "#4a2d1e" }}>No data available</p>
            <p style={{ fontSize: 13, color: "#7f6d61" }}>Report data will appear here once you have business activity.</p>
          </div>
        ) : (
          <div>
            {/* Summary Cards */}
            {data.summary && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
                {Object.entries(data.summary).map(([key, value]) => (
                  <div key={key} style={{ padding: 16, background: "#faf7f3", borderRadius: 12 }}>
                    <div style={{ fontSize: 11, color: "#7f6d61", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>{key.replace(/([A-Z])/g, " $1").trim()}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#2f1c11", marginTop: 4 }}>{String(value)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Chart */}
            {data.chart && data.chart.length > 0 && (
              <div style={{ height: 300, marginBottom: 24 }}>
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
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(116,55,15,0.08)" }}>
                    {Object.keys(data.rows[0]).map((h) => (
                      <th key={h} style={{ padding: "10px 14px", fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: "#7f6d61", textAlign: "left" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row: any, i: number) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(116,55,15,0.04)" }}>
                      {Object.values(row).map((v, j) => (
                        <td key={j} style={{ padding: "10px 14px", fontSize: 13, color: "#4a2d1e" }}>{String(v)}</td>
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

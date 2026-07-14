"use client";

import React from "react";

type Row = { setting: string; adminValue: unknown; databaseValue: unknown; publishedValue: unknown; publicValue: unknown; status: string };

export function SettingsDiagnostics() {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const load = React.useCallback(async (method = "GET") => {
    setLoading(true); setError("");
    const response = await fetch("/api/admin/settings/diagnostics", { method, cache: "no-store" });
    const json = await response.json(); setLoading(false);
    if (!response.ok || !json.success) { setError(json.error || "Unable to run diagnostics."); return; }
    setRows(json.data.rows);
  }, []);
  React.useEffect(() => { load(); }, [load]);
  return <div className="space-y-4">
    <div className="flex justify-between"><div><h1 className="text-xl font-bold">Settings Diagnostics</h1><p className="text-xs text-[var(--admin-muted)]">Owner-only, read-only canonical persistence matrix. Secrets are never included.</p></div><button onClick={() => load("POST")} disabled={loading} className="rounded-full bg-[var(--admin-accent)] px-4 py-2 text-xs font-bold text-white">{loading ? "Checking..." : "Run Settings Health Check"}</button></div>
    {error && <p className="rounded-xl bg-red-50 p-3 text-xs text-red-700">{error}</p>}
    <div className="overflow-x-auto rounded-xl border bg-white"><table className="min-w-full text-left text-xs"><thead><tr>{["Setting", "Admin value", "Database value", "Published value", "Public resolved value", "Status"].map((label) => <th key={label} className="border-b p-3">{label}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.setting}>{[row.setting, row.adminValue, row.databaseValue, row.publishedValue, row.publicValue].map((value, index) => <td key={index} className="max-w-64 break-words border-b p-3">{typeof value === "string" ? value : JSON.stringify(value)}</td>)}<td className={`border-b p-3 font-bold ${row.status === "OK" ? "text-emerald-600" : "text-red-600"}`}>{row.status}</td></tr>)}</tbody></table></div>
  </div>;
}

"use client";

import React from "react";
import { Download } from "lucide-react";

interface ExportControlsProps {
  data: Record<string, unknown>[];
  filename?: string;
  label?: string;
}

function toCsv(data: Record<string, unknown>[]): string {
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((h) => {
        const val = row[h];
        const str = val === null || val === undefined ? "" : String(val);
        return str.includes(",") || str.includes('"') || str.includes("\n")
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      })
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

export default function ExportControls({
  data,
  filename = "report",
  label = "Export CSV",
}: ExportControlsProps) {
  const handleExport = () => {
    if (data.length === 0) return;
    const csv = toCsv(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={data.length === 0}
      className="inline-flex items-center gap-2 rounded-full border border-aera-champagne/60 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-aera-ink shadow-sm transition-colors hover:bg-aera-champagne/20 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <Download className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

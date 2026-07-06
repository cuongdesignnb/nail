"use client";

import React, { useState } from "react";
import {
  DollarSign, CalendarDays, Users, Scissors, Package,
} from "lucide-react";
import { AdminPageHeader, AdminTabs } from "@/components/admin/ui";
import RevenueReport from "./RevenueReport";
import BookingReport from "./BookingReport";
import TechnicianReport from "./TechnicianReport";
import ServiceReport from "./ServiceReport";
import InventoryReport from "./InventoryReport";

const REPORT_TABS = [
  { key: "revenue", label: "Revenue", icon: DollarSign },
  { key: "bookings", label: "Bookings", icon: CalendarDays },
  { key: "technicians", label: "Technicians", icon: Users },
  { key: "services", label: "Services", icon: Scissors },
  { key: "inventory", label: "Inventory", icon: Package },
];

export default function ReportDashboard() {
  const [activeTab, setActiveTab] = useState("revenue");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    to: new Date().toISOString().slice(0, 10),
  });

  const inputClass =
    "rounded-xl border border-[var(--admin-border-strong)] bg-white px-3 py-2 text-xs text-[var(--admin-ink)] focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20";

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Reports"
        description="Revenue, bookings, technician performance, service insights and inventory analytics."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Reports" },
        ]}
      />

      {/* Date Range Filter */}
      {activeTab !== "inventory" && (
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--admin-muted)]">
            Date Range
          </label>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
            className={inputClass}
          />
          <span className="text-xs text-[var(--admin-muted)]">to</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
            className={inputClass}
          />
        </div>
      )}

      <AdminTabs tabs={REPORT_TABS} activeKey={activeTab} onChange={setActiveTab}>
        {activeTab === "revenue" && (
          <RevenueReport from={dateRange.from} to={dateRange.to} />
        )}
        {activeTab === "bookings" && (
          <BookingReport from={dateRange.from} to={dateRange.to} />
        )}
        {activeTab === "technicians" && (
          <TechnicianReport from={dateRange.from} to={dateRange.to} />
        )}
        {activeTab === "services" && (
          <ServiceReport from={dateRange.from} to={dateRange.to} />
        )}
        {activeTab === "inventory" && <InventoryReport />}
      </AdminTabs>
    </div>
  );
}

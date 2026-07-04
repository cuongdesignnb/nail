"use client";

import React, { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Calendar, Search, Filter, Plus, Eye } from "lucide-react";
import Link from "next/link";

interface Booking {
  id: string;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  services: string[];
  technician: string;
  scheduledStartAt: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Pending: { bg: "rgba(234, 179, 8, 0.1)", color: "#b45309" },
  Confirmed: { bg: "rgba(59, 130, 246, 0.1)", color: "#1d4ed8" },
  "Checked In": { bg: "rgba(168, 93, 30, 0.1)", color: "#a85d1e" },
  "In Service": { bg: "rgba(168, 93, 30, 0.15)", color: "#8a4b19" },
  Completed: { bg: "rgba(34, 197, 94, 0.1)", color: "#15803d" },
  Cancelled: { bg: "rgba(239, 68, 68, 0.08)", color: "#dc2626" },
  "No Show": { bg: "rgba(107, 114, 128, 0.1)", color: "#4b5563" },
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/admin/bookings?${params}`);
      if (res.status === 401) { window.location.href = "/login?next=/admin/bookings"; return; }
      const json = await res.json();
      setBookings(json.data || []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  return (
    <div style={{ padding: "0 32px 32px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#2f1c11", fontFamily: "var(--font-display)" }}>Bookings</h1>
          <p style={{ fontSize: 13, color: "#7f6d61", marginTop: 4 }}>Manage appointments, track status & payments</p>
        </div>
        <Link href="/booking" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "linear-gradient(135deg, #a85d1e, #c4803e)", color: "white", borderRadius: 12, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
          <Plus size={16} /> New Booking
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: 11, color: "#7f6d61" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, code, email..."
            style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid rgba(116,55,15,0.12)", borderRadius: 10, fontSize: 13, background: "white", outline: "none" }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "10px 14px", border: "1px solid rgba(116,55,15,0.12)", borderRadius: 10, fontSize: 13, background: "white", color: "#4a2d1e" }}
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Checked In">Checked In</option>
          <option value="In Service">In Service</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="No Show">No Show</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid rgba(116,55,15,0.08)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#7f6d61" }}>Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <Calendar size={40} style={{ color: "#d9b894", marginBottom: 12 }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: "#4a2d1e" }}>No bookings found</p>
            <p style={{ fontSize: 13, color: "#7f6d61", marginTop: 4 }}>Bookings will appear here once created.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(116,55,15,0.08)" }}>
                {["Code", "Client", "Services", "Technician", "Scheduled", "Status", "Payment", ""].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: "#7f6d61", textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => {
                const sc = STATUS_COLORS[b.status] || STATUS_COLORS.Pending;
                return (
                  <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} style={{ borderBottom: "1px solid rgba(116,55,15,0.04)" }}>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: "#a85d1e" }}>{b.bookingCode}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#2f1c11" }}>{b.customerName}</div>
                      <div style={{ fontSize: 11, color: "#7f6d61" }}>{b.customerEmail}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#4a2d1e" }}>{b.services?.join(", ") || "—"}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#4a2d1e" }}>{b.technician || "Any"}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#4a2d1e" }}>{format(new Date(b.scheduledStartAt), "MMM d, h:mm a")}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.color }}>{b.status}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: b.paymentStatus === "Paid" ? "#15803d" : "#b45309" }}>{b.paymentStatus}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <Link href={`/admin/bookings/${b.id}`} style={{ color: "#a85d1e" }}><Eye size={16} /></Link>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { format, startOfWeek, addDays, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";

interface CalendarBooking {
  id: string;
  bookingCode: string;
  customerName: string;
  services: string[];
  technician: string;
  scheduledStartAt: string;
  status: string;
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "#eab308", Confirmed: "#3b82f6", "Checked In": "#a85d1e",
  "In Service": "#8a4b19", Completed: "#22c55e", Cancelled: "#ef4444", "No Show": "#6b7280",
};

export default function AdminCalendarPage() {
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/bookings");
      if (res.status === 401) { window.location.href = "/login?next=/admin/calendar"; return; }
      const json = await res.json();
      setBookings(json.data || []);
    } catch { setBookings([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8am-7pm

  const getBookingsForSlot = (day: Date, hour: number) => {
    return bookings.filter((b) => {
      const d = parseISO(b.scheduledStartAt);
      return d.getDate() === day.getDate() && d.getMonth() === day.getMonth() && d.getHours() === hour;
    });
  };

  return (
    <div style={{ padding: "0 32px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#2f1c11", fontFamily: "var(--font-display)" }}>Calendar</h1>
          <p style={{ fontSize: 13, color: "#7f6d61", marginTop: 4 }}>Weekly appointment view</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setWeekStart((d) => addDays(d, -7))} style={navBtn}><ChevronLeft size={16} /></button>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#2f1c11", minWidth: 200, textAlign: "center" }}>
            {format(weekStart, "MMM d")} — {format(addDays(weekStart, 6), "MMM d, yyyy")}
          </span>
          <button onClick={() => setWeekStart((d) => addDays(d, 7))} style={navBtn}><ChevronRight size={16} /></button>
          <button onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))} style={{ ...navBtn, padding: "8px 14px", fontSize: 12 }}>Today</button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "#7f6d61" }}>Loading calendar...</div>
      ) : (
        <div style={{ background: "white", borderRadius: 16, border: "1px solid rgba(116,55,15,0.08)", overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: 60 }}><Clock size={14} /></th>
                {days.map((d) => (
                  <th key={d.toISOString()} style={{ ...thStyle, background: d.toDateString() === new Date().toDateString() ? "rgba(168,93,30,0.06)" : undefined }}>
                    <div style={{ fontSize: 11, color: "#7f6d61" }}>{format(d, "EEE")}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: d.toDateString() === new Date().toDateString() ? "#a85d1e" : "#2f1c11" }}>{format(d, "d")}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour) => (
                <tr key={hour}>
                  <td style={{ padding: "8px", fontSize: 11, color: "#7f6d61", textAlign: "center", borderRight: "1px solid rgba(116,55,15,0.06)" }}>
                    {hour > 12 ? `${hour - 12}pm` : hour === 12 ? "12pm" : `${hour}am`}
                  </td>
                  {days.map((day) => {
                    const slot = getBookingsForSlot(day, hour);
                    return (
                      <td key={day.toISOString() + hour} style={{ padding: 4, borderRight: "1px solid rgba(116,55,15,0.04)", borderBottom: "1px solid rgba(116,55,15,0.04)", verticalAlign: "top", height: 60, background: day.toDateString() === new Date().toDateString() ? "rgba(168,93,30,0.02)" : undefined }}>
                        {slot.map((b) => (
                          <div key={b.id} style={{ background: STATUS_COLORS[b.status] + "18", borderLeft: `3px solid ${STATUS_COLORS[b.status] || "#a85d1e"}`, borderRadius: 6, padding: "4px 8px", marginBottom: 2, fontSize: 11, cursor: "pointer" }}>
                            <div style={{ fontWeight: 700, color: "#2f1c11" }}>{b.customerName}</div>
                            <div style={{ color: "#7f6d61" }}>{b.services[0]}</div>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const navBtn: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center",
  width: 32, height: 32, borderRadius: 8, background: "white",
  border: "1px solid rgba(116,55,15,0.12)", color: "#4a2d1e", cursor: "pointer",
};
const thStyle: React.CSSProperties = {
  padding: "12px 8px", textAlign: "center", borderBottom: "1px solid rgba(116,55,15,0.08)",
  borderRight: "1px solid rgba(116,55,15,0.06)",
};

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { UserCircle, Search, Eye, Mail, Phone } from "lucide-react";
import Link from "next/link";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpend: number;
  lastVisit: string | null;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/customers?${params}`);
      if (res.status === 401) { window.location.href = "/login?next=/admin/customers"; return; }
      const json = await res.json();
      setCustomers(json.data || []);
    } catch { setCustomers([]); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div style={{ padding: "0 32px 32px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#2f1c11", fontFamily: "var(--font-display)" }}>Customers</h1>
        <p style={{ fontSize: 13, color: "#7f6d61", marginTop: 4 }}>View customer profiles, booking history & preferences</p>
      </div>

      <div style={{ marginBottom: 20, position: "relative", maxWidth: 400 }}>
        <Search size={16} style={{ position: "absolute", left: 12, top: 11, color: "#7f6d61" }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, phone..." style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid rgba(116,55,15,0.12)", borderRadius: 10, fontSize: 13, background: "white" }} />
      </div>

      <div style={{ background: "white", borderRadius: 16, border: "1px solid rgba(116,55,15,0.08)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#7f6d61" }}>Loading...</div>
        ) : customers.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <UserCircle size={40} style={{ color: "#d9b894", marginBottom: 12 }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: "#4a2d1e" }}>No customers found</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(116,55,15,0.08)" }}>
                {["Name", "Email", "Phone", "Bookings", "Total Spend", "Last Visit", ""].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: "#7f6d61", textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} style={{ borderBottom: "1px solid rgba(116,55,15,0.04)" }}>
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#2f1c11" }}>{c.firstName} {c.lastName}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#4a2d1e" }}>{c.email}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#4a2d1e" }}>{c.phone || "—"}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: "#a85d1e" }}>{c.totalBookings}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: "#2f1c11" }}>${c.totalSpend?.toFixed(2)}</td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#7f6d61" }}>{c.lastVisit ? new Date(c.lastVisit).toLocaleDateString() : "Never"}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <Link href={`/admin/customers/${c.id}`} style={{ color: "#a85d1e" }}><Eye size={16} /></Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, Search, Plus, Star, Eye } from "lucide-react";
import Link from "next/link";

interface Technician {
  id: string;
  name: string;
  email: string;
  specialty: string;
  rating: number;
  isActive: boolean;
  bookingsCount: number;
}

export default function AdminTechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/technicians${search ? `?search=${search}` : ""}`);
      if (res.status === 401) { window.location.href = "/login?next=/admin/technicians"; return; }
      const json = await res.json();
      setTechnicians(json.data || []);
    } catch { setTechnicians([]); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div style={{ padding: "0 32px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#2f1c11", fontFamily: "var(--font-display)" }}>Technicians</h1>
          <p style={{ fontSize: 13, color: "#7f6d61", marginTop: 4 }}>Manage your nail artists and specialists</p>
        </div>
      </div>

      <div style={{ marginBottom: 20, position: "relative", maxWidth: 400 }}>
        <Search size={16} style={{ position: "absolute", left: 12, top: 11, color: "#7f6d61" }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search technicians..." style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid rgba(116,55,15,0.12)", borderRadius: 10, fontSize: 13, background: "white" }} />
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "#7f6d61" }}>Loading...</div>
      ) : technicians.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", background: "white", borderRadius: 16 }}>
          <Users size={40} style={{ color: "#d9b894", marginBottom: 12 }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: "#4a2d1e" }}>No technicians found</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {technicians.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/admin/technicians/${t.id}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "white", borderRadius: 16, border: "1px solid rgba(116,55,15,0.08)", padding: 20, transition: "all 0.2s", cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#2f1c11" }}>{t.name}</h3>
                      <p style={{ fontSize: 12, color: "#7f6d61", marginTop: 2 }}>{t.specialty || "General"}</p>
                    </div>
                    <span style={{ padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: t.isActive ? "rgba(34,197,94,0.1)" : "rgba(107,114,128,0.1)", color: t.isActive ? "#15803d" : "#4b5563" }}>
                      {t.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
                    <div><span style={{ fontSize: 11, color: "#7f6d61" }}>Rating</span><div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}><Star size={13} fill="#eab308" color="#eab308" /><span style={{ fontSize: 14, fontWeight: 700, color: "#2f1c11" }}>{t.rating?.toFixed(1) || "N/A"}</span></div></div>
                    <div><span style={{ fontSize: 11, color: "#7f6d61" }}>Bookings</span><div style={{ fontSize: 14, fontWeight: 700, color: "#2f1c11", marginTop: 2 }}>{t.bookingsCount || 0}</div></div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

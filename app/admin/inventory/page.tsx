"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Package, Search, AlertTriangle, Eye } from "lucide-react";
import Link from "next/link";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  currentStock: number;
  reorderLevel: number;
  supplier: string;
  costPerUnit: number;
  isActive: boolean;
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/inventory?${params}`);
      if (res.status === 401) { window.location.href = "/login?next=/admin/inventory"; return; }
      const json = await res.json();
      setItems(json.data || []);
    } catch { setItems([]); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div style={{ padding: "0 32px 32px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#2f1c11", fontFamily: "var(--font-display)" }}>Inventory</h1>
        <p style={{ fontSize: 13, color: "#7f6d61", marginTop: 4 }}>Track stock levels, suppliers & reorder alerts</p>
      </div>

      <div style={{ marginBottom: 20, position: "relative", maxWidth: 400 }}>
        <Search size={16} style={{ position: "absolute", left: 12, top: 11, color: "#7f6d61" }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search inventory..." style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid rgba(116,55,15,0.12)", borderRadius: 10, fontSize: 13, background: "white" }} />
      </div>

      <div style={{ background: "white", borderRadius: 16, border: "1px solid rgba(116,55,15,0.08)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#7f6d61" }}>Loading...</div>
        ) : items.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <Package size={40} style={{ color: "#d9b894", marginBottom: 12 }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: "#4a2d1e" }}>No inventory items</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(116,55,15,0.08)" }}>
                {["Name", "SKU", "Category", "Stock", "Reorder Level", "Supplier", "Cost", ""].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: "#7f6d61", textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const isLow = item.currentStock <= item.reorderLevel;
                return (
                  <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} style={{ borderBottom: "1px solid rgba(116,55,15,0.04)", background: isLow ? "rgba(234,179,8,0.03)" : undefined }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {isLow && <AlertTriangle size={14} color="#b45309" />}
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#2f1c11" }}>{item.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "#7f6d61", fontFamily: "monospace" }}>{item.sku}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#4a2d1e" }}>{item.category}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: isLow ? "#b45309" : "#15803d" }}>{item.currentStock}</span>
                      <span style={{ fontSize: 12, color: "#7f6d61", marginLeft: 4 }}>{item.unit}</span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#7f6d61" }}>{item.reorderLevel}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#4a2d1e" }}>{item.supplier || "—"}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#2f1c11" }}>${Number(item.costPerUnit).toFixed(2)}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <Link href={`/admin/inventory/${item.id}`} style={{ color: "#a85d1e" }}><Eye size={16} /></Link>
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

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, AlertTriangle } from "lucide-react";
import { AdminLoadingState, AdminTableShell } from "@/components/admin/ui";
import ExportControls from "./ExportControls";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  currentStock: number;
  reorderLevel: number;
  costPerUnit: number;
  isLowStock: boolean;
  movements: {
    id: string;
    type: string;
    quantity: number;
    previousStock: number;
    newStock: number;
    reason: string | null;
    createdAt: string;
  }[];
}

interface InventoryData {
  items: InventoryItem[];
  lowStockItems: InventoryItem[];
  totalItems: number;
  lowStockCount: number;
}

export default function InventoryReport() {
  const [data, setData] = useState<InventoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/reports/inventory");
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error("Failed to load inventory report:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <AdminLoadingState variant="table" />;
  if (!data) return <div className="text-sm text-[var(--admin-muted)] p-8 text-center">No inventory data</div>;

  const columns = [
    { key: "name", label: "Item" },
    { key: "sku", label: "SKU" },
    { key: "category", label: "Category" },
    { key: "stock", label: "Stock" },
    { key: "reorder", label: "Reorder Level" },
    { key: "status", label: "Status" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--admin-muted)]">Total Items</p>
          <p className="mt-1 text-2xl font-bold text-[var(--admin-ink)]">{data.totalItems}</p>
        </div>
        <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-5">
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--admin-muted)]">Low Stock</p>
            {data.lowStockCount > 0 && (
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            )}
          </div>
          <p className="mt-1 text-2xl font-bold text-[var(--admin-ink)]">{data.lowStockCount}</p>
        </div>
      </div>

      {/* Low Stock Alert */}
      {data.lowStockItems.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <h4 className="text-xs font-bold text-amber-800 flex items-center gap-2 mb-2">
            <AlertTriangle className="h-3.5 w-3.5" />
            Low Stock Items
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.lowStockItems.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold text-amber-800"
              >
                {item.name}
                <span className="text-amber-600">({item.currentStock} {item.unit})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[var(--admin-ink)] flex items-center gap-2">
          <Package className="h-4 w-4 text-[var(--admin-accent)]" />
          Stock Levels
        </h3>
        <ExportControls
          data={data.items.map((i) => ({
            Name: i.name,
            SKU: i.sku,
            Category: i.category,
            Stock: i.currentStock,
            Unit: i.unit,
            ReorderLevel: i.reorderLevel,
            CostPerUnit: i.costPerUnit,
            Status: i.isLowStock ? "Low Stock" : "OK",
          }))}
          filename="inventory-stock"
        />
      </div>

      <AdminTableShell
        columns={columns}
        empty={data.items.length === 0}
        emptyTitle="No inventory items"
      >
        {data.items.map((item) => (
          <tr key={item.id} className="hover:bg-[var(--admin-surface-muted)] transition-colors">
            <td className="px-5 py-3 text-xs font-semibold text-[var(--admin-ink)]">{item.name}</td>
            <td className="px-5 py-3 text-[10px] font-mono text-[var(--admin-muted)]">{item.sku}</td>
            <td className="px-5 py-3 text-xs text-[var(--admin-muted)]">{item.category}</td>
            <td className="px-5 py-3 text-xs font-semibold text-[var(--admin-ink)]">
              {item.currentStock} {item.unit}
            </td>
            <td className="px-5 py-3 text-xs text-[var(--admin-muted)]">{item.reorderLevel}</td>
            <td className="px-5 py-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  item.isLowStock
                    ? "bg-amber-50 text-amber-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                    item.isLowStock ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                />
                {item.isLowStock ? "Low Stock" : "In Stock"}
              </span>
            </td>
          </tr>
        ))}
      </AdminTableShell>
    </motion.div>
  );
}

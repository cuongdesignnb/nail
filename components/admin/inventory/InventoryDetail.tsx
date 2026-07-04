"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  AlertTriangle,
  DollarSign,
  Hash,
  Layers,
  Truck,
  Save,
} from "lucide-react";
import { AdminSectionCard, AdminFormField } from "@/components/admin/ui";
import { InventoryMovementLog } from "./InventoryMovementLog";

interface InventoryDetailProps {
  item: any;
  onAdjust: (data: {
    type: string;
    quantity: number;
    reason: string;
  }) => Promise<void>;
}

const inputClass =
  "w-full rounded-xl border border-aera-champagne/60 bg-white px-3.5 py-2.5 text-xs text-aera-ink placeholder:text-aera-muted/50 transition-colors focus:border-aera-accent focus:outline-none focus:ring-2 focus:ring-aera-accent/20";

export const InventoryDetail: React.FC<InventoryDetailProps> = ({
  item,
  onAdjust,
}) => {
  const [adjustType, setAdjustType] = useState("adjustment");
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjusting, setAdjusting] = useState(false);
  const [adjustError, setAdjustError] = useState("");

  const isLowStock = item.currentStock <= item.reorderLevel;

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(adjustQty, 10);
    if (isNaN(qty) || qty === 0) {
      setAdjustError("Quantity must be a non-zero number");
      return;
    }
    setAdjustError("");
    setAdjusting(true);
    try {
      await onAdjust({ type: adjustType, quantity: qty, reason: adjustReason });
      setAdjustQty("");
      setAdjustReason("");
    } catch {
      setAdjustError("Failed to create adjustment");
    } finally {
      setAdjusting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Item Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border border-aera-champagne/30 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-aera-champagne/50">
              <Package className="h-7 w-7 text-aera-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-aera-ink font-heading">
                {item.name}
              </h2>
              <div className="mt-1 flex items-center gap-3">
                <span className="text-xs text-aera-muted font-mono">
                  SKU: {item.sku}
                </span>
                <span className="rounded-full bg-aera-champagne/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-aera-ink">
                  {item.category}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    item.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-50 text-gray-600"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      item.isActive ? "bg-emerald-500" : "bg-gray-400"
                    }`}
                  />
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {isLowStock && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-xs font-bold text-red-700">
                Low Stock Alert
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <div className="rounded-2xl border border-aera-champagne/30 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <Hash className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-aera-muted">
                Current Stock
              </p>
              <p
                className={`text-lg font-bold ${
                  isLowStock ? "text-red-600" : "text-aera-ink"
                }`}
              >
                {item.currentStock} {item.unit}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-aera-champagne/30 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
              <Layers className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-aera-muted">
                Reorder Level
              </p>
              <p className="text-lg font-bold text-aera-ink">
                {item.reorderLevel} {item.unit}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-aera-champagne/30 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-aera-muted">
                Cost/Unit
              </p>
              <p className="text-lg font-bold text-aera-ink">
                ${Number(item.costPerUnit).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-aera-champagne/30 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50">
              <Truck className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-aera-muted">
                Supplier
              </p>
              <p className="text-sm font-bold text-aera-ink truncate">
                {item.supplier || "—"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Movement History */}
        <div className="lg:col-span-2">
          <AdminSectionCard
            title="Stock Movement History"
            icon={Layers}
            badge={
              <span className="rounded-full bg-aera-champagne/50 px-2 py-0.5 text-[10px] font-bold text-aera-muted">
                {item.movements?.length || 0}
              </span>
            }
          >
            <InventoryMovementLog movements={item.movements || []} />
          </AdminSectionCard>
        </div>

        {/* Manual Adjustment */}
        <div>
          <AdminSectionCard title="Manual Adjustment" icon={Package}>
            <form onSubmit={handleAdjust} className="space-y-4">
              <AdminFormField label="Type" required htmlFor="adj-type">
                <select
                  id="adj-type"
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value)}
                  className={inputClass}
                >
                  <option value="adjustment">Adjustment</option>
                  <option value="purchase">Purchase</option>
                  <option value="usage">Usage</option>
                  <option value="return">Return</option>
                </select>
              </AdminFormField>

              <AdminFormField
                label="Quantity"
                required
                error={adjustError}
                helpText="Use negative for reductions"
                htmlFor="adj-qty"
              >
                <input
                  id="adj-qty"
                  type="number"
                  value={adjustQty}
                  onChange={(e) => {
                    setAdjustQty(e.target.value);
                    setAdjustError("");
                  }}
                  placeholder="e.g. 10 or -5"
                  className={inputClass}
                />
              </AdminFormField>

              <AdminFormField label="Reason" htmlFor="adj-reason">
                <input
                  id="adj-reason"
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Optional reason"
                  className={inputClass}
                />
              </AdminFormField>

              <button
                type="submit"
                disabled={adjusting || !adjustQty}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-aera-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-aera-accentHover disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aera-accent/40 focus-visible:ring-offset-2"
              >
                <Save className="h-3.5 w-3.5" />
                {adjusting ? "Saving…" : "Submit Adjustment"}
              </button>
            </form>
          </AdminSectionCard>
        </div>
      </div>
    </div>
  );
};

export default InventoryDetail;

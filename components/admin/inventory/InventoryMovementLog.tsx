"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  RotateCcw,
  ShoppingCart,
} from "lucide-react";
import { format } from "date-fns";

interface Movement {
  id: string;
  type: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string | null;
  performedBy: string | null;
  createdAt: string;
}

interface InventoryMovementLogProps {
  movements: Movement[];
}

const TYPE_CONFIG: Record<
  string,
  { icon: React.ReactNode; label: string; color: string; bgColor: string }
> = {
  adjustment: {
    icon: <RotateCcw className="h-4 w-4" />,
    label: "Adjustment",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  purchase: {
    icon: <ShoppingCart className="h-4 w-4" />,
    label: "Purchase",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  usage: {
    icon: <ArrowDownCircle className="h-4 w-4" />,
    label: "Usage",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  return: {
    icon: <ArrowUpCircle className="h-4 w-4" />,
    label: "Return",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
};

export const InventoryMovementLog: React.FC<InventoryMovementLogProps> = ({
  movements,
}) => {
  if (movements.length === 0) {
    return (
      <p className="text-xs text-[var(--admin-muted)] py-4 text-center">
        No stock movements recorded yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {movements.map((movement, idx) => {
        const config = TYPE_CONFIG[movement.type] || TYPE_CONFIG.adjustment;
        const isPositive = movement.quantity > 0;

        return (
          <motion.div
            key={movement.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03, duration: 0.25 }}
            className="flex items-center justify-between rounded-xl bg-[var(--admin-surface-muted)] px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bgColor} ${config.color}`}
              >
                {config.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--admin-ink)]">
                    {config.label}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      isPositive ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {movement.quantity}
                  </span>
                </div>
                {movement.reason && (
                  <p className="text-[11px] text-[var(--admin-muted)] mt-0.5">
                    {movement.reason}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--admin-muted)]">
                {movement.previousStock} → {movement.newStock}
              </p>
              <p className="text-[10px] text-[var(--admin-placeholder)] mt-0.5">
                {format(new Date(movement.createdAt), "MMM d, h:mm a")}
                {movement.performedBy && ` · ${movement.performedBy}`}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default InventoryMovementLog;

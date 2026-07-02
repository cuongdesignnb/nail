"use client";

import React from "react";
import { Inbox } from "lucide-react";
import { AdminLoadingState } from "./AdminLoadingState";
import { AdminEmptyState } from "./AdminEmptyState";

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
}

export interface AdminTableShellProps {
  columns: TableColumn[];
  loading?: boolean;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  children?: React.ReactNode;
}

export const AdminTableShell: React.FC<AdminTableShellProps> = ({
  columns,
  loading = false,
  empty = false,
  emptyTitle = "No data found",
  emptyDescription = "There are no items to display.",
  children,
}) => {
  if (loading) {
    return <AdminLoadingState variant="table" />;
  }

  if (empty) {
    return (
      <div className="rounded-2xl border border-aera-champagne/30 bg-white">
        <AdminEmptyState
          icon={Inbox}
          title={emptyTitle}
          description={emptyDescription}
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-aera-champagne/30 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-aera-champagne/30 bg-aera-champagne/10">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="sticky top-0 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-aera-muted whitespace-nowrap"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-aera-champagne/20">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTableShell;

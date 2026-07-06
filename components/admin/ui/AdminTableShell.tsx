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
      <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)]">
        <AdminEmptyState
          icon={Inbox}
          title={emptyTitle}
          description={emptyDescription}
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[var(--admin-surface)]">
            <tr className="sticky top-0 z-10 border-b border-[var(--admin-border)] bg-[var(--admin-sidebar-bg)]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--admin-muted)] whitespace-nowrap"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--admin-border-muted)]">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTableShell;

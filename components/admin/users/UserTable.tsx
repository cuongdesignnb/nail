"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, Shield, Edit2 } from "lucide-react";
import { format } from "date-fns";
import {
  AdminTableShell,
  AdminSearchInput,
  AdminFilterBar,
} from "@/components/admin/ui";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const ROLE_COLORS: Record<string, { dot: string; bg: string; text: string }> = {
  Owner: { dot: "bg-purple-500", bg: "bg-purple-50", text: "text-purple-700" },
  Manager: { dot: "bg-blue-500", bg: "bg-blue-50", text: "text-blue-700" },
  Receptionist: { dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
  Technician: { dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
};

const ROLES = ["All", "Owner", "Manager", "Receptionist", "Technician"];

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onEdit }) => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "All" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "created", label: "Created" },
    { key: "actions", label: "", width: "60px" },
  ];

  return (
    <div className="space-y-4">
      <AdminFilterBar
        onReset={() => {
          setSearch("");
          setRoleFilter("All");
        }}
      >
        <AdminSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search users…"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border border-aera-champagne/60 bg-white px-3 py-2 text-xs text-aera-ink transition-colors focus:border-aera-accent focus:outline-none focus:ring-2 focus:ring-aera-accent/20"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r === "All" ? "All Roles" : r}
            </option>
          ))}
        </select>
      </AdminFilterBar>

      <AdminTableShell
        columns={columns}
        loading={false}
        empty={filtered.length === 0}
        emptyTitle="No users found"
        emptyDescription="Try adjusting your search or filter criteria."
      >
        {filtered.map((user, idx) => {
          const colors = ROLE_COLORS[user.role] || ROLE_COLORS.Manager;
          return (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.25 }}
              className="cursor-pointer transition-colors hover:bg-aera-champagne/10"
              onClick={() => onEdit(user)}
            >
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-aera-champagne/50">
                    <Users className="h-3.5 w-3.5 text-aera-accent" />
                  </div>
                  <span className="text-xs font-semibold text-aera-ink">
                    {user.name}
                  </span>
                </div>
              </td>
              <td className="px-5 py-3.5 text-xs text-aera-muted">
                {user.email}
              </td>
              <td className="px-5 py-3.5">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${colors.bg} ${colors.text}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full shrink-0 ${colors.dot}`}
                  />
                  {user.role}
                </span>
              </td>
              <td className="px-5 py-3.5 text-xs text-aera-muted">
                {format(new Date(user.createdAt), "MMM d, yyyy")}
              </td>
              <td className="px-5 py-3.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(user);
                  }}
                  className="rounded-lg p-1.5 text-aera-muted transition-colors hover:bg-aera-champagne/30 hover:text-aera-ink"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
              </td>
            </motion.tr>
          );
        })}
      </AdminTableShell>

      <div className="flex items-center gap-2 text-[10px] text-aera-muted px-1">
        <Shield className="h-3 w-3" />
        <span>
          {filtered.length} user{filtered.length !== 1 ? "s" : ""} total
        </span>
      </div>
    </div>
  );
};

export default UserTable;

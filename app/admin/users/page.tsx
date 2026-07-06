"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { UserPlus, Trash2 } from "lucide-react";
import {
  AdminPageHeader,
  AdminLoadingState,
  AdminErrorState,
  AdminSectionCard,
  AdminConfirmDialog,
  AdminSidePanel,
} from "@/components/admin/ui";
import { UserTable } from "@/components/admin/users/UserTable";
import { UserForm } from "@/components/admin/users/UserForm";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to load");
      setUsers(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreate = async (data: { name: string; email: string; role: string; password: string }) => {
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || "Failed to create");
    setPanelOpen(false);
    fetchUsers();
  };

  const handleUpdate = async (data: { name: string; email: string; role: string; password: string }) => {
    if (!editingUser) return;
    const payload: Record<string, string> = {
      name: data.name,
      email: data.email,
      role: data.role,
    };
    if (data.password) payload.password = data.password;

    const res = await fetch(`/api/admin/users/${editingUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || "Failed to update");
    setEditingUser(null);
    fetchUsers();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/users/${deleteTarget.id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete");
    setDeleteTarget(null);
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  return (
    <div className="admin-page-container">
      <AdminPageHeader
        title="Users & Roles"
        eyebrow="System"
        description="Manage admin users and their access permissions."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Users" },
        ]}
        actions={
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--admin-accent)] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[var(--admin-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/40 focus-visible:ring-offset-2"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Add User
          </button>
        }
      />

      {loading && <AdminLoadingState variant="table" />}
      {error && <AdminErrorState title="Error loading users" description={error} onRetry={fetchUsers} />}

      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <UserTable users={users} onEdit={handleEdit} />
        </motion.div>
      )}

      {/* Create User Panel */}
      <AdminSidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        title="Add New User"
      >
        <UserForm
          onSubmit={handleCreate}
          onCancel={() => setPanelOpen(false)}
        />
      </AdminSidePanel>

      {/* Edit User Panel */}
      <AdminSidePanel
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit User"
      >
        {editingUser && (
          <div className="space-y-6">
            <UserForm
              initialData={editingUser}
              isEdit
              onSubmit={handleUpdate}
              onCancel={() => setEditingUser(null)}
            />
            <div className="border-t border-[var(--admin-border)] pt-5">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(editingUser);
                  setEditingUser(null);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 focus-visible:ring-offset-2"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete User
              </button>
            </div>
          </div>
        )}
      </AdminSidePanel>

      {/* Delete Confirmation */}
      <AdminConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete ${deleteTarget?.name}?`}
        description={`This will permanently remove ${deleteTarget?.email} from the system. This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}

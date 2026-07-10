"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Edit2, Trash2 } from "lucide-react";
import {
  AdminPageHeader,
  AdminLoadingState,
  AdminErrorState,
  AdminButton,
  AdminSidePanel,
  AdminConfirmDialog,
} from "@/components/admin/ui";
import { TechnicianProfile } from "@/components/admin/technicians/TechnicianProfile";
import { TechnicianForm } from "@/components/admin/technicians/TechnicianForm";

export default function AdminTechnicianDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [technician, setTechnician] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchTechnician = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/technicians/${id}`);
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Failed to load");
      setTechnician(json.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load technician"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleUpdate = async (data: any) => {
    const res = await fetch(`/api/admin/technicians/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || "Failed to update technician");
    setEditPanelOpen(false);
    fetchTechnician();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/technicians/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete technician");
      setDeleteConfirmOpen(false);
      router.push("/admin/technicians");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchTechnician();
  }, [fetchTechnician]);

  return (
    <div className="min-h-screen">
      <AdminPageHeader
        title={technician?.name || "Technician Details"}
        description="View technician profile, performance, and upcoming bookings."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Technicians", href: "/admin/technicians" },
          { label: technician?.name || "Details" },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <AdminButton
              variant="secondary"
              size="sm"
              icon={<Edit2 size={13} />}
              onClick={() => setEditPanelOpen(true)}
            >
              Edit
            </AdminButton>
            <AdminButton
              variant="danger"
              size="sm"
              icon={<Trash2 size={13} />}
              onClick={() => setDeleteConfirmOpen(true)}
            >
              Delete
            </AdminButton>
            <AdminButton
              variant="secondary"
              size="sm"
              onClick={() => router.push("/admin/technicians")}
            >
              ← Back
            </AdminButton>
          </div>
        }
      />

      {loading && <AdminLoadingState variant="card" />}
      {error && (
        <AdminErrorState
          title="Error loading technician"
          description={error}
          onRetry={fetchTechnician}
        />
      )}

      {!loading && !error && technician && (
        <TechnicianProfile technician={technician} />
      )}

      {/* Edit Technician Panel */}
      <AdminSidePanel
        open={editPanelOpen}
        onClose={() => setEditPanelOpen(false)}
        title="Edit Technician"
      >
        {technician && (
          <TechnicianForm
            initialData={{
              name: technician.name,
              role: technician.role,
              specialty: technician.specialty,
              avatar: technician.avatar,
              isActive: technician.isActive,
            }}
            isEdit
            onSubmit={handleUpdate}
            onCancel={() => setEditPanelOpen(false)}
          />
        )}
      </AdminSidePanel>

      {/* Delete Confirmation Dialog */}
      <AdminConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Technician"
        description={`Are you sure you want to delete ${technician?.name || "this technician"}? This action cannot be undone.`}
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        variant="danger"
        onConfirm={handleDelete}
      />
    </div>
  );
}

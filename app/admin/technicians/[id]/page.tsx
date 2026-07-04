"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AdminPageHeader,
  AdminLoadingState,
  AdminErrorState,
} from "@/components/admin/ui";
import { TechnicianProfile } from "@/components/admin/technicians/TechnicianProfile";

export default function AdminTechnicianDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [technician, setTechnician] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          <button
            type="button"
            onClick={() => router.push("/admin/technicians")}
            className="rounded-full border border-aera-champagne/60 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-aera-ink transition-colors hover:bg-aera-champagne/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aera-accent/40 focus-visible:ring-offset-2"
          >
            ← Back to Technicians
          </button>
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
    </div>
  );
}

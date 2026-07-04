"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AdminPageHeader,
  AdminLoadingState,
  AdminErrorState,
} from "@/components/admin/ui";
import { BookingDetailView } from "@/components/admin/bookings/BookingDetailView";

export default function AdminBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooking = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to load");
      setBooking(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load booking");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  const handleStatusChange = async (status: string) => {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || "Failed to update");
    setBooking(json.data);
  };

  const handleNotesUpdate = async (internalNotes: string) => {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ internalNotes }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || "Failed to update");
    setBooking(json.data);
  };

  return (
    <div className="min-h-screen">
      <AdminPageHeader
        title={booking ? `Booking #${booking.bookingCode}` : "Booking Details"}
        description="View and manage booking details, status, and payments."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Bookings", href: "/admin/bookings" },
          { label: booking?.bookingCode || "Details" },
        ]}
        actions={
          <button
            type="button"
            onClick={() => router.push("/admin/bookings")}
            className="rounded-full border border-aera-champagne/60 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-aera-ink transition-colors hover:bg-aera-champagne/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aera-accent/40 focus-visible:ring-offset-2"
          >
            ← Back to Bookings
          </button>
        }
      />

      {loading && <AdminLoadingState variant="card" />}
      {error && (
        <AdminErrorState
          title="Error loading booking"
          description={error}
          onRetry={fetchBooking}
        />
      )}

      {!loading && !error && booking && (
        <BookingDetailView
          booking={booking}
          onStatusChange={handleStatusChange}
          onNotesUpdate={handleNotesUpdate}
        />
      )}
    </div>
  );
}

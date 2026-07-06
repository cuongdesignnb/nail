"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AdminPageHeader,
  AdminLoadingState,
  AdminErrorState,
} from "@/components/admin/ui";
import { CustomerProfile } from "@/components/admin/customers/CustomerProfile";

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/customers/${id}`);
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Failed to load");
      setCustomer(json.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load customer"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  return (
    <div className="min-h-screen">
      <AdminPageHeader
        title={
          customer
            ? `${customer.firstName} ${customer.lastName}`
            : "Customer Details"
        }
        description="View customer profile, booking history, and spending."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Customers", href: "/admin/customers" },
          {
            label: customer
              ? `${customer.firstName} ${customer.lastName}`
              : "Details",
          },
        ]}
        actions={
          <button
            type="button"
            onClick={() => router.push("/admin/customers")}
            className="rounded-full border border-[var(--admin-border-strong)] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--admin-ink)] transition-colors hover:bg-[var(--admin-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/40 focus-visible:ring-offset-2"
          >
            ← Back to Customers
          </button>
        }
      />

      {loading && <AdminLoadingState variant="card" />}
      {error && (
        <AdminErrorState
          title="Error loading customer"
          description={error}
          onRetry={fetchCustomer}
        />
      )}

      {!loading && !error && customer && (
        <CustomerProfile customer={customer} />
      )}
    </div>
  );
}

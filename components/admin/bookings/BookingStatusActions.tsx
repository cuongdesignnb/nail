"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  LogIn,
  PlayCircle,
  CheckCheck,
  XCircle,
  UserX,
} from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/ui";

interface BookingStatusActionsProps {
  currentStatus: string;
  onStatusChange: (newStatus: string) => Promise<void>;
  loading?: boolean;
}

interface StatusAction {
  status: string;
  label: string;
  icon: React.ReactNode;
  variant: "default" | "danger";
  requireConfirm: boolean;
  confirmTitle?: string;
  confirmDescription?: string;
}

const STATUS_FLOW: Record<string, StatusAction[]> = {
  PENDING: [
    {
      status: "CONFIRMED",
      label: "Confirm",
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      variant: "default",
      requireConfirm: false,
    },
    {
      status: "CANCELLED",
      label: "Cancel",
      icon: <XCircle className="h-3.5 w-3.5" />,
      variant: "danger",
      requireConfirm: true,
      confirmTitle: "Cancel Booking?",
      confirmDescription:
        "This will cancel the booking. The customer will need to rebook.",
    },
  ],
  CONFIRMED: [
    {
      status: "CHECKED_IN",
      label: "Check In",
      icon: <LogIn className="h-3.5 w-3.5" />,
      variant: "default",
      requireConfirm: false,
    },
    {
      status: "CANCELLED",
      label: "Cancel",
      icon: <XCircle className="h-3.5 w-3.5" />,
      variant: "danger",
      requireConfirm: true,
      confirmTitle: "Cancel Booking?",
      confirmDescription:
        "This will cancel the confirmed booking. The customer will need to rebook.",
    },
    {
      status: "NO_SHOW",
      label: "No Show",
      icon: <UserX className="h-3.5 w-3.5" />,
      variant: "danger",
      requireConfirm: true,
      confirmTitle: "Mark as No Show?",
      confirmDescription:
        "This marks the customer as a no-show for this appointment.",
    },
  ],
  CHECKED_IN: [
    {
      status: "IN_PROGRESS",
      label: "Start Service",
      icon: <PlayCircle className="h-3.5 w-3.5" />,
      variant: "default",
      requireConfirm: false,
    },
  ],
  IN_PROGRESS: [
    {
      status: "COMPLETED",
      label: "Complete",
      icon: <CheckCheck className="h-3.5 w-3.5" />,
      variant: "default",
      requireConfirm: false,
    },
  ],
};

export const BookingStatusActions: React.FC<BookingStatusActionsProps> = ({
  currentStatus,
  onStatusChange,
  loading = false,
}) => {
  const [confirmAction, setConfirmAction] = useState<StatusAction | null>(null);
  const [processing, setProcessing] = useState(false);

  const actions = STATUS_FLOW[currentStatus] || [];

  if (actions.length === 0) return null;

  const handleAction = async (action: StatusAction) => {
    if (action.requireConfirm) {
      setConfirmAction(action);
      return;
    }
    setProcessing(true);
    try {
      await onStatusChange(action.status);
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    setProcessing(true);
    try {
      await onStatusChange(confirmAction.status);
    } finally {
      setProcessing(false);
      setConfirmAction(null);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {actions.map((action) => (
          <button
            key={action.status}
            type="button"
            disabled={loading || processing}
            onClick={() => handleAction(action)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-sm transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              action.variant === "danger"
                ? "border border-red-200 bg-white text-red-600 hover:bg-red-50 focus-visible:ring-red-500/40"
                : "bg-[var(--admin-accent)] text-white hover:bg-[var(--admin-accent-hover)] focus-visible:ring-[var(--admin-accent)]/40"
            }`}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>

      <AdminConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={confirmAction?.confirmTitle || "Confirm Action"}
        description={confirmAction?.confirmDescription}
        confirmLabel={confirmAction?.label || "Confirm"}
        variant="danger"
      />
    </>
  );
};

export default BookingStatusActions;

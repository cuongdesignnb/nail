"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  CreditCard,
  Scissors,
  Clock,
  FileText,
  DollarSign,
  Save,
} from "lucide-react";
import { format } from "date-fns";
import { AdminSectionCard, AdminTextArea } from "@/components/admin/ui";
import { BookingTimeline } from "./BookingTimeline";
import { BookingStatusActions } from "./BookingStatusActions";

interface BookingDetailViewProps {
  booking: any;
  onStatusChange: (status: string) => Promise<void>;
  onNotesUpdate: (notes: string) => Promise<void>;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  CONFIRMED: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  CHECKED_IN: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" },
  IN_PROGRESS: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  COMPLETED: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  CANCELLED: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  NO_SHOW: { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" },
};

const PAYMENT_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  UNPAID: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  PAID: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  DEPOSIT_PAID: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  paid: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  failed: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  REFUNDED: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  PARTIAL: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
};

function normalizeStatus(status?: string | null) {
  return String(status || "PENDING").trim().replace(/[\s-]+/g, "_").toUpperCase();
}

function StatusBadge({ status, colorMap }: { status?: string | null; colorMap: Record<string, { bg: string; text: string; dot: string }> }) {
  const normalized = normalizeStatus(status);
  const c = colorMap[normalized] || colorMap[String(status || "")] || { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${c.dot}`} />
      {normalized.replace(/_/g, " ")}
    </span>
  );
}

export const BookingDetailView: React.FC<BookingDetailViewProps> = ({
  booking,
  onStatusChange,
  onNotesUpdate,
}) => {
  const [notes, setNotes] = useState(booking.internalNotes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const bookingStatus = normalizeStatus(booking.status);
  const paymentStatus = normalizeStatus(booking.paymentStatus);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await onNotesUpdate(notes);
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status + Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border border-aera-champagne/30 bg-white p-5 shadow-sm"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-aera-muted uppercase tracking-wider">
              Status
            </span>
            <StatusBadge status={bookingStatus} colorMap={STATUS_COLORS} />
            <StatusBadge status={paymentStatus} colorMap={PAYMENT_COLORS} />
          </div>
          <BookingStatusActions
            currentStatus={bookingStatus}
            onStatusChange={onStatusChange}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Info */}
          <AdminSectionCard title="Booking Details" icon={Calendar}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-aera-muted">
                  Booking Code
                </p>
                <p className="mt-1 text-sm font-semibold text-aera-ink font-mono">
                  {booking.bookingCode}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-aera-muted">
                  Scheduled
                </p>
                <p className="mt-1 text-sm font-semibold text-aera-ink">
                  {format(new Date(booking.scheduledStartAt), "MMM d, yyyy, h:mm a")}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-aera-muted">
                  Duration
                </p>
                <p className="mt-1 text-sm text-aera-ink flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-aera-muted" />
                  {format(new Date(booking.scheduledStartAt), "h:mm a")} -{" "}
                  {format(new Date(booking.scheduledEndAt), "h:mm a")}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-aera-muted">
                  Technician
                </p>
                <p className="mt-1 text-sm text-aera-ink">
                  {booking.technician?.name || "No preference"}
                </p>
              </div>
            </div>
          </AdminSectionCard>

          {/* Services */}
          <AdminSectionCard
            title="Services"
            icon={Scissors}
            badge={
              <span className="rounded-full bg-aera-champagne/50 px-2 py-0.5 text-[10px] font-bold text-aera-muted">
                {booking.items?.length || 0}
              </span>
            }
          >
            <div className="space-y-3">
              {booking.items?.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl bg-aera-champagne/15 px-4 py-3"
                >
                  <div>
                    <p className="text-xs font-semibold text-aera-ink">
                      {item.serviceNameSnapshot || item.service?.name || "Service"}
                    </p>
                    <p className="text-[11px] text-aera-muted mt-0.5">
                      {item.duration} min
                    </p>
                  </div>
                  <p className="text-xs font-bold text-aera-ink">
                    ${Number(item.price).toFixed(2)}
                  </p>
                </div>
              ))}
              {booking.addonItems?.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl bg-aera-champagne/15 px-4 py-3"
                >
                  <div>
                    <p className="text-xs font-semibold text-aera-ink">
                      {item.addonNameSnapshot}
                    </p>
                    <p className="text-[11px] text-aera-muted mt-0.5">
                      Add-on
                    </p>
                  </div>
                  <p className="text-xs font-bold text-aera-ink">
                    ${Number(item.price).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="border-t border-aera-champagne/30 pt-3 space-y-1.5">
                <div className="flex justify-between text-xs text-aera-muted">
                  <span>Subtotal</span>
                  <span>${Number(booking.subtotal).toFixed(2)}</span>
                </div>
                {Number(booking.discountAmount) > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600">
                    <span>Discount</span>
                    <span>-${Number(booking.discountAmount).toFixed(2)}</span>
                  </div>
                )}
                {Number(booking.taxAmount) > 0 && (
                  <div className="flex justify-between text-xs text-aera-muted">
                    <span>Tax</span>
                    <span>${Number(booking.taxAmount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-aera-ink pt-1">
                  <span>Total</span>
                  <span>${Number(booking.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </AdminSectionCard>

          {/* Payment History */}
          <AdminSectionCard title="Payment History" icon={CreditCard}>
            {booking.payments?.length > 0 ? (
              <div className="space-y-2">
                {booking.payments.map((payment: any) => (
                  <div
                    key={payment.id}
                    className="rounded-xl bg-aera-champagne/15 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-aera-muted" />
                      <div>
                        <p className="text-xs font-semibold text-aera-ink">
                          ${Number(payment.amount).toFixed(2)}
                        </p>
                        <p className="text-[11px] text-aera-muted">
                          {payment.provider} - {payment.currency}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={payment.status} colorMap={PAYMENT_COLORS} />
                      {payment.paidAt && (
                        <p className="text-[10px] text-aera-muted mt-1">
                          {format(new Date(payment.paidAt), "MMM d, h:mm a")}
                        </p>
                      )}
                    </div>
                    {(payment.providerOrderId || payment.providerCaptureId || payment.providerPayerEmail) && (
                      <div className="mt-3 grid grid-cols-1 gap-2 border-t border-aera-champagne/30 pt-3 text-left text-[11px] text-aera-muted md:grid-cols-2">
                        {payment.providerOrderId && <p><b>PayPal Order:</b> {payment.providerOrderId}</p>}
                        {payment.providerCaptureId && <p><b>Capture:</b> {payment.providerCaptureId}</p>}
                        {payment.providerPayerName && <p><b>Payer:</b> {payment.providerPayerName}</p>}
                        {payment.providerPayerEmail && <p><b>Payer Email:</b> {payment.providerPayerEmail}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-aera-muted py-4 text-center">
                No payments recorded yet.
              </p>
            )}
          </AdminSectionCard>

          {/* Internal Notes */}
          <AdminSectionCard title="Internal Notes" icon={FileText}>
            <div className="space-y-3">
              <AdminTextArea
                value={notes}
                onChange={setNotes}
                placeholder="Add internal notes about this booking..."
                rows={3}
              />
              <button
                type="button"
                disabled={savingNotes || notes === (booking.internalNotes || "")}
                onClick={handleSaveNotes}
                className="inline-flex items-center gap-2 rounded-full bg-aera-accent px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-aera-accentHover disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aera-accent/40 focus-visible:ring-offset-2"
              >
                <Save className="h-3.5 w-3.5" />
                {savingNotes ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </AdminSectionCard>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <AdminSectionCard title="Customer" icon={User}>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-aera-ink">
                  {booking.customer?.firstName} {booking.customer?.lastName}
                </p>
                <p className="text-xs text-aera-muted mt-0.5">
                  {booking.customer?.email}
                </p>
                <p className="text-xs text-aera-muted">
                  {booking.customer?.phone}
                </p>
              </div>
              <a
                href={`/admin/customers/${booking.customer?.id}`}
                className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider text-aera-accent hover:text-aera-accentHover transition-colors"
              >
                View Profile {">"}
              </a>
            </div>
          </AdminSectionCard>

          {/* Timeline */}
          <AdminSectionCard title="Timeline" icon={Clock}>
            <BookingTimeline booking={{ ...booking, status: bookingStatus }} />
          </AdminSectionCard>

          {/* Customer Notes */}
          {booking.notes && (
            <AdminSectionCard title="Customer Notes" icon={FileText}>
              <p className="text-xs text-aera-ink leading-relaxed whitespace-pre-wrap">
                {booking.notes}
              </p>
            </AdminSectionCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailView;

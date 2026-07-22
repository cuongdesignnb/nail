import assert from "node:assert/strict";
import test from "node:test";
import { adminBookingRequestEmail } from "../emails/AdminBookingRequestEmail";
import { buildBookingCalendarRange, bookingCalendarPosition } from "../lib/bookings/calendar";
import { resolveBookingAdminRecipients } from "../lib/email/booking-mail.service";

test("booking admin recipients combine configured operational inboxes without duplicates or the customer", () => {
  const recipients = resolveBookingAdminRecipients({
    explicitRecipients: "Owner@Example.com; bookings@example.com, invalid",
    ownerManagerEmails: ["owner@example.com", "manager@example.com"],
    salonEmail: "hello@example.com",
    environmentAdminEmail: "admin@example.com",
    smtpReplyToEmail: "bookings@example.com",
    smtpFromEmail: "mailer@example.com",
    customerEmail: "manager@example.com",
  });

  assert.deepEqual(recipients, [
    "owner@example.com",
    "bookings@example.com",
    "hello@example.com",
    "admin@example.com",
    "mailer@example.com",
  ]);
});

test("admin booking email escapes customer-controlled HTML and links to the booking", () => {
  const rendered = adminBookingRequestEmail({
    bookingCode: "AERA-123456",
    customerName: "<script>alert(1)</script>",
    customerEmail: "customer@example.com",
    customerPhone: "+1 626 555 0100",
    services: "Gel Manicure",
    technician: "Mia",
    when: "Jul 20, 2026, 10:30 AM",
    status: "PENDING",
    notes: "Please use <b>safe</b> polish",
    adminBookingUrl: "https://example.com/admin/bookings/booking-1",
  });

  assert.match(rendered.subject, /AERA-123456/);
  assert.doesNotMatch(rendered.html, /<script>|<b>safe<\/b>/);
  assert.match(rendered.html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(rendered.html, /https:\/\/example\.com\/admin\/bookings\/booking-1/);
});

test("calendar range converts the salon week to UTC and preserves DST boundaries", () => {
  const regular = buildBookingCalendarRange("2026-07-20", "America/Los_Angeles");
  assert.equal(regular.weekStart, "2026-07-20");
  assert.equal(regular.weekEnd, "2026-07-26");
  assert.equal(regular.fromUtc.toISOString(), "2026-07-20T07:00:00.000Z");
  assert.equal(regular.toUtc.toISOString(), "2026-07-27T07:00:00.000Z");

  const dstWeek = buildBookingCalendarRange("2026-03-02", "America/Los_Angeles");
  assert.equal((dstWeek.toUtc.getTime() - dstWeek.fromUtc.getTime()) / 3_600_000, 167);
  assert.throws(() => buildBookingCalendarRange("2026-02-31", "America/Los_Angeles"), /INVALID_CALENDAR_WEEK/);
});

test("calendar positions bookings in salon time instead of the admin browser timezone", () => {
  const position = bookingCalendarPosition("2026-07-20T17:30:00.000Z", "America/Los_Angeles");
  assert.equal(position.dateKey, "2026-07-20");
  assert.equal(position.hour, 10);
  assert.equal(position.minute, 30);
});

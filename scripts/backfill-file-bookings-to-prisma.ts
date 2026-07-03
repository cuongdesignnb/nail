/**
 * Backfill script: Migrates booking data from .data/bookings.json to PostgreSQL.
 *
 * Usage: npx tsx scripts/backfill-file-bookings-to-prisma.ts
 *
 * Rules:
 * - Only reads .data/bookings.json if it exists
 * - Skips duplicates by bookingCode
 * - Logs unmatched service/technician IDs
 * - Never overwrites existing database bookings
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface FileBooking {
  id: string;
  bookingCode: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    type?: string;
    reminderConsent?: boolean;
  };
  serviceIds: string[];
  addonIds?: string[];
  technicianId: string;
  scheduledStartAt: string;
  scheduledEndAt: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  depositAmount: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  notes?: string;
  promotionCode?: string;
  createdAt: string;
  updatedAt: string;
}

async function main() {
  const filePath = path.join(process.cwd(), ".data", "bookings.json");

  if (!fs.existsSync(filePath)) {
    console.log("No .data/bookings.json found. Nothing to backfill.");
    return;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  let fileBookings: FileBooking[];
  try {
    fileBookings = JSON.parse(raw);
  } catch {
    console.error("Failed to parse bookings.json");
    return;
  }

  if (!Array.isArray(fileBookings) || fileBookings.length === 0) {
    console.log("No bookings in file. Nothing to backfill.");
    return;
  }

  console.log(`Found ${fileBookings.length} bookings in file.`);

  // Pre-load existing booking codes
  const existingCodes = new Set(
    (await prisma.booking.findMany({ select: { bookingCode: true } })).map((b) => b.bookingCode)
  );

  // Pre-load valid service and technician IDs
  const validServiceIds = new Set(
    (await prisma.service.findMany({ select: { id: true } })).map((s) => s.id)
  );
  const validTechIds = new Set(
    (await prisma.technician.findMany({ select: { id: true } })).map((t) => t.id)
  );

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const fb of fileBookings) {
    if (existingCodes.has(fb.bookingCode)) {
      skipped++;
      continue;
    }

    // Validate technician
    const techId = validTechIds.has(fb.technicianId) ? fb.technicianId : null;
    if (!validTechIds.has(fb.technicianId)) {
      console.warn(`  ⚠ Unmatched technician ID: ${fb.technicianId} for booking ${fb.bookingCode}`);
    }

    // Filter valid services
    const validServices = fb.serviceIds.filter((id) => validServiceIds.has(id));
    const invalidServices = fb.serviceIds.filter((id) => !validServiceIds.has(id));
    if (invalidServices.length > 0) {
      console.warn(`  ⚠ Unmatched service IDs for ${fb.bookingCode}: ${invalidServices.join(", ")}`);
    }

    try {
      await prisma.$transaction(async (tx) => {
        // Upsert customer
        const customer = await tx.customer.upsert({
          where: { email: fb.customer.email },
          update: {},
          create: {
            firstName: fb.customer.firstName,
            lastName: fb.customer.lastName,
            email: fb.customer.email,
            phone: fb.customer.phone,
          },
        });

        // Create booking
        const booking = await tx.booking.create({
          data: {
            bookingCode: fb.bookingCode,
            customerId: customer.id,
            technicianId: techId,
            status: fb.status,
            paymentStatus: fb.paymentStatus,
            scheduledStartAt: new Date(fb.scheduledStartAt),
            scheduledEndAt: new Date(fb.scheduledEndAt),
            subtotal: fb.subtotal,
            discountAmount: fb.discountAmount,
            taxAmount: fb.taxAmount,
            depositAmount: fb.depositAmount,
            totalAmount: fb.totalAmount,
            notes: fb.notes,
            createdAt: new Date(fb.createdAt),
            updatedAt: new Date(fb.updatedAt),
            completedAt: fb.status === "Completed" ? new Date(fb.updatedAt) : null,
            cancelledAt: fb.status === "Cancelled" ? new Date(fb.updatedAt) : null,
          },
        });

        // Create booking items for valid services
        if (validServices.length > 0) {
          const services = await tx.service.findMany({
            where: { id: { in: validServices } },
          });
          for (const svc of services) {
            await tx.bookingItem.create({
              data: {
                bookingId: booking.id,
                serviceId: svc.id,
                price: svc.price,
                duration: svc.duration,
              },
            });
          }
        }

        // Create payment record if payment status indicates payment
        if (fb.paymentStatus === "Paid" || fb.paymentStatus === "Deposit Paid") {
          const amount = fb.paymentStatus === "Paid" ? fb.totalAmount : fb.depositAmount;
          await tx.payment.create({
            data: {
              bookingId: booking.id,
              amount,
              status: "paid",
              provider: "manual",
              paidAt: new Date(fb.updatedAt),
            },
          });
        }
      });

      imported++;
    } catch (err) {
      console.error(`  ✗ Failed to import ${fb.bookingCode}:`, err instanceof Error ? err.message : err);
      errors++;
    }
  }

  console.log(`\nBackfill complete:`);
  console.log(`  ✓ Imported: ${imported}`);
  console.log(`  ○ Skipped (duplicate): ${skipped}`);
  console.log(`  ✗ Errors: ${errors}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });

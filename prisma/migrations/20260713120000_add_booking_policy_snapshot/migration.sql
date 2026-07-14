-- Additive snapshot of the booking/cancellation policy accepted by the customer.
ALTER TABLE "Booking" ADD COLUMN "policyVersion" TEXT;

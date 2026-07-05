import Link from "next/link";
import { PageShell } from "@/components/shared/PageShell";

export default function BookingSuccessPage() {
  return (
    <PageShell eyebrow="Success" title="Your Booking Request Was Received" copy="Please check your email for confirmation details.">
      <section className="lux-card booking-success">
        <p>Our reception team will review the booking and confirm deposit payment.</p>
        <Link className="primary-btn" href="/">Back to Home</Link>
      </section>
    </PageShell>
  );
}

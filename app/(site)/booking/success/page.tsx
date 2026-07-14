import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { buildPageMetadata } from "@/lib/seo/build-metadata";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    pageTitle: "Booking Request Received",
    pageDescription: "Your Aera Nail Lounge booking request was received.",
    pathname: "/booking/success",
    robots: "noindex,nofollow",
  });
}

export default function BookingSuccessPage() {
  return (
    <PageShell eyebrow="Success" title="Your Booking Request Was Received" copy="Please check your email for confirmation details.">
      <section className="lux-card booking-success">
        <p>Payment is collected at the salon after your appointment.</p>
        <Link className="primary-btn" href="/">Back to Home</Link>
      </section>
    </PageShell>
  );
}

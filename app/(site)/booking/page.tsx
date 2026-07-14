import type { Metadata } from "next";
import { BookingClient } from "@/components/booking/BookingClient";
import { PageStructuredData } from "@/components/seo/PageStructuredData";
import { buildPageMetadata } from "@/lib/seo/build-metadata";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    pageTitle: "Book Your Appointment",
    pageDescription: "Choose nail services, select a time, and request your appointment online. Payment is collected at the salon.",
    pathname: "/booking",
    robots: "index,follow",
  });
}

export default function BookingPage() {
  return (
    <>
      <PageStructuredData pathname="/booking" title="Book Your Appointment" />
      <BookingClient />
    </>
  );
}

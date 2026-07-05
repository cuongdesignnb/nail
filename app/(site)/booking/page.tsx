import type { Metadata } from "next";
import { BookingClient } from "@/components/booking/BookingClient";
import { PageStructuredData } from "@/components/seo/PageStructuredData";
import { buildPageMetadata } from "@/lib/seo/build-metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    pageTitle: "Book Your Appointment",
    pageDescription: "Choose nail services, select a time, and request or pay for your Aera Nail Lounge appointment online.",
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

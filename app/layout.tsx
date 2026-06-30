import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aera Nail Lounge | Luxury Nail Care",
  description:
    "Premium manicure, pedicure, gel polish, nail art, spa treatment and beauty packages from Aera Nail Lounge."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Quicksand, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

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
    <html lang="en" className={`${playfair.variable} ${quicksand.variable}`}>
      <body className={`${quicksand.variable} ${playfair.variable}`}>{children}</body>
    </html>
  );
}


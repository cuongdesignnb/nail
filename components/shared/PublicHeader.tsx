import Image from "next/image";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { business } from "@/lib/data";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["Services", "/services"],
  ["Gallery", "/gallery"],
  ["Packages", "/packages"],
  ["Promotions", "/promotions"],
  ["Contact", "/contact"]
];

export function PublicHeader() {
  return (
    <header className="site-header inner-header">
      <Link className="logo" href="/" aria-label="Aera Nail Lounge home">
        <Image src="/aera-mark.svg" alt="" width={58} height={58} />
        <span>{business.name}</span>
      </Link>
      <nav aria-label="Primary navigation">
        {links.map(([label, href]) => (
          <Link key={href} href={href}>{label}</Link>
        ))}
      </nav>
      <Link className="book-top" href="/booking">
        <CalendarCheck size={17} />
        Book Now
      </Link>
    </header>
  );
}

import type { ReactNode } from "react";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";

export function PageShell({ eyebrow, title, copy, children }: { eyebrow?: string; title: string; copy?: string; children: ReactNode }) {
  return (
    <main className="page-shell">
      <PublicHeader />
      <section className="page-hero">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {copy && <p>{copy}</p>}
      </section>
      {children}
      <PublicFooter />
    </main>
  );
}

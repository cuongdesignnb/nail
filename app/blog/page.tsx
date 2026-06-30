import { PageShell } from "@/components/shared/PageShell";

export default function BlogPage() {
  return (
    <PageShell eyebrow="Blog" title="Aera Beauty Notes" copy="Care tips, nail trends and salon updates.">
      <section className="content-grid three">
        {["How to Make Gel Polish Last", "Choosing the Right Nail Shape", "Why Hygiene Matters"].map((title) => (
          <article className="lux-card" key={title}>
            <span>Guide</span>
            <h3>{title}</h3>
            <p>Editorial content placeholder managed by the admin blog module.</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}

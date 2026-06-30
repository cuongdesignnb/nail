import Image from "next/image";
import { PageShell } from "@/components/shared/PageShell";
import { gallery } from "@/lib/data";

export default function GalleryPage() {
  return (
    <PageShell eyebrow="Gallery" title="Featured Nail Designs" copy="Filter inspiration by minimal, elegant, glitter, nail art and extensions.">
      <section className="filter-row">{["All", "Minimal", "Elegant", "Glitter", "Nail Art", "Extensions"].map((item) => <button key={item}>{item}</button>)}</section>
      <section className="content-grid three">
        {gallery.map((item) => (
          <article className="lux-card media-card" key={item.id}>
            <div className="card-image"><Image src={item.image} alt={item.title} fill sizes="360px" /></div>
            <span>{item.category}</span>
            <h3>{item.title}</h3>
          </article>
        ))}
      </section>
    </PageShell>
  );
}

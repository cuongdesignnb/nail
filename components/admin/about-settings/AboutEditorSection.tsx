import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";

export function AboutEditorSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="about-editor-section">
      <div className="about-editor-section-heading">
        <CheckCircle2 size={20} />
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      <div className="about-editor-fields">{children}</div>
    </section>
  );
}

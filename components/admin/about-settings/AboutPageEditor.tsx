"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import type { AboutPageContent, IconCard, ProcessStep, TeamMember, Testimonial } from "@/types/about";
import {
  ContentEditorLayout,
  ContentEditorSectionNav,
  ContentEditorStatusPanel,
  ContentEditorUnsavedGuard,
} from "@/components/admin/content-editor/ContentEditorLayout";
import { AboutEditorSection } from "./AboutEditorSection";
import { ImageField } from "./ImageField";
import { RepeaterField } from "./RepeaterField";
import {
  BookOpen,
  Globe,
  Image as ImageIcon,
  LayoutGrid,
  MessageSquare,
  Sparkles,
  Star,
  Type,
  Users,
  Zap,
  Phone,
  Search,
} from "lucide-react";

/* ──────────── Types ──────────── */
type AdminPayload = {
  draftContent: AboutPageContent;
  publishedContent: AboutPageContent;
  meta: {
    version: number;
    updatedAt: string;
    publishedAt: string | null;
    hasUnpublishedChanges: boolean;
  };
};

type SectionKey =
  | "seo"
  | "header"
  | "hero"
  | "story"
  | "values"
  | "benefits"
  | "experts"
  | "gallery"
  | "process"
  | "testimonials"
  | "cta"
  | "footer";

const SECTIONS: { key: SectionKey; label: string; icon: React.ElementType }[] = [
  { key: "seo", label: "SEO", icon: Search },
  { key: "header", label: "Header", icon: Type },
  { key: "hero", label: "Hero", icon: Sparkles },
  { key: "story", label: "Our Story", icon: BookOpen },
  { key: "values", label: "Values", icon: Star },
  { key: "benefits", label: "Benefits", icon: Zap },
  { key: "experts", label: "Team", icon: Users },
  { key: "gallery", label: "Gallery", icon: ImageIcon },
  { key: "process", label: "Process", icon: LayoutGrid },
  { key: "testimonials", label: "Testimonials", icon: MessageSquare },
  { key: "cta", label: "CTA", icon: Globe },
  { key: "footer", label: "Footer", icon: Phone },
];

/* ──────────── Confirm Dialog ──────────── */
function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  variant = "default",
}: {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "default" | "danger";
}) {
  if (!open) return null;
  return (
    <div className="admin-confirm-overlay" onClick={onCancel}>
      <div className="admin-confirm-card" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="admin-confirm-actions">
          <button className="secondary-btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={variant === "danger" ? "primary-btn bg-red-600 hover:bg-red-700" : "primary-btn"}
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────── Main Editor ──────────── */
export function AboutPageEditor() {
  const [payload, setPayload] = useState<AdminPayload | null>(null);
  const [content, setContent] = useState<AboutPageContent | null>(null);
  const [savedDraft, setSavedDraft] = useState<AboutPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<SectionKey>("seo");
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    description: string;
    action: () => void;
    variant?: "default" | "danger";
  } | null>(null);

  const isDirty = useMemo(() => {
    if (!savedDraft || !content) return false;
    return JSON.stringify(content) !== JSON.stringify(savedDraft);
  }, [content, savedDraft]);

  const hasUnpublishedChanges = useMemo(() => {
    if (!payload || !savedDraft) return false;
    return JSON.stringify(savedDraft) !== JSON.stringify(payload.publishedContent);
  }, [savedDraft, payload]);

  async function load() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/settings/about", { cache: "no-store" });
    if (response.status === 401) {
      setError("Please sign in as an Owner or Manager to edit website content.");
      setLoading(false);
      return;
    }
    const json = await response.json();
    if (!response.ok) {
      setError(json.error ?? "Unable to load About page content.");
      setLoading(false);
      return;
    }
    setPayload(json.data);
    setContent(json.data.draftContent);
    setSavedDraft(json.data.draftContent);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function adminAction(path: string, options: RequestInit = {}) {
    if (!payload || !content) return;
    setLoading(true);
    setMessage("");
    setError("");
    const response = await fetch(path, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error ?? "Action failed");
      setLoading(false);
      return;
    }
    setPayload(json.data);
    setContent(json.data.draftContent);
    setSavedDraft(json.data.draftContent);
    setMessage("Changes saved successfully.");
    setLoading(false);
    setTimeout(() => setMessage(""), 4000);
  }

  function saveDraft() {
    if (!payload || !content) return;
    adminAction("/api/admin/settings/about", {
      method: "PUT",
      body: JSON.stringify({ content, version: payload.meta.version }),
    });
  }

  function publish() {
    setConfirmAction({
      title: "Publish Changes",
      description: "This will push your current draft to the public About page. Visitors will see the updated content immediately.",
      action: () => {
        if (!payload) return;
        adminAction("/api/admin/settings/about/publish", {
          method: "POST",
          body: JSON.stringify({ version: payload.meta.version }),
        });
        setConfirmAction(null);
      },
    });
  }

  function discard() {
    setConfirmAction({
      title: "Discard Draft Changes",
      description: "This will revert your draft to match the currently published content. Any unsaved edits will be lost.",
      variant: "danger",
      action: () => {
        adminAction("/api/admin/settings/about/discard", { method: "POST" });
        setConfirmAction(null);
      },
    });
  }

  function restoreDefault() {
    setConfirmAction({
      title: "Restore Default Content",
      description: "This will replace the draft with the original default content. Published content will remain unchanged until you publish.",
      variant: "danger",
      action: () => {
        adminAction("/api/admin/settings/about/restore-default", { method: "POST" });
        setConfirmAction(null);
      },
    });
  }

  function patch<T>(updater: (current: AboutPageContent) => AboutPageContent) {
    setContent((current) => (current ? updater(current) : current));
  }

  if (loading && !content) return <div className="about-editor-skeleton">Loading About editor...</div>;
  if (!content) {
    return (
      <div className="admin-card">
        <p className="form-error">{error || "Unable to load About page content."}</p>
        <a className="primary-btn" href="/login">Sign In</a>
      </div>
    );
  }

  const sectionNav = (
    <ContentEditorSectionNav
      sections={SECTIONS.map((s) => ({ ...s, complete: true }))}
      activeKey={activeSection}
      onSelect={(key) => setActiveSection(key as SectionKey)}
    />
  );

  const statusPanel = (
    <ContentEditorStatusPanel
      isDirty={isDirty}
      hasUnpublishedChanges={hasUnpublishedChanges || isDirty}
      loading={loading}
      updatedAt={payload?.meta.updatedAt ?? null}
      publishedAt={payload?.meta.publishedAt ?? null}
      version={payload?.meta.version ?? 1}
      onSave={saveDraft}
      onPublish={publish}
      onDiscard={discard}
      onRestore={restoreDefault}
      onPreview={() => window.open("/about", "_blank")}
    />
  );

  return (
    <>
      <ContentEditorUnsavedGuard isDirty={isDirty} />

      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-aera-muted mb-2">
          Content Settings
        </p>
        <h1 className="font-heading text-[clamp(28px,3.5vw,42px)] font-medium text-aera-ink mb-1">
          About Page Editor
        </h1>
        <p className="text-aera-muted text-sm">
          Edit the content, images, and SEO for the public About page.
        </p>
      </div>

      {message && <div className="editor-toast success mb-4">{message}</div>}
      {error && <div className="editor-toast error mb-4">{error}</div>}

      <ContentEditorLayout sectionNav={sectionNav} statusPanel={statusPanel}>
        {/* SEO Section */}
        {activeSection === "seo" && (
          <AboutEditorSection title="SEO" description="Search title and description for the public About page.">
            <label>SEO Title<input value={content.seo.title} onChange={(e) => patch((c) => ({ ...c, seo: { ...c.seo, title: e.target.value } }))} /></label>
            <label>SEO Description<textarea value={content.seo.description} onChange={(e) => patch((c) => ({ ...c, seo: { ...c.seo, description: e.target.value } }))} /></label>
          </AboutEditorSection>
        )}

        {/* Header Section */}
        {activeSection === "header" && (
          <AboutEditorSection title="Header" description="Brand, logo, navigation and header call-to-action.">
            <label>Brand Name<input value={content.header.brandName} onChange={(e) => patch((c) => ({ ...c, header: { ...c.header, brandName: e.target.value } }))} /></label>
            <ImageField label="Logo" src={content.header.logo.src} alt={content.header.logo.alt} onSrcChange={(src) => patch((c) => ({ ...c, header: { ...c.header, logo: { ...c.header.logo, src } } }))} onAltChange={(alt) => patch((c) => ({ ...c, header: { ...c.header, logo: { ...c.header.logo, alt } } }))} />
            <label>Header CTA Label<input value={content.header.cta.label} onChange={(e) => patch((c) => ({ ...c, header: { ...c.header, cta: { ...c.header.cta, label: e.target.value } } }))} /></label>
            <label>Header CTA Link<input value={content.header.cta.href} onChange={(e) => patch((c) => ({ ...c, header: { ...c.header, cta: { ...c.header.cta, href: e.target.value } } }))} /></label>
          </AboutEditorSection>
        )}

        {/* Hero Section */}
        {activeSection === "hero" && (
          <AboutEditorSection title="Hero" description="Main headline, buttons and hero image.">
            <label>Eyebrow<input value={content.hero.eyebrow} onChange={(e) => patch((c) => ({ ...c, hero: { ...c.hero, eyebrow: e.target.value } }))} /></label>
            <label>Title<input value={content.hero.title} onChange={(e) => patch((c) => ({ ...c, hero: { ...c.hero, title: e.target.value } }))} /></label>
            <label>Highlight Text<input value={content.hero.highlightText} onChange={(e) => patch((c) => ({ ...c, hero: { ...c.hero, highlightText: e.target.value } }))} /></label>
            <label>Description<textarea value={content.hero.description} onChange={(e) => patch((c) => ({ ...c, hero: { ...c.hero, description: e.target.value } }))} /></label>
            <label>Primary Button Label<input value={content.hero.primaryButton.label} onChange={(e) => patch((c) => ({ ...c, hero: { ...c.hero, primaryButton: { ...c.hero.primaryButton, label: e.target.value } } }))} /></label>
            <label>Primary Button Link<input value={content.hero.primaryButton.href} onChange={(e) => patch((c) => ({ ...c, hero: { ...c.hero, primaryButton: { ...c.hero.primaryButton, href: e.target.value } } }))} /></label>
            <ImageField label="Hero Image" src={content.hero.image.src} alt={content.hero.image.alt} onSrcChange={(src) => patch((c) => ({ ...c, hero: { ...c.hero, image: { ...c.hero.image, src } } }))} onAltChange={(alt) => patch((c) => ({ ...c, hero: { ...c.hero, image: { ...c.hero.image, alt } } }))} />
          </AboutEditorSection>
        )}

        {/* Story Section */}
        {activeSection === "story" && (
          <AboutEditorSection title="Our Story" description="Story intro, paragraphs, imagery, stat and highlights.">
            <label>Eyebrow<input value={content.story.eyebrow} onChange={(e) => patch((c) => ({ ...c, story: { ...c.story, eyebrow: e.target.value } }))} /></label>
            <label>Title<input value={content.story.title} onChange={(e) => patch((c) => ({ ...c, story: { ...c.story, title: e.target.value } }))} /></label>
            <RepeaterField title="Paragraphs" items={content.story.paragraphs.map((text, index) => ({ id: `paragraph-${index}`, text }))} createItem={() => ({ id: crypto.randomUUID(), text: "New paragraph" })} onChange={(items) => patch((c) => ({ ...c, story: { ...c.story, paragraphs: items.map((item) => item.text) } }))} renderItem={(item, _index, update) => <textarea value={item.text} onChange={(e) => update({ ...item, text: e.target.value })} />} />
            <RepeaterField<IconCard> title="Highlights" items={content.story.highlights} createItem={() => ({ id: crypto.randomUUID(), icon: "sparkles", title: "New Highlight", description: "Describe this highlight." })} onChange={(items) => patch((c) => ({ ...c, story: { ...c.story, highlights: items } }))} renderItem={(item, _index, update) => <><input value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} /><textarea value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} /></>} />
          </AboutEditorSection>
        )}

        {/* Values Section */}
        {activeSection === "values" && (
          <AboutEditorSection title="Mission, Vision & Values" description="Mission cards and brand values.">
            <RepeaterField<IconCard> title="Mission / Vision / Values" items={content.missionVisionValues} createItem={() => ({ id: crypto.randomUUID(), icon: "gem", title: "New Card", description: "Describe this card." })} onChange={(items) => patch((c) => ({ ...c, missionVisionValues: items }))} renderItem={(item, _index, update) => <><input value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} /><textarea value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} /></>} />
          </AboutEditorSection>
        )}

        {/* Benefits Section */}
        {activeSection === "benefits" && (
          <AboutEditorSection title="Benefits" description="Why choose Aera.">
            <label>Eyebrow<input value={content.benefits.eyebrow} onChange={(e) => patch((c) => ({ ...c, benefits: { ...c.benefits, eyebrow: e.target.value } }))} /></label>
            <RepeaterField<IconCard> title="Benefits" items={content.benefits.items} createItem={() => ({ id: crypto.randomUUID(), icon: "sparkles", title: "New Benefit", description: "Describe this benefit." })} onChange={(items) => patch((c) => ({ ...c, benefits: { ...c.benefits, items } }))} renderItem={(item, _index, update) => <><input value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} /><textarea value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} /></>} />
          </AboutEditorSection>
        )}

        {/* Experts Section */}
        {activeSection === "experts" && (
          <AboutEditorSection title="Team & Experts" description="Team members.">
            <label>Eyebrow<input value={content.experts.eyebrow} onChange={(e) => patch((c) => ({ ...c, experts: { ...c.experts, eyebrow: e.target.value } }))} /></label>
            <label>Title<input value={content.experts.title} onChange={(e) => patch((c) => ({ ...c, experts: { ...c.experts, title: e.target.value } }))} /></label>
            <RepeaterField<TeamMember> title="Team Members" items={content.experts.members} createItem={() => ({ id: crypto.randomUUID(), name: "New Expert", role: "Nail Artist", avatar: { src: "/aera-mark.svg", alt: "New Expert" } })} onChange={(members) => patch((c) => ({ ...c, experts: { ...c.experts, members } }))} renderItem={(item, _index, update) => <><input value={item.name} onChange={(e) => update({ ...item, name: e.target.value })} /><input value={item.role} onChange={(e) => update({ ...item, role: e.target.value })} /><ImageField label="Avatar" src={item.avatar.src} alt={item.avatar.alt} onSrcChange={(src) => update({ ...item, avatar: { ...item.avatar, src } })} onAltChange={(alt) => update({ ...item, avatar: { ...item.avatar, alt } })} /></>} />
          </AboutEditorSection>
        )}

        {/* Gallery Section */}
        {activeSection === "gallery" && (
          <AboutEditorSection title="Salon Experience" description="Salon experience gallery.">
            <label>Eyebrow<input value={content.salonExperience.eyebrow} onChange={(e) => patch((c) => ({ ...c, salonExperience: { ...c.salonExperience, eyebrow: e.target.value } }))} /></label>
          </AboutEditorSection>
        )}

        {/* Process Section */}
        {activeSection === "process" && (
          <AboutEditorSection title="Process Steps" description="How it works steps.">
            <label>Eyebrow<input value={content.process.eyebrow} onChange={(e) => patch((c) => ({ ...c, process: { ...c.process, eyebrow: e.target.value } }))} /></label>
            <RepeaterField<ProcessStep> title="Process Steps" items={content.process.steps} createItem={() => ({ id: crypto.randomUUID(), step: "05", icon: "sparkles", title: "New Step", description: "Describe this step." })} onChange={(steps) => patch((c) => ({ ...c, process: { ...c.process, steps } }))} renderItem={(item, _index, update) => <><input value={item.step} onChange={(e) => update({ ...item, step: e.target.value })} /><input value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} /><textarea value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} /></>} />
          </AboutEditorSection>
        )}

        {/* Testimonials Section */}
        {activeSection === "testimonials" && (
          <AboutEditorSection title="Testimonials" description="Client testimonials.">
            <label>Eyebrow<input value={content.testimonials.eyebrow} onChange={(e) => patch((c) => ({ ...c, testimonials: { ...c.testimonials, eyebrow: e.target.value } }))} /></label>
            <RepeaterField<Testimonial> title="Testimonials" items={content.testimonials.items} createItem={() => ({ id: crypto.randomUUID(), name: "New Client", rating: 5, quote: "Share a client quote." })} onChange={(items) => patch((c) => ({ ...c, testimonials: { ...c.testimonials, items } }))} renderItem={(item, _index, update) => <><input value={item.name} onChange={(e) => update({ ...item, name: e.target.value })} /><input type="number" min={1} max={5} value={item.rating} onChange={(e) => update({ ...item, rating: Number(e.target.value) })} /><textarea value={item.quote} onChange={(e) => update({ ...item, quote: e.target.value })} /></>} />
          </AboutEditorSection>
        )}

        {/* CTA Section */}
        {activeSection === "cta" && (
          <AboutEditorSection title="Final CTA" description="Closing call-to-action.">
            <label>CTA Title<input value={content.cta.title} onChange={(e) => patch((c) => ({ ...c, cta: { ...c.cta, title: e.target.value } }))} /></label>
            <label>CTA Description<textarea value={content.cta.description} onChange={(e) => patch((c) => ({ ...c, cta: { ...c.cta, description: e.target.value } }))} /></label>
          </AboutEditorSection>
        )}

        {/* Footer Section */}
        {activeSection === "footer" && (
          <AboutEditorSection title="Footer" description="Footer brand text and newsletter.">
            <label>Footer Brand Text<textarea value={content.footer.brandText} onChange={(e) => patch((c) => ({ ...c, footer: { ...c.footer, brandText: e.target.value } }))} /></label>
            <label>Newsletter Title<input value={content.footer.newsletter.title} onChange={(e) => patch((c) => ({ ...c, footer: { ...c.footer, newsletter: { ...c.footer.newsletter, title: e.target.value } } }))} /></label>
            <label>Newsletter Description<input value={content.footer.newsletter.description} onChange={(e) => patch((c) => ({ ...c, footer: { ...c.footer, newsletter: { ...c.footer.newsletter, description: e.target.value } } }))} /></label>
          </AboutEditorSection>
        )}
      </ContentEditorLayout>

      <ConfirmDialog
        open={!!confirmAction}
        title={confirmAction?.title ?? ""}
        description={confirmAction?.description ?? ""}
        onConfirm={() => confirmAction?.action()}
        onCancel={() => setConfirmAction(null)}
        variant={confirmAction?.variant}
      />
    </>
  );
}

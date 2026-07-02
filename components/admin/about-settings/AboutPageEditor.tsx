"use client";

import { useEffect, useMemo, useState } from "react";
import type { AboutPageContent, IconCard, ProcessStep, TeamMember, Testimonial } from "@/types/about";
import { AboutEditorSection } from "./AboutEditorSection";
import { AboutEditorToolbar } from "./AboutEditorToolbar";
import { ImageField } from "./ImageField";
import { RepeaterField } from "./RepeaterField";

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

export function AboutPageEditor() {
  const [payload, setPayload] = useState<AdminPayload | null>(null);
  const [content, setContent] = useState<AboutPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const hasChanges = useMemo(() => {
    if (!payload || !content) return false;
    return JSON.stringify(content) !== JSON.stringify(payload.publishedContent);
  }, [content, payload]);

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
      setError(json.error ?? "Unable to load About page content. Please verify the database connection and try again.");
      setLoading(false);
      return;
    }
    setPayload(json.data);
    setContent(json.data.draftContent);
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
      headers: { "Content-Type": "application/json", ...(options.headers ?? {}) }
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error ?? "Action failed");
      setLoading(false);
      return;
    }
    setPayload(json.data);
    setContent(json.data.draftContent);
    setMessage("Changes saved successfully.");
    setLoading(false);
  }

  function saveDraft() {
    if (!payload || !content) return;
    adminAction("/api/admin/settings/about", {
      method: "PUT",
      body: JSON.stringify({ content, version: payload.meta.version })
    });
  }

  function publish() {
    if (!payload || !confirm("Publish changes to the public About page?")) return;
    adminAction("/api/admin/settings/about/publish", {
      method: "POST",
      body: JSON.stringify({ version: payload.meta.version })
    });
  }

  function discard() {
    if (!confirm("Discard draft changes and restore the published content?")) return;
    adminAction("/api/admin/settings/about/discard", { method: "POST" });
  }

  function restoreDefault() {
    if (!confirm("Restore default About content to the draft? Published content will not change until you publish.")) return;
    adminAction("/api/admin/settings/about/restore-default", { method: "POST" });
  }

  function patch<T>(updater: (current: AboutPageContent) => T extends AboutPageContent ? AboutPageContent : AboutPageContent) {
    setContent((current) => current ? updater(current) : current);
  }

  if (loading && !content) return <div className="about-editor-skeleton">Loading About editor...</div>;
  if (!content) {
    return (
      <div className="admin-card">
        <p className="form-error">{error || "Unable to load About page content. Please verify the database connection and try again."}</p>
        <a className="primary-btn" href="/login">Sign In</a>
      </div>
    );
  }

  return (
    <div className="about-editor-layout">
      <div className="about-editor-main">
        {message && <div className="editor-toast success">{message}</div>}
        {error && <div className="editor-toast error">{error}</div>}

        <AboutEditorSection title="SEO" description="Search title and description for the public About page.">
          <label>SEO Title<input value={content.seo.title} onChange={(e) => patch((c) => ({ ...c, seo: { ...c.seo, title: e.target.value } }))} /></label>
          <label>SEO Description<textarea value={content.seo.description} onChange={(e) => patch((c) => ({ ...c, seo: { ...c.seo, description: e.target.value } }))} /></label>
        </AboutEditorSection>

        <AboutEditorSection title="Header" description="Brand, logo, navigation and header call-to-action.">
          <label>Brand Name<input value={content.header.brandName} onChange={(e) => patch((c) => ({ ...c, header: { ...c.header, brandName: e.target.value } }))} /></label>
          <ImageField label="Logo" src={content.header.logo.src} alt={content.header.logo.alt} onSrcChange={(src) => patch((c) => ({ ...c, header: { ...c.header, logo: { ...c.header.logo, src } } }))} onAltChange={(alt) => patch((c) => ({ ...c, header: { ...c.header, logo: { ...c.header.logo, alt } } }))} />
          <label>Header CTA Label<input value={content.header.cta.label} onChange={(e) => patch((c) => ({ ...c, header: { ...c.header, cta: { ...c.header.cta, label: e.target.value } } }))} /></label>
          <label>Header CTA Link<input value={content.header.cta.href} onChange={(e) => patch((c) => ({ ...c, header: { ...c.header, cta: { ...c.header.cta, href: e.target.value } } }))} /></label>
        </AboutEditorSection>

        <AboutEditorSection title="Hero" description="Main headline, buttons and hero image.">
          <label>Eyebrow<input value={content.hero.eyebrow} onChange={(e) => patch((c) => ({ ...c, hero: { ...c.hero, eyebrow: e.target.value } }))} /></label>
          <label>Title<input value={content.hero.title} onChange={(e) => patch((c) => ({ ...c, hero: { ...c.hero, title: e.target.value } }))} /></label>
          <label>Highlight Text<input value={content.hero.highlightText} onChange={(e) => patch((c) => ({ ...c, hero: { ...c.hero, highlightText: e.target.value } }))} /></label>
          <label>Description<textarea value={content.hero.description} onChange={(e) => patch((c) => ({ ...c, hero: { ...c.hero, description: e.target.value } }))} /></label>
          <label>Primary Button Label<input value={content.hero.primaryButton.label} onChange={(e) => patch((c) => ({ ...c, hero: { ...c.hero, primaryButton: { ...c.hero.primaryButton, label: e.target.value } } }))} /></label>
          <label>Primary Button Link<input value={content.hero.primaryButton.href} onChange={(e) => patch((c) => ({ ...c, hero: { ...c.hero, primaryButton: { ...c.hero.primaryButton, href: e.target.value } } }))} /></label>
          <ImageField label="Hero Image" src={content.hero.image.src} alt={content.hero.image.alt} onSrcChange={(src) => patch((c) => ({ ...c, hero: { ...c.hero, image: { ...c.hero.image, src } } }))} onAltChange={(alt) => patch((c) => ({ ...c, hero: { ...c.hero, image: { ...c.hero.image, alt } } }))} />
        </AboutEditorSection>

        <AboutEditorSection title="Our Story" description="Story intro, paragraphs, imagery, stat and highlights.">
          <label>Eyebrow<input value={content.story.eyebrow} onChange={(e) => patch((c) => ({ ...c, story: { ...c.story, eyebrow: e.target.value } }))} /></label>
          <label>Title<input value={content.story.title} onChange={(e) => patch((c) => ({ ...c, story: { ...c.story, title: e.target.value } }))} /></label>
          <RepeaterField title="Paragraphs" items={content.story.paragraphs.map((text, index) => ({ id: `paragraph-${index}`, text }))} createItem={() => ({ id: crypto.randomUUID(), text: "New paragraph" })} onChange={(items) => patch((c) => ({ ...c, story: { ...c.story, paragraphs: items.map((item) => item.text) } }))} renderItem={(item, _index, update) => <textarea value={item.text} onChange={(e) => update({ ...item, text: e.target.value })} />} />
          <RepeaterField<IconCard> title="Highlights" items={content.story.highlights} createItem={() => ({ id: crypto.randomUUID(), icon: "sparkles", title: "New Highlight", description: "Describe this highlight." })} onChange={(items) => patch((c) => ({ ...c, story: { ...c.story, highlights: items } }))} renderItem={(item, _index, update) => <><input value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} /><textarea value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} /></>} />
        </AboutEditorSection>

        <AboutEditorSection title="Cards, Benefits & Process" description="Mission cards, benefit cards and process steps.">
          <RepeaterField<IconCard> title="Mission / Vision / Values" items={content.missionVisionValues} createItem={() => ({ id: crypto.randomUUID(), icon: "gem", title: "New Card", description: "Describe this card." })} onChange={(items) => patch((c) => ({ ...c, missionVisionValues: items }))} renderItem={(item, _index, update) => <><input value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} /><textarea value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} /></>} />
          <RepeaterField<IconCard> title="Benefits" items={content.benefits.items} createItem={() => ({ id: crypto.randomUUID(), icon: "sparkles", title: "New Benefit", description: "Describe this benefit." })} onChange={(items) => patch((c) => ({ ...c, benefits: { ...c.benefits, items } }))} renderItem={(item, _index, update) => <><input value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} /><textarea value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} /></>} />
          <RepeaterField<ProcessStep> title="Process Steps" items={content.process.steps} createItem={() => ({ id: crypto.randomUUID(), step: "05", icon: "sparkles", title: "New Step", description: "Describe this step." })} onChange={(steps) => patch((c) => ({ ...c, process: { ...c.process, steps } }))} renderItem={(item, _index, update) => <><input value={item.step} onChange={(e) => update({ ...item, step: e.target.value })} /><input value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} /><textarea value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} /></>} />
        </AboutEditorSection>

        <AboutEditorSection title="Experts & Testimonials" description="Team members and client testimonials.">
          <RepeaterField<TeamMember> title="Team Members" items={content.experts.members} createItem={() => ({ id: crypto.randomUUID(), name: "New Expert", role: "Nail Artist", avatar: { src: "/aera-mark.svg", alt: "New Expert" } })} onChange={(members) => patch((c) => ({ ...c, experts: { ...c.experts, members } }))} renderItem={(item, _index, update) => <><input value={item.name} onChange={(e) => update({ ...item, name: e.target.value })} /><input value={item.role} onChange={(e) => update({ ...item, role: e.target.value })} /><ImageField label="Avatar" src={item.avatar.src} alt={item.avatar.alt} onSrcChange={(src) => update({ ...item, avatar: { ...item.avatar, src } })} onAltChange={(alt) => update({ ...item, avatar: { ...item.avatar, alt } })} /></>} />
          <RepeaterField<Testimonial> title="Testimonials" items={content.testimonials.items} createItem={() => ({ id: crypto.randomUUID(), name: "New Client", rating: 5, quote: "Share a client quote." })} onChange={(items) => patch((c) => ({ ...c, testimonials: { ...c.testimonials, items } }))} renderItem={(item, _index, update) => <><input value={item.name} onChange={(e) => update({ ...item, name: e.target.value })} /><input type="number" min={1} max={5} value={item.rating} onChange={(e) => update({ ...item, rating: Number(e.target.value) })} /><textarea value={item.quote} onChange={(e) => update({ ...item, quote: e.target.value })} /></>} />
        </AboutEditorSection>

        <AboutEditorSection title="Final CTA & Footer" description="Closing CTA, contact snippets, footer and newsletter.">
          <label>CTA Title<input value={content.cta.title} onChange={(e) => patch((c) => ({ ...c, cta: { ...c.cta, title: e.target.value } }))} /></label>
          <label>CTA Description<textarea value={content.cta.description} onChange={(e) => patch((c) => ({ ...c, cta: { ...c.cta, description: e.target.value } }))} /></label>
          <label>Footer Brand Text<textarea value={content.footer.brandText} onChange={(e) => patch((c) => ({ ...c, footer: { ...c.footer, brandText: e.target.value } }))} /></label>
          <label>Newsletter Title<input value={content.footer.newsletter.title} onChange={(e) => patch((c) => ({ ...c, footer: { ...c.footer, newsletter: { ...c.footer.newsletter, title: e.target.value } } }))} /></label>
        </AboutEditorSection>
      </div>

      <AboutEditorToolbar loading={loading} hasChanges={hasChanges} updatedAt={payload?.meta.updatedAt ?? null} publishedAt={payload?.meta.publishedAt ?? null} onSave={saveDraft} onPublish={publish} onDiscard={discard} onRestore={restoreDefault} />
    </div>
  );
}

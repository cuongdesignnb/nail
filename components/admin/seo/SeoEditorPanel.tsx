'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, AlertTriangle } from 'lucide-react';
import { SeoSerpPreview } from './SeoSerpPreview';
import { SeoSocialPreview } from './SeoSocialPreview';
import { SeoRobotsControl } from './SeoRobotsControl';

interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  twitterCard?: string;
  schemaJson?: string;
}

interface SeoEditorPanelProps {
  scopeKey: string;
  pageKey: string;
  initialData?: SeoData | null;
  onSave: (data: SeoData) => Promise<void>;
}

function CharWarning({ count, limit, label }: { count: number; limit: number; label: string }) {
  if (count <= limit) return null;
  return (
    <span className="ml-2 inline-flex items-center gap-1 text-xs text-amber-600">
      <AlertTriangle size={12} />
      {label} may be truncated ({count}/{limit})
    </span>
  );
}

export function SeoEditorPanel({ scopeKey, pageKey, initialData, onSave }: SeoEditorPanelProps) {
  const [form, setForm] = useState<SeoData>({
    title: '',
    description: '',
    keywords: '',
    canonicalPath: '',
    robots: 'index,follow',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogImageAlt: '',
    twitterCard: 'summary_large_image',
    schemaJson: '',
  });
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        keywords: initialData.keywords || '',
        canonicalPath: initialData.canonicalPath || '',
        robots: initialData.robots || 'index,follow',
        ogTitle: initialData.ogTitle || '',
        ogDescription: initialData.ogDescription || '',
        ogImage: initialData.ogImage || '',
        ogImageAlt: initialData.ogImageAlt || '',
        twitterCard: initialData.twitterCard || 'summary_large_image',
        schemaJson: initialData.schemaJson
          ? (typeof initialData.schemaJson === 'string'
              ? initialData.schemaJson
              : JSON.stringify(initialData.schemaJson, null, 2))
          : '',
      });
      setIsDirty(false);
      setSaved(false);
    }
  }, [initialData, scopeKey]);

  const update = useCallback((field: keyof SeoData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setSaved(false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(form);
      setIsDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save SEO error:', err);
    } finally {
      setSaving(false);
    }
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const inputClass =
    'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-aera-ink placeholder:text-aera-muted/50 focus:border-aera-accent focus:outline-none';
  const labelClass = 'mb-1.5 block text-sm font-medium text-aera-ink';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-aera-ink">SEO Settings</h2>
          <p className="text-sm text-aera-muted">Configure search engine optimization for this page</p>
        </div>
        <button
          onClick={handleSave}
          disabled={!isDirty || saving}
          className="inline-flex items-center gap-2 rounded-lg bg-aera-accent px-4 py-2 text-sm font-medium text-white hover:bg-aera-accentHover disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
        </button>
      </div>

      {/* Basic SEO */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-aera-muted">Basic SEO</h3>

        <div>
          <label className={labelClass}>
            Page Title
            <span className="ml-2 text-xs text-aera-muted tabular-nums">{form.title?.length || 0}/60</span>
            <CharWarning count={form.title?.length || 0} limit={60} label="Title" />
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Page title for search engines"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Meta Description
            <span className="ml-2 text-xs text-aera-muted tabular-nums">{form.description?.length || 0}/160</span>
            <CharWarning count={form.description?.length || 0} limit={160} label="Description" />
          </label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Brief description for search results"
            rows={3}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Keywords</label>
          <input
            type="text"
            value={form.keywords}
            onChange={(e) => update('keywords', e.target.value)}
            placeholder="nail salon, manicure, pedicure"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-aera-muted">Comma-separated keywords</p>
        </div>

        <div>
          <label className={labelClass}>Canonical Path</label>
          <input
            type="text"
            value={form.canonicalPath}
            onChange={(e) => update('canonicalPath', e.target.value)}
            placeholder="/about"
            className={inputClass}
          />
        </div>

        <SeoRobotsControl
          value={form.robots || 'index,follow'}
          onChange={(val) => update('robots', val)}
        />
      </div>

      {/* SERP Preview */}
      <SeoSerpPreview
        title={form.title || pageKey}
        url={`${siteUrl}${form.canonicalPath || `/${scopeKey}`}`}
        description={form.description || 'No description set'}
      />

      {/* Open Graph / Social */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-aera-muted">Social / Open Graph</h3>

        <div>
          <label className={labelClass}>OG Title</label>
          <input
            type="text"
            value={form.ogTitle}
            onChange={(e) => update('ogTitle', e.target.value)}
            placeholder="Defaults to page title"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>OG Description</label>
          <textarea
            value={form.ogDescription}
            onChange={(e) => update('ogDescription', e.target.value)}
            placeholder="Defaults to meta description"
            rows={2}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>OG Image URL</label>
          <input
            type="text"
            value={form.ogImage}
            onChange={(e) => update('ogImage', e.target.value)}
            placeholder="https://example.com/og-image.jpg"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>OG Image Alt Text</label>
          <input
            type="text"
            value={form.ogImageAlt}
            onChange={(e) => update('ogImageAlt', e.target.value)}
            placeholder="Describe the image"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Twitter Card Type</label>
          <select
            value={form.twitterCard}
            onChange={(e) => update('twitterCard', e.target.value)}
            className={inputClass}
          >
            <option value="summary">Summary</option>
            <option value="summary_large_image">Summary with Large Image</option>
          </select>
        </div>
      </div>

      {/* Social Preview */}
      <SeoSocialPreview
        title={form.ogTitle || form.title || pageKey}
        description={form.ogDescription || form.description || ''}
        image={form.ogImage || ''}
        siteName="Aera Nail Lounge"
      />

      {/* Schema JSON */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-aera-muted">
          Structured Data (JSON-LD)
        </h3>
        <textarea
          value={form.schemaJson}
          onChange={(e) => update('schemaJson', e.target.value)}
          placeholder='{"@context":"https://schema.org",...}'
          rows={8}
          className={`${inputClass} font-mono text-xs`}
        />
        <p className="text-xs text-aera-muted">
          Optional custom JSON-LD structured data for this page
        </p>
      </div>
    </div>
  );
}

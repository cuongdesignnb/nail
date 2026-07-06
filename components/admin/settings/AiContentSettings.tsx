"use client";

import React, { useEffect, useState } from "react";
import { Bot, CheckCircle2, KeyRound, Save, ShieldAlert, Trash2, Zap } from "lucide-react";

type AiSettings = {
  isEnabled: boolean;
  apiKeyConfigured: boolean;
  apiKeyLastFour: string | null;
  textModel: string;
  imageModel: string;
  defaultOutputLanguage: string;
  defaultArticleLength: number;
  defaultGenerateImage: boolean;
  maxKeywordsPerBatch: number;
  maxConcurrentJobs: number;
  maxRetriesPerJob: number;
  humanReviewRequired: boolean;
  autoScheduleEnabled: boolean;
  lastTestStatus: string | null;
};

const inputClass = "w-full rounded-xl border border-[var(--admin-border-strong)] bg-white px-3 py-2.5 text-xs text-[var(--admin-ink)] focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20";

export default function AiContentSettings() {
  const [settings, setSettings] = useState<AiSettings | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/settings/ai-content");
    const json = await res.json();
    if (json.success) setSettings(json.data);
    else setMessage(json.error || "Unable to load AI settings.");
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(endpoint = "/api/admin/settings/ai-content", body?: Record<string, unknown>) {
    if (!settings) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body ?? { ...settings, apiKey: apiKey || undefined }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Save failed.");
      setSettings(json.data);
      setApiKey("");
      setMessage("AI settings saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function postAction(url: string, successText: string) {
    setMessage("");
    setTesting(url.includes("test"));
    try {
      const res = await fetch(url, { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Action failed.");
      setSettings(json.data);
      setMessage(successText);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Action failed.");
    } finally {
      setTesting(false);
    }
  }

  if (!settings) return <div className="text-xs text-[var(--admin-muted)]">Loading AI settings...</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[var(--admin-ink)] flex items-center gap-2"><Bot size={16} /> AI Content Studio</h3>
            <p className="mt-1 text-xs text-[var(--admin-muted)]">OpenAI provider, model defaults, batch limits, and human review policy.</p>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-[var(--admin-ink)]">
            <input type="checkbox" checked={settings.isEnabled} onChange={(e) => setSettings({ ...settings, isEnabled: e.target.checked })} />
            Enabled
          </label>
        </div>

        {message && (
          <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] px-3 py-2 text-xs text-[var(--admin-ink)]">{message}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-semibold text-[var(--admin-ink)]">OpenAI API Key</label>
            <div className="flex gap-2">
              <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={settings.apiKeyConfigured ? `Configured ending ${settings.apiKeyLastFour}` : "sk-..."} className={inputClass} type="password" />
              <button type="button" onClick={() => postAction("/api/admin/settings/ai-content/remove-key", "API key removed.")} className="rounded-xl border border-rose-200 px-3 text-rose-600"><Trash2 size={14} /></button>
            </div>
          </div>

          <Field label="Text Model" value={settings.textModel} onChange={(v) => setSettings({ ...settings, textModel: v })} />
          <Field label="Image Model" value={settings.imageModel} onChange={(v) => setSettings({ ...settings, imageModel: v })} />
          <Field label="Output Language" value={settings.defaultOutputLanguage} onChange={(v) => setSettings({ ...settings, defaultOutputLanguage: v })} />
          <Field label="Article Length" type="number" value={String(settings.defaultArticleLength)} onChange={(v) => setSettings({ ...settings, defaultArticleLength: Number(v) })} />
          <Field label="Max Keywords / Batch" type="number" value={String(settings.maxKeywordsPerBatch)} onChange={(v) => setSettings({ ...settings, maxKeywordsPerBatch: Number(v) })} />
          <Field label="Max Retries / Job" type="number" value={String(settings.maxRetriesPerJob)} onChange={(v) => setSettings({ ...settings, maxRetriesPerJob: Number(v) })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Toggle icon={KeyRound} label="Generate Images" checked={settings.defaultGenerateImage} onChange={(v) => setSettings({ ...settings, defaultGenerateImage: v })} />
          <Toggle icon={ShieldAlert} label="Human Review" checked={settings.humanReviewRequired} onChange={(v) => setSettings({ ...settings, humanReviewRequired: v })} />
          <Toggle icon={CheckCircle2} label="Auto Schedule" checked={settings.autoScheduleEnabled} onChange={(v) => setSettings({ ...settings, autoScheduleEnabled: v })} />
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => submit()} disabled={saving} className="rounded-full bg-[var(--admin-accent)] px-5 py-2 text-xs font-bold text-white inline-flex items-center gap-2 disabled:opacity-40"><Save size={14} /> {saving ? "Saving..." : "Save AI Settings"}</button>
          <button type="button" onClick={() => postAction("/api/admin/settings/ai-content/test", "OpenAI connection test passed.")} disabled={testing} className="rounded-full border border-[var(--admin-border)] px-5 py-2 text-xs font-bold text-[var(--admin-ink)] inline-flex items-center gap-2"><Zap size={14} /> {testing ? "Testing..." : "Test Connection"}</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-[var(--admin-ink)]">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
    </div>
  );
}

function Toggle({ icon: Icon, label, checked, onChange }: { icon: any; label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] px-3 py-3 text-xs font-semibold text-[var(--admin-ink)]">
      <Icon size={14} className="text-[var(--admin-accent)]" />
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

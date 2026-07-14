"use client";

import React from "react";
import { Bot, Save, Trash2, Zap } from "lucide-react";
import { useToast } from "@/components/admin/ui/AdminToastProvider";
import { settingsEqual } from "@/lib/settings/normalize-settings";
import { SettingsStatusFooter } from "./SettingsStatusFooter";

type AiSettings = {
  isEnabled: boolean; apiKeyConfigured: boolean; apiKeyLastFour: string | null;
  textModel: string; imageModel: string; defaultOutputLanguage: string; defaultArticleTone: string;
  defaultArticleLength: number; defaultGenerateImage: boolean; defaultImageSize: string; defaultImageQuality: string;
  maxKeywordsPerBatch: number; maxConcurrentJobs: number; maxRetriesPerJob: number; monthlyBudgetLimit: number | null;
  humanReviewRequired: boolean; autoScheduleEnabled: boolean; lastTestStatus: string | null;
};

const editableKeys: Array<keyof AiSettings> = [
  "isEnabled", "textModel", "imageModel", "defaultOutputLanguage", "defaultArticleTone", "defaultArticleLength",
  "defaultGenerateImage", "defaultImageSize", "defaultImageQuality", "maxKeywordsPerBatch", "maxConcurrentJobs",
  "maxRetriesPerJob", "monthlyBudgetLimit", "humanReviewRequired", "autoScheduleEnabled",
];
const inputClass = "w-full rounded-xl border border-[var(--admin-border-strong)] bg-white px-3 py-2.5 text-xs focus:border-[var(--admin-accent)] focus:outline-none";

function editable(settings: AiSettings) { return Object.fromEntries(editableKeys.map((key) => [key, settings[key]])); }

export default function AiContentSettings() {
  const toast = useToast();
  const [settings, setSettings] = React.useState<AiSettings | null>(null);
  const [initial, setInitial] = React.useState<AiSettings | null>(null);
  const [apiKey, setApiKey] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});
  const [saving, setSaving] = React.useState(false);
  const [testing, setTesting] = React.useState(false);
  const [lastSavedAt, setLastSavedAt] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    const response = await fetch("/api/admin/settings/ai-content", { cache: "no-store" });
    const json = await response.json();
    if (!response.ok || !json.success) { setError(json.error || "Unable to load AI settings."); return; }
    setSettings(json.data); setInitial(json.data); setError(null);
  }, []);
  React.useEffect(() => { load(); }, [load]);
  const dirty = Boolean(apiKey) || (settings && initial ? !settingsEqual(editable(settings), editable(initial)) : false);
  function update<K extends keyof AiSettings>(key: K, value: AiSettings[K]) { if (settings) setSettings({ ...settings, [key]: value }); }

  async function save() {
    if (!settings || !dirty) return;
    setSaving(true); setError(null); setFieldErrors({});
    const payload = { ...editable(settings), ...(apiKey.trim() ? { apiKey: apiKey.trim() } : {}) };
    const response = await fetch("/api/admin/settings/ai-content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const json = await response.json();
    if (!response.ok || !json.success) { setError(json.error || "Unable to save AI settings."); setFieldErrors(json.issues || {}); setSaving(false); return; }
    const verifyResponse = await fetch("/api/admin/settings/ai-content", { cache: "no-store" });
    const verifyJson = await verifyResponse.json();
    setSaving(false);
    if (!verifyResponse.ok || !verifyJson.success || !settingsEqual(editable(settings), editable(verifyJson.data))) { setError("AI settings were saved but could not be verified."); return; }
    setSettings(verifyJson.data); setInitial(verifyJson.data); setApiKey(""); setLastSavedAt(verifyJson.meta?.updatedAt || new Date().toISOString());
    toast.success("AI settings saved and verified.");
  }

  async function action(url: string, text: string) { setTesting(true); const response = await fetch(url, { method: "POST" }); const json = await response.json(); setTesting(false); if (!response.ok || !json.success) { setError(json.error || "Action failed."); return; } setSettings(json.data); setInitial(json.data); setApiKey(""); toast.success(text); }
  if (!settings && error) return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-xs text-red-700">{error} <button className="font-bold underline" onClick={load}>Retry</button></div>;
  if (!settings) return <p className="text-xs text-[var(--admin-muted)]">Loading AI settings...</p>;
  const fields: Array<[keyof AiSettings, string, string]> = [
    ["textModel", "Text Model", "text"], ["imageModel", "Image Model", "text"], ["defaultOutputLanguage", "Output Language", "text"],
    ["defaultArticleTone", "Article Tone", "text"], ["defaultArticleLength", "Article Length", "number"], ["defaultImageSize", "Image Size", "text"],
    ["defaultImageQuality", "Image Quality", "text"], ["maxKeywordsPerBatch", "Max Keywords / Batch", "number"], ["maxConcurrentJobs", "Concurrent Jobs", "number"],
    ["maxRetriesPerJob", "Retries / Job", "number"], ["monthlyBudgetLimit", "Monthly Budget", "number"],
  ];
  return <div className="max-w-4xl space-y-5 rounded-2xl border border-[var(--admin-border)] bg-white p-6">
    <div className="flex items-center gap-2"><Bot size={17} /><div><h3 className="text-sm font-bold">AI Content Studio</h3><p className="text-[11px] text-[var(--admin-muted)]">UTF-8 safe, write-only API key, explicit persisted fields.</p></div></div>
    <label className="flex gap-2 text-xs font-semibold"><input type="checkbox" checked={settings.isEnabled} onChange={(event) => update("isEnabled", event.target.checked)} />Enabled</label>
    <label className="block text-xs font-semibold">OpenAI API Key<div className="mt-1 flex gap-2"><input className={inputClass} type="password" value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder={settings.apiKeyConfigured ? `Configured ending ${settings.apiKeyLastFour}` : "sk-..."} /><button onClick={() => action("/api/admin/settings/ai-content/remove-key", "API key removed.")} className="rounded-xl border border-rose-200 px-3 text-rose-600"><Trash2 size={14} /></button></div></label>
    <div className="grid gap-4 md:grid-cols-2">{fields.map(([key, label, type]) => <label key={key} className="text-xs font-semibold">{label}<input className={inputClass} type={type} value={settings[key] == null ? "" : String(settings[key])} onChange={(event) => update(key, (type === "number" ? (event.target.value === "" ? null : Number(event.target.value)) : event.target.value) as never)} />{fieldErrors[key]?.[0] && <span className="text-red-600">{fieldErrors[key][0]}</span>}</label>)}</div>
    <div className="flex flex-wrap gap-4">{(["defaultGenerateImage", "humanReviewRequired", "autoScheduleEnabled"] as const).map((key) => <label key={key} className="text-xs font-semibold"><input type="checkbox" checked={Boolean(settings[key])} onChange={(event) => update(key, event.target.checked)} /> {key.replace(/([A-Z])/g, " $1")}</label>)}</div>
    <div className="flex gap-3"><button onClick={save} disabled={saving || !dirty} className="inline-flex items-center gap-2 rounded-full bg-[var(--admin-accent)] px-5 py-2 text-xs font-bold text-white disabled:opacity-40"><Save size={14} />{saving ? "Saving..." : "Save AI Settings"}</button><button onClick={() => action("/api/admin/settings/ai-content/test", "OpenAI connection verified.")} disabled={testing} className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-xs font-bold"><Zap size={14} />{testing ? "Testing..." : "Test Connection"}</button></div>
    <SettingsStatusFooter isDirty={dirty} saving={saving} lastSavedAt={lastSavedAt} updatedBy={null} publicRevalidated={Boolean(lastSavedAt)} error={error} />
  </div>;
}

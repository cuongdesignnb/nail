"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Bot, CalendarClock, Play, RefreshCw, RotateCcw, Sparkles, XCircle } from "lucide-react";

type Dashboard = {
  settings: any;
  categories: any[];
  batches: any[];
  jobs: any[];
  usage: any;
};

const inputClass = "w-full rounded-xl border border-[var(--admin-border-strong)] bg-white px-3 py-2.5 text-xs text-[var(--admin-ink)] focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20";
const buttonClass = "rounded-full px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5 transition disabled:opacity-40";

export function AiContentStudio() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [keywords, setKeywords] = useState("");
  const [preview, setPreview] = useState<any | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [generationMode, setGenerationMode] = useState<"draft" | "schedule">("draft");
  const [scheduleStartAt, setScheduleStartAt] = useState("");
  const [scheduleIntervalHours, setScheduleIntervalHours] = useState(24);
  const [generateImages, setGenerateImages] = useState(true);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/ai-content/batches");
    const json = await res.json();
    if (json.success) setDashboard(json.data);
    else setMessage(json.error || "Unable to load AI Content Studio.");
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      if (!keywords.trim()) {
        setPreview(null);
        return;
      }
      const res = await fetch(`/api/admin/ai-content/batches?preview=${encodeURIComponent(keywords)}`);
      const json = await res.json();
      if (json.success) setPreview(json.data);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [keywords]);

  const rows = useMemo(() => preview?.rows ?? [], [preview]);

  async function createBatch() {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/ai-content/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawKeywordInput: keywords,
          categoryId: categoryId || null,
          generationMode,
          scheduleStartAt: generationMode === "schedule" && scheduleStartAt ? new Date(scheduleStartAt).toISOString() : null,
          scheduleIntervalHours,
          generateImages,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Batch creation failed.");
      setKeywords("");
      setPreview(null);
      setMessage(`Created ${json.data.jobs?.length || 0} AI content job(s).`);
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Batch creation failed.");
    } finally {
      setBusy(false);
    }
  }

  async function jobAction(id: string, action: "run" | "retry" | "cancel") {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/ai-content/jobs/${id}/${action}`, { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Job action failed.");
      setMessage(`Job ${action} completed.`);
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Job action failed.");
    } finally {
      setBusy(false);
    }
  }

  if (!dashboard) return <div className="p-6 text-xs text-[var(--admin-muted)]">Loading AI Content Studio...</div>;

  const configured = dashboard.settings?.isEnabled && dashboard.settings?.apiKeyConfigured;

  return (
    <div className="space-y-6">
      {message && <div className="rounded-xl border border-[var(--admin-border)]/40 bg-[var(--admin-surface-muted)] px-4 py-3 text-xs text-[var(--admin-ink)]">{message}</div>}
      {!configured && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          AI Content Studio is not enabled or API key is missing. Configure it in Settings &gt; AI Content before generating.
        </div>
      )}

      <section className="rounded-2xl border border-[var(--admin-border)]/35 bg-white p-5 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-base text-[var(--admin-ink)] flex items-center gap-2"><Sparkles size={18} className="text-[var(--admin-accent)]" /> Keyword Batch</h2>
            <p className="mt-1 text-xs text-[var(--admin-muted)]">Paste keywords line by line or comma separated. Duplicates are detected before queueing.</p>
          </div>
          <button type="button" onClick={load} className={`${buttonClass} border border-[var(--admin-border)] text-[var(--admin-ink)]`}><RefreshCw size={14} /> Refresh</button>
        </div>

        <textarea value={keywords} onChange={(e) => setKeywords(e.target.value)} rows={7} className={`${inputClass} resize-y`} placeholder={"gel nail aftercare\nsummer chrome nails\nbridal manicure ideas"} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputClass}>
            <option value="">No category</option>
            {dashboard.categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          <select value={generationMode} onChange={(e) => setGenerationMode(e.target.value as "draft" | "schedule")} className={inputClass}>
            <option value="draft">Draft queue</option>
            <option value="schedule">Schedule when approved</option>
          </select>
          <label className="flex items-center gap-2 rounded-xl border border-[var(--admin-border)]/50 px-3 py-2 text-xs font-semibold text-[var(--admin-ink)]">
            <input type="checkbox" checked={generateImages} onChange={(e) => setGenerateImages(e.target.checked)} />
            Generate cover images
          </label>
          <button type="button" onClick={createBatch} disabled={busy || !configured || rows.length === 0} className={`${buttonClass} justify-center bg-[var(--admin-accent)] text-white`}><Play size={14} /> Create Batch</button>
        </div>

        {generationMode === "schedule" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--admin-ink)] flex items-center gap-1"><CalendarClock size={13} /> Start Time</label>
              <input type="datetime-local" value={scheduleStartAt} onChange={(e) => setScheduleStartAt(e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--admin-ink)]">Interval Hours</label>
              <input type="number" value={scheduleIntervalHours} onChange={(e) => setScheduleIntervalHours(Number(e.target.value))} className={inputClass} />
            </div>
          </div>
        )}

        {preview && (
          <div className="rounded-xl border border-[var(--admin-border)] overflow-hidden">
            <div className="grid grid-cols-12 bg-[var(--admin-surface-muted)] px-3 py-2 text-[10px] font-bold uppercase text-[var(--admin-muted)]">
              <span className="col-span-5">Keyword</span><span className="col-span-3">Slug</span><span className="col-span-4">Duplicate Check</span>
            </div>
            {rows.map((row: any) => (
              <div key={row.normalizedKeyword} className="grid grid-cols-12 px-3 py-2 border-t border-[var(--admin-border)]/20 text-xs">
                <span className="col-span-5 text-[var(--admin-ink)]">{row.keyword}</span>
                <span className="col-span-3 text-[var(--admin-muted)]">{row.slug}</span>
                <span className={row.existingPost || row.pendingJob ? "col-span-4 text-amber-700" : "col-span-4 text-emerald-700"}>
                  {row.existingPost ? `Existing: ${row.existingPost.title}` : row.pendingJob ? `Queued: ${row.pendingJob.status}` : "Clear"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Metric label="Jobs this month" value={dashboard.usage.jobsThisMonth} />
        <Metric label="Articles" value={dashboard.usage.articlesGenerated} />
        <Metric label="Images" value={dashboard.usage.imagesGenerated} />
        <Metric label="Failed" value={dashboard.usage.failedJobs} />
        <Metric label="Batches" value={dashboard.batches.length} />
      </section>

      <section className="rounded-2xl border border-[var(--admin-border)]/35 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--admin-border)]">
          <h2 className="font-heading text-base text-[var(--admin-ink)] flex items-center gap-2"><Bot size={18} className="text-[var(--admin-accent)]" /> Queue</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[var(--admin-surface-muted)] text-[var(--admin-muted)] uppercase text-[10px]">
              <tr><th className="text-left px-4 py-3">Keyword</th><th className="text-left px-4 py-3">Status</th><th className="text-left px-4 py-3">Model</th><th className="text-left px-4 py-3">Post</th><th className="text-right px-4 py-3">Actions</th></tr>
            </thead>
            <tbody>
              {dashboard.jobs.map((job) => (
                <tr key={job.id} className="border-t border-[var(--admin-border)]/20">
                  <td className="px-4 py-3 font-semibold text-[var(--admin-ink)]">{job.keyword}<div className="text-[10px] font-normal text-[var(--admin-muted)]">{job.errorMessage}</div></td>
                  <td className="px-4 py-3"><span className="rounded-full bg-[var(--admin-surface-muted)] px-2 py-1 text-[10px] font-bold text-[var(--admin-ink)]">{job.status}</span></td>
                  <td className="px-4 py-3 text-[var(--admin-muted)]">{job.textModel}</td>
                  <td className="px-4 py-3 text-[var(--admin-muted)]">{job.blogPostId ? "Created" : "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => jobAction(job.id, "run")} disabled={busy} className="text-[var(--admin-accent)]"><Play size={14} /></button>
                      <button type="button" onClick={() => jobAction(job.id, "retry")} disabled={busy} className="text-indigo-600"><RotateCcw size={14} /></button>
                      <button type="button" onClick={() => jobAction(job.id, "cancel")} disabled={busy} className="text-rose-600"><XCircle size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {dashboard.jobs.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-[var(--admin-muted)]">No AI jobs yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[var(--admin-border)]/35 bg-white p-4">
      <div className="text-[10px] uppercase tracking-wide text-[var(--admin-muted)] font-bold">{label}</div>
      <div className="mt-1 text-xl font-bold text-[var(--admin-ink)]">{value ?? 0}</div>
    </div>
  );
}

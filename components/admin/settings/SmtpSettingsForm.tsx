"use client";

import { useEffect, useState } from "react";
import { Activity, ExternalLink, Save, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/admin/ui/AdminToastProvider";
import type { PublicSmtpSettings } from "@/lib/email/mail.types";
import SmtpHealthCard from "./SmtpHealthCard";
import SmtpTestEmailCard from "./SmtpTestEmailCard";
import TransactionalEmailLogTable from "./TransactionalEmailLogTable";

type EmailLog = { id: string; kind: string; status: string; recipient: string; subject: string; attempts: number; lastError: string | null; createdAt: string };

const inputClass = "mt-1.5 h-10 w-full rounded-[var(--admin-radius-md)] border border-[var(--admin-border)] bg-white px-3 text-sm outline-none focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)]/15";

export default function SmtpSettingsForm() {
  const toast = useToast();
  const [settings, setSettings] = useState<PublicSmtpSettings | null>(null);
  const [password, setPassword] = useState("");
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [checkingNetwork, setCheckingNetwork] = useState(false);

  async function load() {
    const [settingsRes, logsRes] = await Promise.all([
      fetch("/api/admin/settings/email"),
      fetch("/api/admin/email-deliveries"),
    ]);
    const settingsJson = await settingsRes.json();
    const logsJson = await logsRes.json();
    if (settingsJson.success) setSettings(settingsJson.data);
    if (logsJson.success) setLogs(logsJson.data);
  }

  useEffect(() => { load(); }, []);

  function update<K extends keyof PublicSmtpSettings>(key: K, value: PublicSmtpSettings[K]) {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  }

  function draftPayload() {
    if (!settings) return null;
    return {
      enabled: settings.enabled,
      host: settings.host || "",
      port: settings.port || 587,
      secure: settings.encryptionMode === "TLS",
      encryptionMode: settings.encryptionMode || (settings.secure ? "TLS" : "STARTTLS"),
      username: settings.username || "",
      password,
      fromName: settings.fromName || "",
      fromEmail: settings.fromEmail || "",
      replyToEmail: settings.replyToEmail || "",
    };
  }

  async function save() {
    if (!settings) return;
    setSaving(true);
    const response = await fetch("/api/admin/settings/email", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draftPayload()),
    });
    const json = await response.json();
    setSaving(false);
    if (json.success) {
      setSettings(json.data);
      setPassword("");
      toast.success("SMTP settings saved. Test the connection to activate email delivery.");
    } else {
      toast.error("Unable to save SMTP settings.", json.detail || json.error);
    }
  }

  async function testConnection() {
    const payload = draftPayload();
    if (!payload || testing) return;
    setTesting(true);
    const response = await fetch("/api/admin/settings/email/test-connection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    setTesting(false);
    if (json.success) {
      setSettings(json.data);
      setPassword("");
      toast.success("SMTP connection verified successfully.");
    } else {
      await load();
      toast.error("Unable to connect to SMTP.", json.detail || json.error);
    }
  }

  async function networkCheck() {
    const payload = draftPayload();
    if (!payload || checkingNetwork) return;
    setCheckingNetwork(true);
    const response = await fetch("/api/admin/settings/email/network-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ host: payload.host, port: payload.port }),
    });
    const json = await response.json();
    setCheckingNetwork(false);
    if (json.success) {
      toast.success("Server connectivity is reachable.");
    } else {
      toast.error("Server connectivity check failed.", json.detail || json.error);
    }
  }

  async function retry(id: string) {
    const response = await fetch(`/api/admin/email-deliveries/${id}/retry`, { method: "POST" });
    const json = await response.json();
    json.success ? toast.success("Email retry queued.") : toast.error("Unable to retry email.", json.error);
    load();
  }

  if (!settings) return <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-6 text-sm text-[var(--admin-muted)]">Loading email settings...</div>;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">
        <section className="rounded-2xl border border-[var(--admin-border)] bg-white p-5">
          <h2 className="text-sm font-bold text-[var(--admin-ink)]">SMTP Connection</h2>
          <label className="mt-4 flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={settings.enabled} onChange={(event) => update("enabled", event.target.checked)} /> Enable Transactional Email</label>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="SMTP Host" value={settings.host || ""} onChange={(value) => update("host", value)} />
            <Field label="SMTP Port" type="number" value={String(settings.port || 587)} onChange={(value) => update("port", Number(value))} />
            <label className="text-sm font-semibold text-[var(--admin-ink)]">Encryption Mode<select className={inputClass} value={settings.encryptionMode || (settings.secure ? "TLS" : "STARTTLS")} onChange={(event) => {
              const value = event.target.value as PublicSmtpSettings["encryptionMode"];
              setSettings({ ...settings, encryptionMode: value, secure: value === "TLS" });
            }}><option value="STARTTLS">STARTTLS - Recommended for port 587</option><option value="TLS">SSL/TLS - Recommended for port 465</option><option value="NONE">None - Local development only</option></select></label>
            <Field label="SMTP Username" value={settings.username || ""} onChange={(value) => update("username", value)} />
            <Field label="SMTP Password" type="password" value={password} onChange={setPassword} placeholder={settings.hasPassword ? "Leave blank to keep current password" : "SMTP password"} helperText={settings.hasPassword ? "A password is securely stored. Leave this field blank to keep it, or enter a new App Password to replace it." : "Enter your SMTP App Password. For Gmail, use a Google App Password."} />
          </div>
          <div className="mt-4 rounded-[var(--admin-radius-md)] border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-4 text-sm text-[var(--admin-ink)]">
            <p className="font-semibold">Gmail Setup</p>
            <p className="mt-2 text-xs text-[var(--admin-muted)]">Host: smtp.gmail.com | Port: 587 | Encryption: STARTTLS | Username: your full Gmail address | Password: Google App Password</p>
            <a className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--admin-accent)]" href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noreferrer">How to create a Google App Password <ExternalLink size={13} /></a>
          </div>
        </section>
        <section className="rounded-2xl border border-[var(--admin-border)] bg-white p-5">
          <h2 className="text-sm font-bold text-[var(--admin-ink)]">Sender Identity</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Field label="From Name" value={settings.fromName || ""} onChange={(value) => update("fromName", value)} placeholder="Aera Nail Lounge" />
            <Field label="From Email" type="email" value={settings.fromEmail || ""} onChange={(value) => update("fromEmail", value)} placeholder="hello@aeranailounge.com" />
            <Field label="Reply-To Email" type="email" value={settings.replyToEmail || ""} onChange={(value) => update("replyToEmail", value)} />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={save} disabled={saving || testing || checkingNetwork} className="inline-flex h-10 items-center gap-2 rounded-[var(--admin-radius-md)] bg-[var(--admin-accent)] px-4 text-sm font-semibold text-white disabled:opacity-50"><Save size={15} /> {saving ? "Saving..." : "Save SMTP Settings"}</button>
            <button type="button" onClick={testConnection} disabled={saving || testing || checkingNetwork} className="inline-flex h-10 items-center gap-2 rounded-[var(--admin-radius-md)] border border-[var(--admin-border)] bg-white px-4 text-sm font-semibold disabled:opacity-50"><ShieldCheck size={15} /> {testing ? "Testing Connection..." : "Test Connection"}</button>
            <button type="button" onClick={networkCheck} disabled={saving || testing || checkingNetwork} className="inline-flex h-10 items-center gap-2 rounded-[var(--admin-radius-md)] border border-[var(--admin-border)] bg-white px-4 text-sm font-semibold disabled:opacity-50"><Activity size={15} /> {checkingNetwork ? "Checking..." : "Check Server Connectivity"}</button>
          </div>
        </section>
        <TransactionalEmailLogTable logs={logs} onRetry={retry} />
      </div>
      <aside className="space-y-5">
        <SmtpHealthCard settings={settings} />
        <SmtpTestEmailCard disabled={!settings.enabled || !settings.verifiedAt} onSent={(message, type) => type === "success" ? toast.success(message) : toast.error(message)} />
      </aside>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, helperText }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; helperText?: string }) {
  return <label className="text-sm font-semibold text-[var(--admin-ink)]">{label}<input className={inputClass} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />{helperText && <span className="mt-1.5 block text-xs font-normal leading-5 text-[var(--admin-muted)]">{helperText}</span>}</label>;
}

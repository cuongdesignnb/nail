"use client";

type EmailLog = {
  id: string;
  kind: string;
  status: string;
  recipient: string;
  subject: string;
  attempts: number;
  lastError: string | null;
  createdAt: string;
};

export default function TransactionalEmailLogTable({ logs, onRetry }: { logs: EmailLog[]; onRetry: (id: string) => void }) {
  return (
    <section className="rounded-2xl border border-[var(--admin-border)] bg-white p-5">
      <h2 className="text-sm font-bold text-[var(--admin-ink)]">Recent Delivery Activity</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-[var(--admin-muted)]">
            <tr><th className="py-2">Kind</th><th>Recipient</th><th>Status</th><th>Attempts</th><th>Created</th><th></th></tr>
          </thead>
          <tbody className="divide-y divide-[var(--admin-border)]">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="py-3 font-semibold">{log.kind.replace(/_/g, " ")}</td>
                <td>{log.recipient}</td>
                <td>{log.status}</td>
                <td>{log.attempts}</td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
                <td>{log.status === "FAILED" && <button className="text-xs font-bold text-[var(--admin-accent)]" type="button" onClick={() => onRetry(log.id)}>Retry</button>}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td className="py-6 text-center text-[var(--admin-muted)]" colSpan={6}>No delivery activity yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

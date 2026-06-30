import type { ReactNode } from "react";

export function AdminTablePage({ title, copy, headers, rows, actions }: { title: string; copy: string; headers: string[]; rows: ReactNode[][]; actions?: ReactNode }) {
  return (
    <div className="admin-page">
      <section className="admin-section-heading">
        <div>
          <h1>{title}</h1>
          <p>{copy}</p>
        </div>
        {actions}
      </section>
      <article className="admin-card wide">
        <div className="table-tools">
          <input placeholder={`Search ${title.toLowerCase()}...`} />
          <select><option>All Status</option><option>Active</option><option>Pending</option></select>
          <button>Export</button>
        </div>
        <table>
          <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
          <tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </article>
    </div>
  );
}

const locationGuidance: Record<string, { title: string; body: string; fields: string[] }> = {
  header_primary: {
    title: "Header menu rules",
    body: "Header menus support internal, external, anchor, mailto, tel and none link types with up to 3 levels.",
    fields: ["Label", "Internal Route Suggestion", "External Link", "Enable/Disable", "Open New Tab", "Nested Children", "Drag and Drop Sorting"],
  },
  header_mobile: {
    title: "Mobile menu rules",
    body: "Mobile can inherit Primary Header by settings, or use this custom menu when custom mode is enabled.",
    fields: ["Label", "Internal Route Suggestion", "External Link", "Enable/Disable", "Open New Tab", "Nested Children"],
  },
  footer_company: {
    title: "Footer Company rules",
    body: "Footer company links support internal, external, mailto and tel links with up to 2 levels.",
    fields: ["Label", "Internal Route Suggestion", "External Link", "Enable/Disable", "Open New Tab", "Nested Children"],
  },
  footer_services: {
    title: "Footer Services rules",
    body: "Footer services links support internal, external, mailto and tel links with up to 2 levels.",
    fields: ["Label", "Internal Route Suggestion", "External Link", "Enable/Disable", "Open New Tab", "Nested Children"],
  },
  footer_explore: {
    title: "Footer Explore rules",
    body: "Footer explore links support internal, external, mailto and tel links with up to 2 levels.",
    fields: ["Label", "Internal Route Suggestion", "External Link", "Enable/Disable", "Open New Tab", "Nested Children"],
  },
  footer_legal: {
    title: "Footer Legal rules",
    body: "Legal links must be flat and should point to valid policy routes. Child items and booking CTA styling are not allowed.",
    fields: ["Label", "Internal Route Suggestion", "External Link", "Enable/Disable", "Open New Tab"],
  },
  footer_social: {
    title: "Footer Social rules",
    body: "Social links must be external, mailto or tel, flat, safe, and external URLs always open in a new tab with rel security.",
    fields: ["Platform", "Link URL", "Icon Preview", "Enable/Disable", "Open New Tab"],
  },
};

export function MenuItemInspector({ location }: { location: string }) {
  const guidance = locationGuidance[location] || locationGuidance.header_primary;
  return (
    <div className="rounded-xl border border-aera-champagne/40 bg-aera-champagne/15 p-4">
      <h3 className="text-sm font-bold text-aera-ink">{guidance.title}</h3>
      <p className="mt-1 text-xs text-aera-muted">{guidance.body}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {guidance.fields.map((field) => (
          <span key={field} className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-aera-muted">
            {field}
          </span>
        ))}
      </div>
    </div>
  );
}

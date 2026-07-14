import type { z } from "zod";

export function zodFieldErrors(error: z.ZodError): Record<string, string[]> {
  const issues: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.length ? issue.path.join(".") : "_root";
    issues[path] ??= [];
    issues[path].push(issue.message);
  }

  return issues;
}

export function humanizeGlobalIssuePath(path: string): string {
  const exact: Record<string, string> = {
    "brand.logo.alt": "Branding logo alt text is missing or invalid.",
    "brand.favicon.alt": "Branding favicon alt text is missing or invalid.",
    "footer.contact.hours": "Footer opening hours are invalid.",
    "defaultContact.hours": "Default opening hours are invalid.",
    "defaultShareImage.alt": "Default share image alt text is missing or invalid.",
    "headerNav.items": "Header navigation is invalid.",
    businessHours: "Business hours are incomplete or invalid.",
  };
  if (exact[path]) return exact[path];
  if (/^businessHours\.\d+\.(startTime|endTime)$/.test(path)) {
    return `Opening time field ${path} is invalid.`;
  }
  return `${path} is incompatible with the current settings format.`;
}

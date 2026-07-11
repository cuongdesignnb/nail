"use client";

import { normalizeSettings } from "@/lib/settings/normalize-settings";

export async function verifyGalleryMutation(resource: string, saved: Record<string, unknown>, payload: Record<string, unknown>) {
  const id = saved.id;
  if (typeof id !== "string" || !id) throw new Error("Your changes could not be verified after saving.");
  const response = await fetch(`/api/admin/${resource}/${id}`, { cache: "no-store", headers: { "Cache-Control": "no-cache" } });
  const json = await response.json();
  if (!response.ok || !json.success) throw new Error("Your changes could not be verified after saving.");
  const record = normalizeSettings(json.data as Record<string, unknown>);
  const expected = normalizeSettings(payload);
  if (Object.entries(expected).some(([key, value]) => JSON.stringify(record[key]) !== JSON.stringify(value))) {
    throw new Error("Your changes could not be verified after saving.");
  }
  return record;
}

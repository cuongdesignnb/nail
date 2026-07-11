import { mapBusinessSettings } from "./settings.mapper";
import { getBusinessSettingsRecord, saveBusinessSettingsRecord } from "./settings.repository";
import { businessSettingsSchema } from "./settings.validation";

export async function getBusinessSettings() {
  const record = await getBusinessSettingsRecord();
  return { data: mapBusinessSettings(record), updatedAt: record.updatedAt.toISOString() };
}

export async function saveBusinessSettings(input: unknown) {
  const data = businessSettingsSchema.parse(input);
  const record = await saveBusinessSettingsRecord(data);
  return { data: mapBusinessSettings(record), updatedAt: record.updatedAt.toISOString() };
}


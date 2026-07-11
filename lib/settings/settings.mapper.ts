import type { BusinessSetting } from "@prisma/client";
import type { BusinessSettings } from "./settings.types";

export function mapBusinessSettings(record: BusinessSetting): BusinessSettings {
  return { timezone: record.timezone, currency: record.currency };
}


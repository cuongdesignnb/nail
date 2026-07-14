import { handleGlobalSettingsGet, handleGlobalSettingsPut } from "@/lib/settings/global-settings-route";
import { businessHoursSettingsSchema, buildBusinessHoursSummary } from "@/lib/settings/schemas/business-hours.schema";

export const dynamic = "force-dynamic";
export const GET = () => handleGlobalSettingsGet("business-hours");
export const PUT = (request: Request) => handleGlobalSettingsPut({
  request,
  section: "business-hours",
  schema: businessHoursSettingsSchema,
  mapPatch: (parsed) => {
    const value = parsed as { businessHours: Array<{ day: string; isOpen: boolean; startTime: string; endTime: string }> };
    return { businessHours: value.businessHours, summary: buildBusinessHoursSummary(value.businessHours as never) };
  },
});

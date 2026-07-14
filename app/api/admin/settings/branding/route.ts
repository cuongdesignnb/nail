import { handleGlobalSettingsGet, handleGlobalSettingsPut } from "@/lib/settings/global-settings-route";
import { brandingSettingsSchema } from "@/lib/settings/schemas/branding.schema";

export const dynamic = "force-dynamic";
export const GET = () => handleGlobalSettingsGet("branding");
export const PUT = (request: Request) => handleGlobalSettingsPut({ request, section: "branding", schema: brandingSettingsSchema });

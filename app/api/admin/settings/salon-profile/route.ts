import { handleGlobalSettingsGet, handleGlobalSettingsPut } from "@/lib/settings/global-settings-route";
import { salonProfileSchema } from "@/lib/settings/schemas/salon-profile.schema";

export const dynamic = "force-dynamic";
export const GET = () => handleGlobalSettingsGet("salon-profile");
export const PUT = (request: Request) => handleGlobalSettingsPut({ request, section: "salon-profile", schema: salonProfileSchema });

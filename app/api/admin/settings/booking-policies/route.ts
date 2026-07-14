import { handleGlobalSettingsGet, handleGlobalSettingsPut } from "@/lib/settings/global-settings-route";
import { bookingPoliciesSettingsSchema } from "@/lib/settings/schemas/booking-policies.schema";

export const dynamic = "force-dynamic";
export const GET = () => handleGlobalSettingsGet("booking-policies");
export const PUT = (request: Request) => handleGlobalSettingsPut({ request, section: "booking-policies", schema: bookingPoliciesSettingsSchema });

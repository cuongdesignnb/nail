import { z } from "zod";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";
import {
  getOrCreatePayPalConfig,
  serializePayPalConfig,
  updatePayPalConfig,
} from "@/lib/payments/paypal/paypal.config";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const schema = z.object({
  isEnabled: z.boolean().optional(),
  environment: z.enum(["sandbox", "live"]).optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  webhookId: z.string().optional(),
  currency: z.string().min(3).max(3).optional(),
  chargeMode: z.enum(["deposit", "full"]).optional(),
  depositPercentage: z.coerce.number().min(1).max(100).optional(),
  bookingHoldMinutes: z.coerce.number().int().min(5).max(120).optional(),
  autoConfirmAfterPayment: z.boolean().optional(),
});

export async function GET() {
  try {
    requireAdmin();
    const config = await getOrCreatePayPalConfig();
    return Response.json({ success: true, data: serializePayPalConfig(config) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    return Response.json({ success: false, error: "Failed to load PayPal settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = requireRole(["Owner"]);
    const data = schema.parse(await req.json());
    const config = await updatePayPalConfig(data);
    await prisma.auditLog.create({
      data: {
        actor: session.email,
        action: "PAYPAL_CONFIG_UPDATED",
        entity: "PaymentGatewayConfig:paypal",
        entityType: "PaymentGatewayConfig",
        details: { environment: config.environment, isEnabled: config.isEnabled, chargeMode: config.chargeMode },
      },
    }).catch(() => undefined);
    return Response.json({ success: true, data: serializePayPalConfig(config) });
  } catch (error) {
    const role = roleErrorResponse(error);
    if (role) return role;
    const auth = authErrorResponse(error);
    if (auth) return auth;
    if (error instanceof z.ZodError) {
      return Response.json({ success: false, error: "Validation failed", issues: error.issues }, { status: 400 });
    }
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Failed to save PayPal settings" }, { status: 400 });
  }
}

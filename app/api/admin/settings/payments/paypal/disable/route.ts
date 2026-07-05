import { prisma } from "@/lib/db";
import { authErrorResponse } from "@/lib/auth/require-admin";
import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";
import { removePayPalSecret, serializePayPalConfig } from "@/lib/payments/paypal/paypal.config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  try {
    const session = requireRole(["Owner"]);
    const config = await removePayPalSecret();
    await prisma.auditLog.create({
      data: {
        actor: session.email,
        action: "PAYPAL_CONFIG_UPDATED",
        entity: "PaymentGatewayConfig:paypal",
        entityType: "PaymentGatewayConfig",
        details: { disabled: true, secretRemoved: true },
      },
    }).catch(() => undefined);
    return Response.json({ success: true, data: serializePayPalConfig(config) });
  } catch (error) {
    const role = roleErrorResponse(error);
    if (role) return role;
    const auth = authErrorResponse(error);
    if (auth) return auth;
    return Response.json({ success: false, error: "Failed to disable PayPal" }, { status: 500 });
  }
}

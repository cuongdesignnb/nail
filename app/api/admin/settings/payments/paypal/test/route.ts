import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";
import { authErrorResponse } from "@/lib/auth/require-admin";
import { getPayPalAccessToken } from "@/lib/payments/paypal/paypal.client";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  try {
    const session = requireRole(["Owner"]);
    await getPayPalAccessToken();
    await prisma.auditLog.create({
      data: {
        actor: session.email,
        action: "PAYPAL_CONNECTION_TESTED",
        entity: "PaymentGatewayConfig:paypal",
        entityType: "PaymentGatewayConfig",
        details: { ok: true },
      },
    }).catch(() => undefined);
    return Response.json({ success: true, data: { ok: true } });
  } catch (error) {
    const role = roleErrorResponse(error);
    if (role) return role;
    const auth = authErrorResponse(error);
    if (auth) return auth;
    return Response.json({ success: false, error: error instanceof Error ? error.message : "PayPal connection failed" }, { status: 400 });
  }
}

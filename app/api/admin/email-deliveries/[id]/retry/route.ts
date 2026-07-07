export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { authErrorResponse } from "@/lib/auth/require-admin";
import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";
import { attemptTransactionalEmail } from "@/lib/email/mail.service";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    requireRole(["Owner"]);
    const data = await attemptTransactionalEmail(params.id);
    return Response.json({ success: true, data });
  } catch (error) {
    return roleErrorResponse(error) || authErrorResponse(error) || Response.json({ success: false, error: error instanceof Error ? error.message : "Unable to retry email." }, { status: 400 });
  }
}

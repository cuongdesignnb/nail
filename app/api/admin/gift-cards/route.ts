export const dynamic = "force-dynamic";

import { authErrorResponse, requireAdmin } from "@/lib/auth/require-admin";
import { createManualGiftCard, listAdminGiftCards } from "@/lib/gift-cards/gift-card.service";
import { createManualGiftCardSchema } from "@/lib/gift-cards/gift-card-validation";

export async function GET(req: Request) {
  try {
    requireAdmin();
    const url = new URL(req.url);
    const data = await listAdminGiftCards({
      search: url.searchParams.get("search") || undefined,
      type: url.searchParams.get("type") || undefined,
      status: url.searchParams.get("status") || undefined,
      emailStatus: url.searchParams.get("emailStatus") || undefined,
      from: url.searchParams.get("from") || undefined,
      to: url.searchParams.get("to") || undefined,
    });
    return Response.json({ success: true, data });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    return Response.json({ success: false, error: "Unable to load Gift Cards." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = requireAdmin();
    const parsed = createManualGiftCardSchema.safeParse(await req.json());
    if (!parsed.success) {
      return Response.json(
        { success: false, error: "Validation failed.", fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 422 },
      );
    }

    const giftCard = await createManualGiftCard({
      ...parsed.data,
      performedByUserId: admin.email,
    });

    return Response.json({
      success: true,
      giftCard: {
        id: giftCard.id,
        codeSuffix: giftCard.codeSuffix,
        status: giftCard.status,
        emailStatus: giftCard.emailStatus,
      },
    });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : "Unable to issue Gift Card." },
      { status: 400 },
    );
  }
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  await req.body?.cancel().catch(() => undefined);
  return Response.json(
    { success: false, error: "Online booking payments are disabled. Payment is collected at the salon after your appointment." },
    { status: 410 }
  );
}

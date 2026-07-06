export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  return Response.json(
    { success: false, error: "Online booking payments are disabled. Payment is collected at the salon after your appointment." },
    { status: 410 }
  );
}

export const dynamic = "force-dynamic";

export async function POST() {
  return Response.json(
    {
      success: false,
      error: "Direct booking creation is disabled. Please use secure PayPal checkout.",
    },
    { status: 410 }
  );
}

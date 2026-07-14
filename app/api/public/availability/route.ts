export async function GET() {
  return Response.json(
    {
      success: false,
      error: "This legacy fixture-backed availability endpoint is retired. Use /api/public/booking/availability.",
    },
    { status: 410 },
  );
}

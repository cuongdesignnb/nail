import { runAiContentJobs } from "@/lib/ai/ai-content-runner";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function authorized(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(req: Request) {
  if (!authorized(req)) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const results = await runAiContentJobs(Number(process.env.AI_CONTENT_JOB_LIMIT || 1));
  return Response.json({ success: true, data: { processed: results.length } });
}

export const GET = POST;

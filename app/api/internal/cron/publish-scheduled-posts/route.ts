import { publishDueScheduledBlogPosts } from "@/lib/ai/ai-content-scheduler";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function authorized(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(req: Request) {
  if (!authorized(req)) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const published = await publishDueScheduledBlogPosts();
  return Response.json({ success: true, data: { published: published.length } });
}

export const GET = POST;

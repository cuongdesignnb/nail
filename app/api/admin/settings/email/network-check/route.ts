export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import dns from "dns/promises";
import net from "net";
import { z } from "zod";
import { authErrorResponse } from "@/lib/auth/require-admin";
import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";

const schema = z.object({
  host: z.string().trim().min(1).max(255),
  port: z.coerce.number().int().min(1).max(65535),
});

function normalizeHost(raw: string) {
  return raw.trim().replace(/^(smtp|smtps|https?):\/\//i, "").replace(/\/.*$/, "").replace(/:\d+$/, "");
}

function checkTcp(host: string, port: number) {
  return new Promise<"reachable" | "blocked">((resolve) => {
    const socket = net.createConnection({ host, port, timeout: 8000 });
    socket.once("connect", () => {
      socket.destroy();
      resolve("reachable");
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve("blocked");
    });
    socket.once("error", () => resolve("blocked"));
  });
}

export async function POST(req: Request) {
  try {
    requireRole(["Owner"]);
    const input = schema.parse(await req.json());
    const host = normalizeHost(input.host);
    let dnsStatus: "reachable" | "blocked" = "reachable";
    try {
      await dns.lookup(host);
    } catch {
      dnsStatus = "blocked";
    }
    const tcp = dnsStatus === "reachable" ? await checkTcp(host, input.port) : "blocked";
    const success = dnsStatus === "reachable" && tcp === "reachable";
    return Response.json({
      success,
      dns: dnsStatus,
      tcp,
      host,
      port: input.port,
      detail: success ? undefined : `The server cannot reach ${host} on port ${input.port}. Check firewall or provider outbound SMTP restrictions.`,
    }, { status: success ? 200 : 400 });
  } catch (error) {
    return roleErrorResponse(error) || authErrorResponse(error) || Response.json({
      success: false,
      error: "Unable to check SMTP network connectivity.",
      detail: error instanceof Error ? error.message : undefined,
    }, { status: 400 });
  }
}

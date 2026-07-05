import { runAiContentJobs } from "@/lib/ai/ai-content-runner";

async function main() {
  const limit = Number(process.env.AI_CONTENT_JOB_LIMIT || process.argv[2] || 1);
  const results = await runAiContentJobs(Number.isFinite(limit) && limit > 0 ? limit : 1);
  console.log(`AI content worker completed ${results.length} job(s).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

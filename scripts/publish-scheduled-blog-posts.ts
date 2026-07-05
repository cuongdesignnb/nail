import { publishDueScheduledBlogPosts } from "@/lib/ai/ai-content-scheduler";

async function main() {
  const published = await publishDueScheduledBlogPosts();
  console.log(`Published ${published.length} scheduled blog post(s).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

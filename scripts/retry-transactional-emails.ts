import { retryDueTransactionalEmails } from "@/lib/email/mail-queue.service";

async function main() {
  const result = await retryDueTransactionalEmails();
  console.log(`Retried transactional emails: ${result.attempted}`);
}

main().catch((error) => {
  console.error("Transactional email retry failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});

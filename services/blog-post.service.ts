import { notFound } from "next/navigation";

export async function fetchBlogPostBySlug(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/public/blog-posts/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) notFound();

  const json = await res.json();

  if (!json?.data?.post) notFound();

  return json.data;
}

import Link from "next/link";
import { Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Nitish Deshmukh",
  description: "Writing about web development, open source, and building products.",
};

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  readingTime: number | null;
  tags: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

async function getPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_URL}/api/blog`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Note: Client-side tag filtering will be added as a progressive enhancement later
// if we move it to a client component. For now, it's a fast RSC.
export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-16 pb-24">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">
          Blog
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Thoughts on web development, open source, and side projects.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group block rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm p-5 transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm"
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </h2>

              <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                {post.publishedAt && (
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>
                )}
                {post.readingTime && (
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readingTime} min read
                  </span>
                )}
              </div>

              {post.excerpt && (
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mt-2 line-clamp-2">
                  {post.excerpt}
                </p>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            No posts found.
          </div>
        )}
      </div>
    </div>
  );
}

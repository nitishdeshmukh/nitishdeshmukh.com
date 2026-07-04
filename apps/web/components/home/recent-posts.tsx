import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  readingTime: number | null;
  tags: string[];
}

interface RecentPostsProps {
  posts: BlogPost[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function RecentPosts({ posts }: RecentPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
          Recent Posts
        </h2>
        <Link
          href="/blog"
          className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          All posts
          <ArrowUpRight size={12} />
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex items-start justify-between gap-4 py-3 hover:opacity-80 transition-opacity"
          >
            <div className="min-w-0">
              <p className="text-sm text-neutral-900 dark:text-white group-hover:underline underline-offset-2 truncate">
                {post.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {post.publishedAt && (
                  <span className="text-xs text-neutral-400">
                    {formatDate(post.publishedAt)}
                  </span>
                )}
                {post.readingTime && (
                  <span className="flex items-center gap-1 text-xs text-neutral-400">
                    <Clock size={10} />
                    {post.readingTime} min
                  </span>
                )}
              </div>
            </div>
            <ArrowUpRight
              size={14}
              className="flex-shrink-0 mt-0.5 text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

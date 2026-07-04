import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { mdxComponents } from "@/components/blog/mdx-components";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ArrowLeft, ExternalLink, Code, Calendar } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

async function getProject(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/projects/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Not Found" };

  return {
    title: `${project.title} | Nitish Deshmukh`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "website",
      url: `https://nitishdeshmukh.com/projects/${project.slug}`,
      images: project.coverUrl ? [{ url: project.coverUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.coverUrl ? [project.coverUrl] : [],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-24 flex gap-8">
      {/* Main Content */}
      <article className="flex-1 min-w-0">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to projects
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
            {project.title}
          </h1>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                <ExternalLink size={16} />
                Live Demo
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-neutral-900 dark:text-white font-medium text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Code size={16} />
                Source Code
              </a>
            )}
          </div>
        </header>

        {project.coverUrl && (
          <div className="mb-10 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.coverUrl} alt={project.title} className="w-full object-cover" />
          </div>
        )}

        {project.contentMdx ? (
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <MDXRemote
              source={project.contentMdx}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    rehypeSlug,
                    [
                      rehypePrettyCode,
                      {
                        theme: {
                          dark: "github-dark",
                          light: "github-light",
                        },
                        keepBackground: false,
                      },
                    ],
                  ],
                },
              }}
            />
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500 italic border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
            More details coming soon.
          </div>
        )}
      </article>

      {/* Sidebar (TOC & Metadata) */}
      <aside className="hidden lg:flex flex-col gap-8 w-64 flex-shrink-0">
        {project.tags && project.tags.length > 0 && (
          <div className="sticky top-24">
            <h4 className="font-semibold text-sm text-neutral-900 dark:text-white mb-3">
              Technologies
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {project.publishedAt && (
              <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
                <h4 className="font-semibold text-sm text-neutral-900 dark:text-white mb-3">
                  Published
                </h4>
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Calendar size={14} />
                  {new Date(project.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            )}
            
            {project.contentMdx && (
              <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
                <TableOfContents />
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}

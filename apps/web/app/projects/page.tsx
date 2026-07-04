import Link from "next/link";
import { ExternalLink, Code } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Nitish Deshmukh",
  description: "A showcase of my open-source projects, web applications, and tools.",
};

interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  coverUrl: string | null;
  demoUrl: string | null;
  repoUrl: string | null;
  tags: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_URL}/api/projects`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ProjectsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const allProjects = await getProjects();
  
  // URL-based tag filtering
  const activeTag = tag;
  const projects = activeTag
    ? allProjects.filter((p) => p.tags.includes(activeTag))
    : allProjects;

  // Extract all unique tags for the filter bar
  const allTags = Array.from(new Set(allProjects.flatMap((p) => p.tags))).sort();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-24">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">
          Projects
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          A collection of things I&apos;ve built, ranging from web applications to open-source libraries.
        </p>
      </div>

      {/* Tag Filter Bar */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/projects"
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !activeTag
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            }`}
          >
            All
          </Link>
          {allTags.map((tag) => (
            <Link
              key={tag}
              href={`/projects?tag=${encodeURIComponent(tag)}`}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTag === tag
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm overflow-hidden hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300"
          >
            {project.coverUrl ? (
              <Link href={`/projects/${project.slug}`} className="block h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.coverUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
            ) : (
              <Link href={`/projects/${project.slug}`} className="block h-48 bg-neutral-100 dark:bg-neutral-800 transition-colors group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700" />
            )}

            <div className="flex flex-col flex-1 p-6">
              <Link href={`/projects/${project.slug}`} className="block mb-3">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h2>
              </Link>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6 flex-1 line-clamp-3">
                {project.description}
              </p>

              <div className="mt-auto flex flex-col gap-4">
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:text-neutral-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800/60">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      <ExternalLink size={14} />
                      Live Demo
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      <Code size={14} />
                      Source
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full text-center py-12 text-neutral-500">
            No projects found matching the filter.
          </div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { ExternalLink, ArrowUpRight } from "lucide-react";

interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  coverUrl: string | null;
  demoUrl: string | null;
  repoUrl: string | null;
  tags: string[];
  featured: boolean;
}

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
          Featured Projects
        </h2>
        <Link
          href="/projects"
          className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          All projects
          <ArrowUpRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="group block rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm p-4 hover:-translate-y-0.5 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                {project.title}
              </h3>
              <div className="flex gap-1 flex-shrink-0">
                {project.repoUrl && (
                  <span
                    onClick={(e) => { e.preventDefault(); window.open(project.repoUrl!, "_blank"); }}
                    className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </span>
                )}
                {project.demoUrl && (
                  <span
                    onClick={(e) => { e.preventDefault(); window.open(project.demoUrl!, "_blank"); }}
                    className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors"
                  >
                    <ExternalLink size={13} />
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-3 line-clamp-2">
              {project.description}
            </p>

            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs text-neutral-600 dark:text-neutral-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

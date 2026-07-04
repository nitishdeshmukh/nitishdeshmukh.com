import { Hero } from "@/components/home/hero";
import { GithubGraph } from "@/components/home/github-graph";
import { TechStack } from "@/components/home/tech-stack";
import { ExperienceTimeline } from "@/components/home/experience-timeline";
import { EducationSection } from "@/components/home/education";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { RecentPosts } from "@/components/home/recent-posts";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

async function fetchJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
    });
    if (!res.ok) return fallback;
    return res.json();
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const [profile, stack, experience, education, projects, posts, githubData] =
    await Promise.all([
      fetchJson("/api/profile", {
        name: "Nitish Deshmukh",
        bio: "",
        profileImage: "",
        location: "India",
        roles: [],
        socialLinks: [],
      }),
      fetchJson("/api/stack", []),
      fetchJson("/api/experience", []),
      fetchJson("/api/education", []),
      fetchJson("/api/projects/featured", []),
      fetchJson("/api/blog/recent", []),
      fetchJson("/api/github/contributions", { contributions: [], total: { lastYear: 0 } }),
    ]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      {/* 1. Hero */}
      <Hero
        name={profile.name}
        bio={profile.bio}
        profileImage={profile.profileImage}
        location={profile.location}
        roles={profile.roles}
        socialLinks={profile.socialLinks}
      />

      {/* 2. GitHub Contributions */}
      <GithubGraph
        contributions={githubData.contributions ?? []}
        total={githubData.total?.lastYear ?? 0}
      />

      {/* 3. Tech Stack */}
      <TechStack stack={stack} />

      {/* 4. Experience */}
      <ExperienceTimeline experiences={experience} />

      {/* 5. Education */}
      <EducationSection education={education} />

      {/* 6. Featured Projects */}
      <FeaturedProjects projects={projects} />

      {/* 7. Recent Blog Posts */}
      <RecentPosts posts={posts} />

      {/* Bottom spacer for floating dock */}
      <div className="h-8" />
    </div>
  );
}

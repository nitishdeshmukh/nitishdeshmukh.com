import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
  const baseUrl = "https://nitishdeshmukh.com";

  let posts: any[] = [];
  let projects: any[] = [];

  try {
    const [postsRes, projectsRes] = await Promise.all([
      fetch(`${apiUrl}/api/blog`, { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/api/projects`, { next: { revalidate: 3600 } })
    ]);

    if (postsRes.ok) posts = await postsRes.json();
    if (projectsRes.ok) projects = await projectsRes.json();
  } catch (error) {
    console.error("Failed to fetch sitemap data:", error);
  }

  const staticRoutes = [
    "",
    "/blog",
    "/projects",
    "/guestbook",
    "/meeting",
    "/music"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.publishedAt || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes, ...projectRoutes];
}

import { Hono } from "hono";
import type { Env } from "../types";
import { createDb } from "@workspace/db/client";
import { blogPosts, projects } from "@workspace/db/schema";
import { isNotNull, desc } from "drizzle-orm";
import { generateRSS } from "../lib/rss";

export const seoRoute = new Hono<Env>();

// RSS Feed
seoRoute.get("/feed.xml", async (c) => {
  const db = createDb(c.env.DB);
  const posts = await db
    .select()
    .from(blogPosts)
    .where(isNotNull(blogPosts.publishedAt))
    .orderBy(desc(blogPosts.publishedAt));

  const xml = generateRSS(posts);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
});

// llms.txt — site structure for LLM consumption
seoRoute.get("/llms.txt", async (c) => {
  const db = createDb(c.env.DB);
  const posts = await db
    .select({ slug: blogPosts.slug, title: blogPosts.title })
    .from(blogPosts)
    .where(isNotNull(blogPosts.publishedAt))
    .orderBy(desc(blogPosts.publishedAt));

  const projectsList = await db
    .select({ slug: projects.slug, title: projects.title })
    .from(projects)
    .orderBy(projects.order);

  let text = `# Nitish Deshmukh
> Part-Time Web Developer

## Pages
- [Home](https://nitishdeshmukh.com/): Portfolio home
- [Blog](https://nitishdeshmukh.com/blog): Technical blog
- [Projects](https://nitishdeshmukh.com/projects): Project archive
- [Guestbook](https://nitishdeshmukh.com/guestbook): Sign the guestbook
- [Meeting](https://nitishdeshmukh.com/meeting): Book a meeting

## Blog Posts
${posts.map((p) => `- [${p.title}](https://nitishdeshmukh.com/blog/${p.slug})`).join("\n")}

## Projects
${projectsList.map((p) => `- [${p.title}](https://nitishdeshmukh.com/projects/${p.slug})`).join("\n")}
`;

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
});

// llms-full.txt — full content dump for LLMs
seoRoute.get("/llms-full.txt", async (c) => {
  const db = createDb(c.env.DB);

  const posts = await db
    .select()
    .from(blogPosts)
    .where(isNotNull(blogPosts.publishedAt))
    .orderBy(desc(blogPosts.publishedAt));

  const projectsList = await db
    .select()
    .from(projects)
    .orderBy(projects.order);

  let text = `# Nitish Deshmukh — Full Content
> Part-Time Web Developer

---

## Blog Posts

`;

  for (const post of posts) {
    text += `### ${post.title}\n`;
    text += `Published: ${post.publishedAt}\n`;
    if (post.excerpt) text += `${post.excerpt}\n`;
    if (post.contentMdx) text += `\n${post.contentMdx}\n`;
    text += "\n---\n\n";
  }

  text += "## Projects\n\n";

  for (const project of projectsList) {
    text += `### ${project.title}\n`;
    text += `${project.description}\n`;
    if (project.contentMdx) text += `\n${project.contentMdx}\n`;
    if (project.demoUrl) text += `Demo: ${project.demoUrl}\n`;
    if (project.repoUrl) text += `Repo: ${project.repoUrl}\n`;
    text += "\n---\n\n";
  }

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
});

import { db } from "./client";
import { blogPosts } from "./schema";

const sampleMdx = `
This is a sample blog post to test MDX rendering.

## H2 Heading for Table of Contents

Here is a paragraph with **bold** text and an [external link](https://example.com).

<Callout type="note" title="MDX Component">
  This is a custom callout component mapped in our MDX setup. It supports different types like note, warning, danger, and success.
</Callout>

### H3 Subheading

Let us test some syntax highlighting with \`shiki\`:

\`\`\`typescript
// pages/api/hello.ts
export default function handler(req, res) {
  res.status(200).json({ name: "John Doe" });
}
\`\`\`

#### A Table

| Framework | Language |
| --------- | -------- |
| Next.js   | TS       |
| Hono      | TS       |
`;

async function main() {
  await db.insert(blogPosts).values({
    slug: "mdx-test-post",
    title: "Testing MDX and Shiki Rendering",
    excerpt: "A sample post to verify that markdown is correctly parsed and rendered into React components.",
    contentMdx: sampleMdx,
    tags: ["MDX", "Testing", "Next.js"],
    readingTime: 2,
    publishedAt: new Date().toISOString(),
  });
  console.log("Blog post seeded!");
}

main().catch(console.error);

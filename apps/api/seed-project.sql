INSERT INTO projects (slug, title, description, content_mdx, cover_url, demo_url, repo_url, tags, featured, "order")
VALUES (
  'mdx-portfolio',
  'MDX Portfolio Starter',
  'A modern portfolio starter template built with Next.js App Router, Tailwind CSS, and MDX. Features include a dynamic weather background, full markdown support, and sleek animations.',
  'This is a sample project to test MDX rendering in the projects archive.

## Key Features

- **Next.js 15 App Router**
- **MDX Support** with `next-mdx-remote`
- **Syntax Highlighting** with `shiki`
- **Tailwind CSS** for styling

<Callout type="success" title="Success!">
  The custom Callout component is working in the projects view as well!
</Callout>

### Implementation Details

Here is how the project was configured:

```typescript
// next.config.mjs
/** @type {import(''next'').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
};
export default nextConfig;
```
',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
  'https://example.com',
  'https://github.com/nitishdeshmukh/portfolio',
  '["Next.js", "React", "MDX", "Tailwind CSS"]',
  1,
  1
);

INSERT INTO blog_posts (slug, title, excerpt, content_mdx, tags, reading_time, published_at) 
VALUES (
  'mdx-test-post', 
  'Testing MDX and Shiki Rendering', 
  'A sample post to verify that markdown is correctly parsed and rendered into React components.', 
  'This is a sample blog post to test MDX rendering.

## H2 Heading for Table of Contents

Here is a paragraph with **bold** text and an [external link](https://example.com).

<Callout type="note" title="MDX Component">
  This is a custom callout component mapped in our MDX setup. It supports different types like note, warning, danger, and success.
</Callout>

### H3 Subheading

Let us test some syntax highlighting with `shiki`:

```typescript
// pages/api/hello.ts
export default function handler(req, res) {
  res.status(200).json({ name: "John Doe" });
}
```

#### A Table

| Framework | Language |
| --------- | -------- |
| Next.js   | TS       |
| Hono      | TS       |
', 
  '["MDX", "Testing", "Next.js"]', 
  2, 
  datetime('now')
);

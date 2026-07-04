# Plan 022: MDX Editor — Blog/Project Content Editor

> **Executor instructions**: Follow this plan step by step.

## Status

- **Priority**: P1
- **Effort**: L (6-10h)
- **Risk**: MED
- **Depends on**: 021 (CRUD pages)
- **Phase**: 05-Frontend-Admin

## Objective (Kya)

Build an MDX editor component for the admin panel that allows creating and
editing blog posts and project content with:
1. Split-pane editor: raw MDX on left, live preview on right
2. Markdown toolbar (bold, italic, headings, links, code blocks, images)
3. Image upload integration (upload to R2, insert URL)
4. Auto-save draft functionality
5. Reading time auto-calculation

## Timeline (Kab)

After CRUD pages exist. Enhances the blog and projects edit experience.

## Implementation Strategy (Kaise)

### Editor architecture

Use a plain `<textarea>` with toolbar buttons rather than a heavy WYSIWYG editor
(keeps bundle small, MDX syntax is the source of truth):

```typescript
// components/mdx-editor.tsx
interface MDXEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (file: File) => Promise<string>; // returns URL
}

export function MDXEditor({ value, onChange, onImageUpload }: MDXEditorProps) {
  return (
    <div className="grid grid-cols-2 gap-4 h-[600px]">
      {/* Left: Editor */}
      <div className="flex flex-col">
        <EditorToolbar onAction={handleToolbarAction} />
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 font-mono text-sm resize-none p-4 border rounded-b-lg"
          spellCheck={false}
        />
      </div>
      {/* Right: Live Preview */}
      <div className="overflow-auto border rounded-lg p-4 prose dark:prose-invert">
        <MDXPreview source={value} />
      </div>
    </div>
  );
}
```

### Toolbar actions

| Button | Action | Inserts |
|--------|--------|---------|
| **B** | Bold | `**text**` |
| *I* | Italic | `*text*` |
| H2 | Heading 2 | `## ` |
| H3 | Heading 3 | `### ` |
| 🔗 | Link | `[text](url)` |
| 📷 | Image | Upload dialog → `![alt](url)` |
| `</>` | Code block | ` ```\ncode\n``` ` |
| 📋 | Callout | `> [!NOTE]\n> text` |

### Live preview — Using `@mdx-js/mdx` (browser-safe)

> ⚠️ **Critical**: `next-mdx-remote`'s `serialize()` function is **Node.js-only**.
> It uses `remark`/`rehype` plugins that rely on Node.js APIs unavailable in the
> browser. Do NOT use it for client-side preview. Use `@mdx-js/mdx` instead,
> which has a browser-compatible `evaluate()` API.

Install the required packages in `apps/admin`:
```bash
bun add @mdx-js/mdx @mdx-js/react remark-gfm --filter=admin
```

```typescript
// components/mdx-preview.tsx (client component)
"use client";
import { useState, useEffect } from "react";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";

function MDXPreview({ source }: { source: string }) {
  const [Content, setContent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setError(null);
        // evaluate() compiles MDX in the browser — no Node.js required
        const { default: ExportedContent } = await evaluate(source, {
          ...runtime,
          remarkPlugins: [remarkGfm],
        });
        setContent(() => ExportedContent);
      } catch (err) {
        // Syntax error while typing — show error message, don't crash
        setError(String(err));
      }
    }, 500); // debounce 500ms

    return () => clearTimeout(timer);
  }, [source]);

  if (error) {
    return (
      <pre className="text-red-500 text-xs whitespace-pre-wrap p-2">
        {error}
      </pre>
    );
  }

  return Content ? <Content /> : <p className="text-muted-foreground">Loading preview...</p>;
}
```

### Alternative: Server-side preview via API route

If `@mdx-js/mdx` browser bundle is too large (check: `bun run build --analyze`),
use a Next.js API route for preview instead:

```typescript
// apps/admin/app/api/preview-mdx/route.ts (server-side)
import { serialize } from "next-mdx-remote/serialize";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { source } = await req.json();
  const result = await serialize(source, { parseFrontmatter: false });
  return NextResponse.json({ result });
}

// In MDXPreview: POST to /api/preview-mdx and render with <MDXRemote />
```

### Image upload

```typescript
const handleImageUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  // POST to the admin proxy route (Plan 020) — API_SECRET is server-side
  const res = await fetch("/api/proxy/upload", {
    method: "POST",
    body: formData,
    // Do NOT set Content-Type — browser sets it automatically with boundary for FormData
  });
  const { key } = await res.json();
  return `/api/proxy/assets/stream/${key}`;
};
```

### Reading time calculation

```typescript
function calculateReadingTime(mdxContent: string): number {
  // Strip MDX/markdown syntax before word counting
  const text = mdxContent.replace(/[#*`>\[\]\(\)!]/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.ceil(words / 200); // 200 WPM average reading speed
}
```

**Verify**: Editor renders with split-pane layout (textarea left, preview right).
**Verify**: Toolbar buttons insert correct markdown syntax at cursor position.
**Verify**: Live preview updates as you type (debounced 500ms via `@mdx-js/mdx`).
**Verify**: Image upload to R2 works via proxy route and inserts URL into editor.

## Done Criteria

- [ ] MDX editor component with split-pane layout
- [ ] Toolbar with all 8 formatting buttons
- [ ] Live preview using `@mdx-js/mdx evaluate()` (NOT `next-mdx-remote serialize()`)
- [ ] Error display when MDX has syntax errors (no crash)
- [ ] Image upload via `/api/proxy/upload` (secure proxy from Plan 020)
- [ ] Reading time auto-calculated on every keystroke
- [ ] Integrated into blog and projects edit forms (Plan 021)
- [ ] `plans/README.md` 022 → DONE

## STOP Conditions

- `@mdx-js/mdx` browser bundle too large (>500KB gzipped) — switch to the
  server-side API route approach described above.
- `evaluate()` import fails with "Module not found" — check that you installed
  `@mdx-js/mdx` and `@mdx-js/react`, not just `next-mdx-remote`.
- Image upload returns error — ensure the proxy route at `/api/proxy/upload`
  handles `multipart/form-data` (do NOT set `Content-Type: application/json`
  in the fetch request for FormData uploads).

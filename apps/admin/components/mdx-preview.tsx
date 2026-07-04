"use client";

import { useState, useEffect } from "react";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";

export function MDXPreview({ source }: { source: string }) {
  const [Content, setContent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setError(null);
        // evaluate() compiles MDX in the browser
        const { default: ExportedContent } = await evaluate(source || "", {
          ...runtime,
          remarkPlugins: [remarkGfm],
        });
        setContent(() => ExportedContent);
      } catch (err) {
        // Syntax error while typing — show error message
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

  return Content ? <Content /> : <p className="text-muted-foreground text-sm">Loading preview...</p>;
}

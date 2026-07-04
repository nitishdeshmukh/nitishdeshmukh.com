"use client";

import { useRef, useState } from "react";
import { MDXPreview } from "./mdx-preview";
import { Button } from "@workspace/ui/components/button";
import { Bold, Italic, Heading2, Heading3, Link as LinkIcon, Image as ImageIcon, Code, Quote, UploadCloud } from "lucide-react";
import { toast } from "sonner";

interface MDXEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MDXEditor({ value, onChange }: MDXEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newValue);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/proxy/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { key } = await res.json();
      const url = `/api/proxy/assets/stream/${key}`;
      
      insertText(`![${file.name}](${url})`);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px]">
      {/* Left: Editor */}
      <div className="flex flex-col border rounded-md overflow-hidden bg-background">
        <div className="flex flex-wrap items-center gap-1 border-b p-1 bg-muted/50">
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertText("**", "**")} title="Bold">
            <Bold className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertText("*", "*")} title="Italic">
            <Italic className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertText("## ")} title="Heading 2">
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertText("### ")} title="Heading 3">
            <Heading3 className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertText("[", "](url)")} title="Link">
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 relative" title="Upload Image" disabled={isUploading}>
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
              onChange={handleImageUpload}
              disabled={isUploading}
            />
            {isUploading ? <UploadCloud className="h-4 w-4 animate-pulse" /> : <ImageIcon className="h-4 w-4" />}
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertText("```\n", "\n```")} title="Code Block">
            <Code className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertText("> [!NOTE]\n> ")} title="Callout">
            <Quote className="h-4 w-4" />
          </Button>
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 font-mono text-sm resize-none p-4 focus-visible:outline-none bg-transparent"
          spellCheck={false}
          placeholder="Write your markdown here..."
        />
      </div>
      
      {/* Right: Live Preview */}
      <div className="overflow-auto border rounded-md p-6 prose dark:prose-invert max-w-none bg-background">
        <MDXPreview source={value} />
      </div>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { Upload, FileAudio, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

interface FileUploadProps {
  onUploadSuccess: () => void;
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File) => {
    const isAudio = file.type.startsWith("audio/");
    const isImage = file.type.startsWith("image/");
    
    if (!isAudio && !isImage) {
      toast.error("Unsupported file type. Please upload an image or audio file.");
      return false;
    }

    if (isAudio && file.size > 25 * 1024 * 1024) {
      toast.error("Audio files must be under 25MB.");
      return false;
    }

    if (isImage && file.size > 5 * 1024 * 1024) {
      toast.error("Images must be under 5MB.");
      return false;
    }

    return true;
  };

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // 1. Upload to R2 via Proxy
      const uploadRes = await fetch("/api/proxy/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("File upload failed");
      const { key } = await uploadRes.json();

      // 2. Create Asset Metadata via Admin API
      await apiClient("/api/admin/assets", {
        method: "POST",
        body: JSON.stringify({
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          fileKey: key,
          mimeType: file.type,
          sizeBytes: file.size,
        }),
      });

      toast.success("Asset uploaded successfully");
      onUploadSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload asset");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file) uploadFile(file);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={cn(
        "border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-colors w-full",
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/25",
        isUploading && "pointer-events-none opacity-50"
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,audio/*"
      />
      
      {isUploading ? (
        <Loader2 className="h-12 w-12 text-muted-foreground animate-spin mb-4" />
      ) : (
        <Upload className="h-12 w-12 text-muted-foreground mb-4" />
      )}
      
      <p className="text-lg font-medium">
        {isUploading ? "Uploading..." : "Drag and drop files here, or click to browse"}
      </p>
      <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-4">
        <span className="flex items-center gap-1"><FileAudio className="h-4 w-4" /> Audio (max 25MB)</span>
        <span className="flex items-center gap-1"><ImageIcon className="h-4 w-4" /> Images (max 5MB)</span>
      </p>
    </div>
  );
}

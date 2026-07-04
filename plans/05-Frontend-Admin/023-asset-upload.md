# Plan 023: Asset Upload UI — Drag-and-Drop R2 Upload

## Status
- **Priority**: P1 | **Effort**: M (3-5h) | **Risk**: LOW
- **Depends on**: 006 (admin upload API), 020 (admin layout) | **Phase**: 05-Frontend-Admin

## Objective (Kya)
Build the `/assets` admin page with:
1. Drag-and-drop file upload zone (audio files, images)
2. Upload progress indicator
3. Asset list with file name, size, type, duration, play preview
4. Delete functionality
5. Metadata editing (title, artist for audio)

## Timeline (Kab)
After admin layout and API upload endpoint exist. Independent of other admin pages.

## Implementation Strategy (Kaise)

### Components
| Component | Purpose |
|-----------|---------|
| `components/file-upload.tsx` | Drag-and-drop zone with progress bar |
| `app/assets/page.tsx` | Asset list + upload zone |
| `app/assets/audio-preview.tsx` | Inline audio play button for asset list |

### Drag-and-drop upload
```typescript
function FileUpload({ onUpload }: { onUpload: (file: File) => Promise<void> }) {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files[0];
    if (!file) return;

    // Upload via FormData to /api/admin/upload
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/api/admin/upload`, {
      method: "POST",
      headers: { "X-API-Key": API_KEY },
      body: formData,
    });

    const { key } = await res.json();

    // Create asset metadata entry
    await apiClient("/api/admin/assets", {
      method: "POST",
      body: JSON.stringify({
        title: file.name.replace(/\.[^.]+$/, ""),
        fileKey: key,
        mimeType: file.type,
        sizeBytes: file.size,
      }),
    });

    toast.success("Asset uploaded");
    onUpload(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "border-2 border-dashed rounded-xl p-12 text-center transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
      )}
    >
      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
      <p className="mt-4">Drag and drop files here, or click to browse</p>
      <p className="text-sm text-muted-foreground">Audio (MP3, WAV, OGG) • Images (PNG, JPG, WebP)</p>
    </div>
  );
}
```

### File size limits
- Audio: up to 25MB (R2 free tier handles this easily)
- Images: up to 5MB
- Validate before upload, show error toast if exceeded

**Verify**: Drag file onto upload zone → uploads to R2 → appears in asset list.
**Verify**: Click play button in list → plays audio preview.
**Verify**: Delete button removes asset from D1 + R2.

## Done Criteria
- [ ] Drag-and-drop upload zone with visual feedback
- [ ] File type + size validation
- [ ] Upload to R2 via admin API
- [ ] Asset list with metadata (name, size, type, duration)
- [ ] Inline audio play preview
- [ ] Delete functionality (removes from D1 + R2)
- [ ] Metadata editing (title, artist)
- [ ] `plans/README.md` 023 → DONE

## STOP Conditions
- FormData upload fails with Cloudflare Workers — check that the API endpoint
  handles multipart form data correctly (see plan 006).

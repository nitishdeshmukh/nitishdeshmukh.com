"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { DataTable } from "@/components/data-table";
import { EntityDialog, FieldConfig } from "@/components/entity-dialog";
import { createBlogPostSchema } from "@workspace/shared/schemas";
import { getColumns, BlogPost } from "./columns";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";

const fields: FieldConfig[] = [
  { name: "title", label: "Title", type: "text", placeholder: "Post Title" },
  { name: "slug", label: "Slug", type: "text", placeholder: "post-title" },
  { name: "excerpt", label: "Excerpt", type: "text", placeholder: "Short summary" },
  { name: "coverUrl", label: "Cover URL", type: "url", placeholder: "https://..." },
  { name: "readingTime", label: "Reading Time (mins)", type: "number", placeholder: "5" },
  { name: "publishedAt", label: "Published At", type: "text", placeholder: "YYYY-MM-DDTHH:mm:ssZ" },
];

export default function BlogPage() {
  const [data, setData] = useState<BlogPost[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<BlogPost | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await apiClient<BlogPost[]>("/api/admin/blog");
      setData(res);
    } catch (error) {
      toast.error("Failed to fetch blog posts");
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (values: any) => {
    if (!values.tags) values.tags = [];
    try {
      if (editingItem) {
        await apiClient(`/api/admin/blog/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify(values),
        });
        toast.success("Post updated");
      } else {
        await apiClient("/api/admin/blog", {
          method: "POST",
          body: JSON.stringify(values),
        });
        toast.success("Post created");
      }
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
      throw error;
    }
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    try {
      await apiClient(`/api/admin/blog/${deletingItem.id}`, { method: "DELETE" });
      toast.success("Deleted successfully");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    } finally {
      setDeleteDialogOpen(false);
      setDeletingItem(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Blog Posts</h2>
          <p className="text-muted-foreground">Manage your articles</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Post
        </Button>
      </div>

      <DataTable 
        columns={getColumns(
          (item) => { setEditingItem(item); setDialogOpen(true); },
          (item) => { setDeletingItem(item); setDeleteDialogOpen(true); }
        )} 
        data={data} 
        searchKey="title" 
      />

      <EntityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Post"
        schema={createBlogPostSchema}
        fields={fields}
        defaultValues={editingItem || { tags: [] }}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deletingItem?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

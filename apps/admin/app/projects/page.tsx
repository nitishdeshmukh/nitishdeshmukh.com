"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { DataTable } from "@/components/data-table";
import { EntityDialog, FieldConfig } from "@/components/entity-dialog";
import { createProjectSchema } from "@workspace/shared/schemas";
import { getColumns, Project } from "./columns";
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
  { name: "title", label: "Title", type: "text", placeholder: "Project Title" },
  { name: "slug", label: "Slug", type: "text", placeholder: "project-title" },
  { name: "description", label: "Description", type: "text", placeholder: "Short description" },
  { name: "coverUrl", label: "Cover URL", type: "url", placeholder: "https://..." },
  { name: "demoUrl", label: "Demo URL", type: "url", placeholder: "https://..." },
  { name: "repoUrl", label: "Repo URL", type: "url", placeholder: "https://..." },
  { name: "featured", label: "Featured", type: "boolean" },
  { name: "order", label: "Order", type: "number", placeholder: "0" },
];

export default function ProjectsPage() {
  const [data, setData] = useState<Project[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Project | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<Project | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await apiClient<Project[]>("/api/admin/projects");
      setData(res);
    } catch (error) {
      toast.error("Failed to fetch projects");
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (values: any) => {
    // tags are currently omitted from the basic form, default to []
    if (!values.tags) values.tags = [];
    
    try {
      if (editingItem) {
        await apiClient(`/api/admin/projects/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify(values),
        });
        toast.success("Project updated");
      } else {
        await apiClient("/api/admin/projects", {
          method: "POST",
          body: JSON.stringify(values),
        });
        toast.success("Project created");
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
      await apiClient(`/api/admin/projects/${deletingItem.id}`, { method: "DELETE" });
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
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Project
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
        title="Project"
        schema={createProjectSchema}
        fields={fields}
        defaultValues={editingItem || { order: 0, featured: false, tags: [] }}
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

"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { DataTable } from "@/components/data-table";
import { EntityDialog, FieldConfig } from "@/components/entity-dialog";
import { createExperienceSchema } from "@workspace/shared/schemas";
import { getColumns, ExperienceItem } from "./columns";
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
  { name: "company", label: "Company", type: "text", placeholder: "Company Name" },
  { name: "role", label: "Role", type: "text", placeholder: "e.g., Senior Developer" },
  { name: "startDate", label: "Start Date", type: "text", placeholder: "YYYY-MM" },
  { name: "endDate", label: "End Date", type: "text", placeholder: "YYYY-MM (Optional)" },
  { name: "description", label: "Description", type: "text", placeholder: "Short description" },
  { name: "logoUrl", label: "Logo URL", type: "url", placeholder: "https://..." },
  { name: "order", label: "Order", type: "number", placeholder: "0" },
];

export default function ExperiencePage() {
  const [data, setData] = useState<ExperienceItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<ExperienceItem | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await apiClient<ExperienceItem[]>("/api/admin/experience");
      setData(res);
    } catch (error) {
      toast.error("Failed to fetch experience");
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (values: any) => {
    try {
      if (editingItem) {
        await apiClient(`/api/admin/experience/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify(values),
        });
        toast.success("Experience updated");
      } else {
        await apiClient("/api/admin/experience", {
          method: "POST",
          body: JSON.stringify(values),
        });
        toast.success("Experience created");
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
      await apiClient(`/api/admin/experience/${deletingItem.id}`, { method: "DELETE" });
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
          <h2 className="text-2xl font-bold tracking-tight">Experience</h2>
          <p className="text-muted-foreground">Manage your work history</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Experience
        </Button>
      </div>

      <DataTable 
        columns={getColumns(
          (item) => { setEditingItem(item); setDialogOpen(true); },
          (item) => { setDeletingItem(item); setDeleteDialogOpen(true); }
        )} 
        data={data} 
        searchKey="company" 
      />

      <EntityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Experience"
        schema={createExperienceSchema}
        fields={fields}
        defaultValues={editingItem || { order: 0 }}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deletingItem?.company}".
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

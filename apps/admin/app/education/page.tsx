"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { DataTable } from "@/components/data-table";
import { EntityDialog, FieldConfig } from "@/components/entity-dialog";
import { createEducationSchema } from "@workspace/shared/schemas";
import { getColumns, EducationItem } from "./columns";
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
  { name: "institution", label: "Institution", type: "text", placeholder: "University Name" },
  { name: "degree", label: "Degree", type: "text", placeholder: "e.g., B.Sc." },
  { name: "field", label: "Field of Study", type: "text", placeholder: "e.g., Computer Science" },
  { name: "logoUrl", label: "Logo URL", type: "url", placeholder: "https://..." },
  { name: "startYear", label: "Start Year", type: "number", placeholder: "YYYY" },
  { name: "endYear", label: "End Year", type: "number", placeholder: "YYYY (Optional)" },
];

export default function EducationPage() {
  const [data, setData] = useState<EducationItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<EducationItem | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await apiClient<EducationItem[]>("/api/admin/education");
      setData(res);
    } catch (error) {
      toast.error("Failed to fetch education");
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (values: any) => {
    try {
      if (editingItem) {
        await apiClient(`/api/admin/education/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify(values),
        });
        toast.success("Education updated");
      } else {
        await apiClient("/api/admin/education", {
          method: "POST",
          body: JSON.stringify(values),
        });
        toast.success("Education created");
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
      await apiClient(`/api/admin/education/${deletingItem.id}`, { method: "DELETE" });
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
          <h2 className="text-2xl font-bold tracking-tight">Education</h2>
          <p className="text-muted-foreground">Manage your educational history</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Education
        </Button>
      </div>

      <DataTable 
        columns={getColumns(
          (item) => { setEditingItem(item); setDialogOpen(true); },
          (item) => { setDeletingItem(item); setDeleteDialogOpen(true); }
        )} 
        data={data} 
        searchKey="institution" 
      />

      <EntityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Education"
        schema={createEducationSchema}
        fields={fields}
        defaultValues={editingItem || { startYear: new Date().getFullYear() }}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deletingItem?.institution}".
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

"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { DataTable } from "@/components/data-table";
import { EntityDialog, FieldConfig } from "@/components/entity-dialog";
import { createStackItemSchema } from "@workspace/shared/schemas";
import { getColumns, StackItem } from "./columns";
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
  { name: "name", label: "Name", type: "text", placeholder: "e.g., React" },
  { name: "iconUrl", label: "Icon URL", type: "url", placeholder: "https://..." },
  { name: "category", label: "Category", type: "text", placeholder: "e.g., Frontend" },
  { name: "order", label: "Order", type: "number", placeholder: "0" },
];

export default function StackPage() {
  const [data, setData] = useState<StackItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StackItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<StackItem | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await apiClient<StackItem[]>("/api/admin/stack");
      setData(res);
    } catch (error) {
      toast.error("Failed to fetch stack items");
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (values: any) => {
    try {
      if (editingItem) {
        await apiClient(`/api/admin/stack/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify(values),
        });
        toast.success("Stack item updated");
      } else {
        await apiClient("/api/admin/stack", {
          method: "POST",
          body: JSON.stringify(values),
        });
        toast.success("Stack item created");
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
      await apiClient(`/api/admin/stack/${deletingItem.id}`, { method: "DELETE" });
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
          <h2 className="text-2xl font-bold tracking-tight">Tech Stack</h2>
          <p className="text-muted-foreground">Manage technologies you use</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Tech
        </Button>
      </div>

      <DataTable 
        columns={getColumns(
          (item) => { setEditingItem(item); setDialogOpen(true); },
          (item) => { setDeletingItem(item); setDeleteDialogOpen(true); }
        )} 
        data={data} 
        searchKey="name" 
      />

      <EntityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Stack Item"
        schema={createStackItemSchema}
        fields={fields}
        defaultValues={editingItem || { order: 0 }}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deletingItem?.name}".
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

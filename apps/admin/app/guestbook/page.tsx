"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { DataTable } from "@/components/data-table";
import { getColumns, GuestbookEntry } from "./columns";
import { toast } from "sonner";
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

export default function GuestbookPage() {
  const [data, setData] = useState<GuestbookEntry[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<GuestbookEntry | null>(null);

  const fetchData = useCallback(async () => {
    try {
      // In a real app we might want to fetch all (approved and unapproved)
      // We will just fetch the guestbook endpoint (it should return all in admin context)
      const res = await apiClient<GuestbookEntry[]>("/api/admin/guestbook");
      setData(res);
    } catch (error) {
      toast.error("Failed to fetch guestbook entries");
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleApprove = async (item: GuestbookEntry) => {
    try {
      await apiClient(`/api/admin/guestbook/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({ approved: true, name: item.name, message: item.message }), // basic PUT to update approval
      });
      toast.success("Entry approved");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to approve");
    }
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    try {
      await apiClient(`/api/admin/guestbook/${deletingItem.id}`, { method: "DELETE" });
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
          <h2 className="text-2xl font-bold tracking-tight">Guestbook</h2>
          <p className="text-muted-foreground">Moderate messages left by visitors</p>
        </div>
      </div>

      <DataTable 
        columns={getColumns(
          handleApprove,
          (item) => { setDeletingItem(item); setDeleteDialogOpen(true); }
        )} 
        data={data} 
        searchKey="name" 
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the message from "{deletingItem?.name}".
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

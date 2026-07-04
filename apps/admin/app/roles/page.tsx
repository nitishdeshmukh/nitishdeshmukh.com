"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { DataTable } from "@/components/data-table";
import { EntityDialog, FieldConfig } from "@/components/entity-dialog";
import { createRoleSchema } from "@workspace/shared/schemas";
import { getColumns, Role } from "./columns";
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

const roleFields: FieldConfig[] = [
  { name: "title", label: "Title", type: "text", placeholder: "e.g., Software Engineer" },
  { name: "order", label: "Order", type: "number", placeholder: "0" },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  const fetchRoles = useCallback(async () => {
    try {
      const data = await apiClient<Role[]>("/api/admin/roles");
      setRoles(data);
    } catch (error) {
      toast.error("Failed to fetch roles");
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setDialogOpen(true);
  };

  const handleDeleteClick = (role: Role) => {
    setDeletingRole(role);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingRole) {
        await apiClient(`/api/admin/roles/${editingRole.id}`, {
          method: "PUT",
          body: JSON.stringify(values),
        });
        toast.success("Role updated successfully");
      } else {
        await apiClient("/api/admin/roles", {
          method: "POST",
          body: JSON.stringify(values),
        });
        toast.success("Role created successfully");
      }
      fetchRoles();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
      throw error;
    }
  };

  const confirmDelete = async () => {
    if (!deletingRole) return;
    try {
      await apiClient(`/api/admin/roles/${deletingRole.id}`, {
        method: "DELETE",
      });
      toast.success("Role deleted successfully");
      fetchRoles();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete role");
    } finally {
      setDeleteDialogOpen(false);
      setDeletingRole(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Roles</h2>
          <p className="text-muted-foreground">Manage your job titles/roles</p>
        </div>
        <Button onClick={() => {
          setEditingRole(null);
          setDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </div>

      <DataTable 
        columns={getColumns(handleEdit, handleDeleteClick)} 
        data={roles} 
        searchKey="title" 
      />

      <EntityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Role"
        schema={createRoleSchema}
        fields={roleFields}
        defaultValues={editingRole || { order: 0 }}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the role
              "{deletingRole?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

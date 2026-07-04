"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { DataTable } from "@/components/data-table";
import { EntityDialog, FieldConfig } from "@/components/entity-dialog";
import { updateSiteConfigSchema } from "@workspace/shared/schemas";
import { getColumns, SiteConfig } from "./columns";
import { toast } from "sonner";

const fields: FieldConfig[] = [
  { name: "value", label: "Value", type: "text" },
];

export default function SettingsPage() {
  const [data, setData] = useState<SiteConfig[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SiteConfig | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await apiClient<SiteConfig[]>("/api/admin/config");
      setData(res);
    } catch (error) {
      toast.error("Failed to fetch settings");
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (values: any) => {
    try {
      if (editingItem) {
        await apiClient(`/api/admin/config/${editingItem.key}`, {
          method: "PUT",
          body: JSON.stringify(values),
        });
        toast.success("Setting updated");
      }
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Site Settings</h2>
          <p className="text-muted-foreground">Manage global configuration for your site</p>
        </div>
      </div>

      <DataTable 
        columns={getColumns((item) => { setEditingItem(item); setDialogOpen(true); })} 
        data={data} 
        searchKey="key" 
      />

      <EntityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={`Setting: ${editingItem?.key}`}
        schema={updateSiteConfigSchema}
        fields={fields}
        defaultValues={editingItem || {}}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

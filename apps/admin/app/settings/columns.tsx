"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import { Edit } from "lucide-react";

export type SiteConfig = {
  key: string;
  value: string;
};

export const getColumns = (
  onEdit: (item: SiteConfig) => void
): ColumnDef<SiteConfig>[] => [
  { accessorKey: "key", header: "Key" },
  { accessorKey: "value", header: "Value" },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => onEdit(item)}>
          <span className="sr-only">Edit</span>
          <Edit className="h-4 w-4" />
        </Button>
      );
    },
  },
];

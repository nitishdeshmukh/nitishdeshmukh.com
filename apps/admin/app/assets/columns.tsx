"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

export type Asset = {
  id: number;
  title: string;
  artist?: string;
  fileKey: string;
  mimeType: string;
  sizeBytes?: number;
  duration?: number;
  createdAt: string;
};

export const getColumns = (
  onEdit: (item: Asset) => void,
  onDelete: (item: Asset) => void
): ColumnDef<Asset>[] => [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "artist", header: "Artist" },
  { accessorKey: "mimeType", header: "Type" },
  {
    accessorKey: "sizeBytes",
    header: "Size",
    cell: ({ row }) => {
      const size = row.original.sizeBytes;
      if (!size) return "-";
      return (size / 1024 / 1024).toFixed(2) + " MB";
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(item)}
              className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

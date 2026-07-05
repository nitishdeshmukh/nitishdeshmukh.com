"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

export type Project = {
  id: number;
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  featured: boolean;
  order: number;
  createdAt: string;
};

export const getColumns = (
  onEdit: (item: Project) => void,
  onDelete: (item: Project) => void
): ColumnDef<Project>[] => [
  { accessorKey: "order", header: "Order" },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "slug", header: "Slug" },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => (row.original.featured ? "Yes" : "No"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "h-8 w-8 p-0" })}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
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

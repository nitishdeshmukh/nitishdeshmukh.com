"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import { MoreHorizontal, Edit, Trash, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

export type SocialLink = {
  id: number;
  platform: string;
  url: string;
  icon: string;
  order: number;
  createdAt: string;
};

export const getColumns = (
  onEdit: (link: SocialLink) => void,
  onDelete: (link: SocialLink) => void
): ColumnDef<SocialLink>[] => [
  {
    accessorKey: "order",
    header: "Order",
  },
  {
    accessorKey: "platform",
    header: "Platform",
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => (
      <a href={row.original.url} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:underline">
        {row.original.url} <ExternalLink className="ml-1 h-3 w-3" />
      </a>
    ),
  },
  {
    accessorKey: "icon",
    header: "Icon (lucide)",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const link = row.original;
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
            <DropdownMenuItem onClick={() => onEdit(link)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(link)}
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

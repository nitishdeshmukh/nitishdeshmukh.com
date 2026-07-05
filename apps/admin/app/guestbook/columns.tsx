"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { MoreHorizontal, Check, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

export type GuestbookEntry = {
  id: number;
  name: string;
  message: string;
  approved: boolean;
  createdAt: string;
};

export const getColumns = (
  onApprove: (item: GuestbookEntry) => void,
  onDelete: (item: GuestbookEntry) => void
): ColumnDef<GuestbookEntry>[] => [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "message", header: "Message" },
  {
    accessorKey: "approved",
    header: "Status",
    cell: ({ row }) => (
      <span className={`px-2 py-1 rounded-full text-xs ${row.original.approved ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
        {row.original.approved ? "Approved" : "Pending"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
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
            {!item.approved && (
              <DropdownMenuItem onClick={() => onApprove(item)}>
                <Check className="mr-2 h-4 w-4 text-green-600" />
                Approve
              </DropdownMenuItem>
            )}
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

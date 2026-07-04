# Plan 021: Admin CRUD Pages — All Entities

## Status
- **Priority**: P0 | **Effort**: XL (10h+) | **Risk**: LOW
- **Depends on**: 006 (admin API), 020 (admin layout) | **Phase**: 05-Frontend-Admin

## Objective (Kya)
Build CRUD interfaces for all 9 entity types plus site settings:
1. Data table with sorting, filtering, pagination (TanStack Table)
2. Create/Edit dialog with react-hook-form + Zod validation
3. Delete confirmation dialog
4. Reorder via drag handles (for ordered entities like roles, stack, experience)
5. Toast notifications for all mutation results

## Timeline (Kab)
Largest admin task. Start after admin layout (020) and admin API (006) are done.

## Implementation Strategy (Kaise)

### Reusable components

| Component | Purpose | Libraries |
|-----------|---------|-----------|
| `components/data-table.tsx` | Generic data table | `@tanstack/react-table` |
| `components/data-table-toolbar.tsx` | Search + filter + "Add new" button | — |
| `components/entity-dialog.tsx` | Create/Edit modal form | `react-hook-form`, `@hookform/resolvers/zod` |
| `components/delete-dialog.tsx` | Delete confirmation | shadcn `AlertDialog` |
| `components/column-header.tsx` | Sortable column header | — |

### CRUD page pattern (repeated per entity)

Each entity page follows this exact pattern:

```typescript
// app/roles/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { DataTable } from "@/components/data-table";
import { EntityDialog } from "@/components/entity-dialog";
import { createRoleSchema } from "@workspace/shared/schemas";
import { columns } from "./columns";
import { toast } from "sonner";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchRoles = async () => {
    const data = await apiClient("/api/admin/roles");
    setRoles(data);
  };

  useEffect(() => { fetchRoles(); }, []);

  const handleCreate = async (values) => {
    await apiClient("/api/admin/roles", { method: "POST", body: JSON.stringify(values) });
    toast.success("Role created");
    fetchRoles();
  };

  const handleDelete = async (id) => {
    await apiClient(`/api/admin/roles/${id}`, { method: "DELETE" });
    toast.success("Role deleted");
    fetchRoles();
  };

  return (
    <div>
      <h1>Roles</h1>
      <DataTable columns={columns} data={roles} onEdit={setEditing} onDelete={handleDelete} />
      <EntityDialog
        open={dialogOpen}
        schema={createRoleSchema}
        onSubmit={handleCreate}
        fields={[
          { name: "title", label: "Title", type: "text" },
          { name: "order", label: "Order", type: "number" },
        ]}
      />
    </div>
  );
}
```

### Entity-specific pages

| Route | Entity | Special Fields | Notes |
|-------|--------|---------------|-------|
| `/roles` | roles | title, order | Drag reorder |
| `/social-links` | social_links | platform, url, icon, order | Icon picker dropdown |
| `/stack` | stack | name, iconUrl, category, order | Category grouping |
| `/experience` | experience | company, role, startDate, endDate, description, logoUrl | Date pickers, markdown description |
| `/education` | education | institution, degree, field, startYear, endYear | Year pickers |
| `/projects` | projects | slug, title, description, tags, featured, demoUrl, repoUrl | Tag input, featured toggle, MDX editor (022) |
| `/blog` | blog_posts | slug, title, excerpt, tags, publishedAt, readingTime | MDX editor (022), date picker |
| `/guestbook` | guestbook | name, message, approved | Approve/delete only (no create/edit) |
| `/settings` | site_config | key-value pairs | Form with all config keys |

### Guestbook moderation (special case)
No create/edit — only a table with "Approve" and "Delete" actions:
```typescript
// Approve button calls PUT /api/admin/guestbook/:id/approve
// Delete button calls DELETE /api/admin/guestbook/:id
```

### Dynamic form builder (`entity-dialog.tsx`)
The `EntityDialog` component receives a Zod schema and a field config array,
then auto-generates the form using `react-hook-form`:

```typescript
interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "url" | "date" | "select" | "boolean" | "tags" | "mdx";
  options?: { value: string; label: string }[];  // for select
  placeholder?: string;
}
```

This avoids writing 9 separate form components.

**Verify**: Each entity CRUD page loads, displays data, creates, edits, and deletes.
**Verify**: Zod validation shows errors on invalid input.
**Verify**: Toast notifications appear on success/failure.

## Done Criteria
- [ ] `DataTable` component with sort, filter, pagination
- [ ] `EntityDialog` component with dynamic form generation
- [ ] All 9 entity pages + settings page created
- [ ] Create, edit, delete operations work for each entity
- [ ] Guestbook has approve/delete (no create/edit)
- [ ] Zod validation on all forms
- [ ] Toast notifications for all mutations
- [ ] `plans/README.md` 021 → DONE

## STOP Conditions
- `@tanstack/react-table` version incompatibility with React 19 — report.
- Zod schemas from `@workspace/shared` don't resolve — check package exports.

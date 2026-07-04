import { createCrudRoutes } from "../../lib/crud-factory";
import { roles } from "@workspace/db/schema";
import { createRoleSchema } from "@workspace/shared";

export const adminRolesRoute = createCrudRoutes("roles", roles, createRoleSchema);

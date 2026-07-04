import { createCrudRoutes } from "../../lib/crud-factory";
import { projects } from "@workspace/db/schema";
import { createProjectSchema } from "@workspace/shared";

export const adminProjectsRoute = createCrudRoutes("projects", projects, createProjectSchema);

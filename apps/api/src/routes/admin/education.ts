import { createCrudRoutes } from "../../lib/crud-factory";
import { education } from "@workspace/db/schema";
import { createEducationSchema } from "@workspace/shared";

export const adminEducationRoute = createCrudRoutes("education", education, createEducationSchema);

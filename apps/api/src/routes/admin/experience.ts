import { createCrudRoutes } from "../../lib/crud-factory";
import { experience } from "@workspace/db/schema";
import { createExperienceSchema } from "@workspace/shared";

export const adminExperienceRoute = createCrudRoutes("experience", experience, createExperienceSchema);

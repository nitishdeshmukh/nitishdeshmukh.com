import { createCrudRoutes } from "../../lib/crud-factory";
import { stack } from "@workspace/db/schema";
import { createStackItemSchema } from "@workspace/shared";

export const adminStackRoute = createCrudRoutes("stack", stack, createStackItemSchema);

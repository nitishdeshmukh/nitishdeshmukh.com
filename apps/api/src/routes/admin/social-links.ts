import { createCrudRoutes } from "../../lib/crud-factory";
import { socialLinks } from "@workspace/db/schema";
import { createSocialLinkSchema } from "@workspace/shared";

export const adminSocialLinksRoute = createCrudRoutes("social_links", socialLinks, createSocialLinkSchema);

import { createCrudRoutes } from "../../lib/crud-factory";
import { blogPosts } from "@workspace/db/schema";
import { createBlogPostSchema } from "@workspace/shared";

export const adminBlogRoute = createCrudRoutes("blog_posts", blogPosts, createBlogPostSchema);

import { Hono } from "hono";
import type { Env } from "../types";
import { createDb } from "@workspace/db/client";
import { roles, socialLinks, siteConfig } from "@workspace/db/schema";

export const profileRoute = new Hono<Env>();

profileRoute.get("/", async (c) => {
  const db = createDb(c.env.DB);

  const [config, rolesList, links] = await Promise.all([
    db.select().from(siteConfig),
    db.select().from(roles).orderBy(roles.order),
    db.select().from(socialLinks).orderBy(socialLinks.order),
  ]);

  const configMap = Object.fromEntries(config.map(r => [r.key, r.value]));

  return c.json({
    name: configMap.name ?? "Nitish Deshmukh",
    bio: configMap.bio ?? "",
    profileImage: configMap.profileImage ?? "",
    location: configMap.location ?? "",
    roles: rolesList,
    socialLinks: links,
  });
});

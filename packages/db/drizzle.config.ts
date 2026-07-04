import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "sqlite.db", // Local fallback for dev/studio
  },
} satisfies Config;

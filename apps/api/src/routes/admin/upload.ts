import { Hono } from "hono";
import type { Env } from "../../types";
import { authMiddleware } from "../../middleware/auth";

export const adminUploadRoute = new Hono<Env>();

adminUploadRoute.use("*", authMiddleware);

adminUploadRoute.post("/", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // Generate unique key
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `uploads/${timestamp}-${originalName}`;
    
    // Put to R2 Bucket
    await c.env.ASSETS_BUCKET.put(key, file.stream(), {
      httpMetadata: { contentType: file.type },
    });

    // In a real production setup with a custom domain bound to the R2 bucket,
    // this would be the public URL. Since we are using our Hono worker as a proxy,
    // we return the internal key to be requested via our own worker endpoint.
    return c.json({ 
      key, 
      url: `/api/assets/${key}` // Example of proxy URL pattern if we added a generic proxy
    }, 201);
  } catch (error: any) {
    console.error("Upload error:", error);
    return c.json({ error: "Failed to upload file", details: error.message }, 500);
  }
});

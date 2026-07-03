import { OpenAPIHono } from "@hono/zod-openapi";
import { registerRoutes } from "./routes.js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function buildApp() {
  const app = new OpenAPIHono();

  // Serve UI
  app.get("/", (c) => {
    const html = readFileSync(join(__dirname, "public/index.html"), "utf-8");
    return c.html(html);
  });

  // OpenAPI doc endpoint
  app.doc("/spec", {
    openapi: "3.1.0",
    info: { title: "Hello Greeting", version: "1.0.0" },
  });

  // Routes derived from OpenAPI spec
  registerRoutes(app);

  app.notFound((c) => c.json({ error: "Not found" }, 404));
  app.onError((err, c) => {
    console.error(err);
    return c.json({ error: "Internal server error" }, 500);
  });

  return app;
}

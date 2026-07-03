import { OpenAPIHono } from "@hono/zod-openapi";
import { registerRoutes } from "./routes.js";

// This file is hand-written and permanent.
// Routes and handlers are wired in from generated + implementation layers.
// DO NOT put business logic here.

export function buildApp() {
  const app = new OpenAPIHono();

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

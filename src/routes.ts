// THIS FILE IS GENERATED. DO NOT EDIT MANUALLY.
// Regenerate with: npm run generate
//
// Route definitions derived from specs/openapi.yaml via Kubb.
// Handler implementations live in src/implementation/handlers.ts

import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { greetingResponseSchema } from "./generated/zod/greetingResponseSchema.js";
import { errorResponseSchema } from "./generated/zod/errorResponseSchema.js";
import type { OpenAPIHono } from "@hono/zod-openapi";
import { getHelloHandler } from "./implementation/handlers.js";

export const getHelloRoute = createRoute({
  method: "get",
  path: "/hello",
  operationId: "getHello",
  summary: "Get the current seasonal greeting",
  request: {
    query: z.object({
      date: z.union([z.string(), z.array(z.string())]).optional().transform(v =>
        Array.isArray(v) ? v[0] : v
      ),
    }),
  },
  responses: {
    200: {
      description: "Greeting returned successfully",
      content: {
        "application/json": {
          schema: greetingResponseSchema,
        },
      },
    },
    400: {
      description: "Invalid date parameter",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

export function registerRoutes(app: OpenAPIHono) {
  app.openapi(getHelloRoute, getHelloHandler);
  // Return 405 for any non-GET method on /hello, with required Allow header (RFC 9110)
  app.all("/hello", (c) => {
    c.header("Allow", "GET");
    return c.json({ error: "Method Not Allowed" }, 405);
  });
}

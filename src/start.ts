import { serve } from "@hono/node-server";
import { buildApp } from "./app.js";

const app = buildApp();
const PORT = 3010;

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Hello Greeting running on http://localhost:${PORT}`);
  console.log(`OpenAPI spec at http://localhost:${PORT}/spec`);
});

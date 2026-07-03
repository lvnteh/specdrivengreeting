import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginZod } from "@kubb/plugin-zod";

export default defineConfig({
  input: {
    path: "./specs/openapi.yaml",
  },
  output: {
    path: "./src/generated",
    clean: true,
  },
  plugins: [
    pluginOas(),
    pluginTs({
      output: { path: "types" },
    }),
    pluginZod({
      output: { path: "zod" },
      typed: false,
    }),
  ],
});

import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { markdownPosts } from "./markdown-posts.ts";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    markdownPosts(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart({ prerender: { enabled: true, failOnError: true } }),
    react(),
  ],
});

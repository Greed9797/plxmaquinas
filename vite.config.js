import { defineConfig } from "vite";
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

function collectHtml(dir, acc = {}) {
  for (const name of readdirSync(dir)) {
    if (["node_modules", "dist", "public", ".git", "src"].includes(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) collectHtml(full, acc);
    else if (name.endsWith(".html")) {
      const rel = relative(dir, full);
      acc[rel.replace(/[\\/]/g, "-")] = full;
    }
  }
  return acc;
}

export default defineConfig({
  appType: "mpa",
  server: {
    host: "0.0.0.0",
    port: 43147,
    strictPort: true,
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 43147,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: collectHtml(process.cwd()),
    },
  },
});

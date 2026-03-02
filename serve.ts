import { readFileSync } from "fs";
import { join } from "path";

const distDir = join(import.meta.dir, "dist");

Bun.serve({
  port: 8080,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname === "/" ? "/index.html" : url.pathname;

    const filePath = join(distDir, pathname);
    const file = Bun.file(filePath);

    if (await file.exists()) {
      return new Response(file);
    }

    // SPA fallback
    return new Response(Bun.file(join(distDir, "index.html")));
  },
});

console.log("Serving on http://0.0.0.0:8080");

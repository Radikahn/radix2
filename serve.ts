import { readFileSync } from "fs";
import { join } from "path";

const distDir = join(import.meta.dir, "dist");

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: https://live.staticflickr.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src https://w.soundcloud.com https://open.spotify.com https://www.redditmedia.com https://embed.reddit.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = {
  "Strict-Transport-Security": "max-age=31536000",
  "Content-Security-Policy": contentSecurityPolicy,
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
};

Bun.serve({
  port: 8080,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname === "/" ? "/index.html" : url.pathname;

    const filePath = join(distDir, pathname);
    const file = Bun.file(filePath);

    if (await file.exists()) {
      return new Response(file, { headers: securityHeaders });
    }

    // SPA fallback
    return new Response(Bun.file(join(distDir, "index.html")), {
      headers: securityHeaders,
    });
  },
});

console.log("Serving on http://0.0.0.0:8080");

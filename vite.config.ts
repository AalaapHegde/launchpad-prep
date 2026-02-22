import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Dev-only plugin that loads Vercel serverless functions at /api/* */
function vercelApiDev(): Plugin {
  return {
    name: "vercel-api-dev",
    configureServer(server) {
      // Load all .env vars into process.env for serverless handlers
      const env = loadEnv("development", __dirname, "");
      for (const [k, v] of Object.entries(env)) {
        if (!process.env[k]) process.env[k] = v;
      }
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) return next();

        // Map URL to handler file, e.g. /api/admin/submissions → api/admin/submissions.ts
        const urlObj = new URL(req.url, "http://localhost");
        const filePath = path.resolve(__dirname, urlObj.pathname.slice(1) + ".ts");

        try {
          // Use Vite's ssrLoadModule to get the handler with HMR
          const mod = await server.ssrLoadModule(filePath);
          const handler = mod.default;

          // Parse JSON body for POST/PUT/PATCH
          let body: unknown = undefined;
          if (req.method !== "GET" && req.method !== "DELETE") {
            body = await new Promise<unknown>((resolve) => {
              let data = "";
              req.on("data", (chunk: Buffer) => (data += chunk));
              req.on("end", () => {
                try { resolve(JSON.parse(data)); } catch { resolve(undefined); }
              });
            });
          }

          // Build minimal req/res objects matching Vercel's serverless API
          const query = Object.fromEntries(urlObj.searchParams.entries());
          const fakeReq = { ...req, method: req.method, headers: req.headers, body, query };
          const fakeRes = {
            statusCode: 200,
            _headers: {} as Record<string, string>,
            status(code: number) { this.statusCode = code; return this; },
            setHeader(k: string, v: string) { this._headers[k] = v; return this; },
            json(data: unknown) {
              res.writeHead(this.statusCode, { "Content-Type": "application/json", ...this._headers });
              res.end(JSON.stringify(data));
            },
          };

          await handler(fakeReq, fakeRes);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: msg }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), vercelApiDev()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});

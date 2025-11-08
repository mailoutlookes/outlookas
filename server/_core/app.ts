import "dotenv/config";
import express from "express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

/**
 * Build and configure the Express application. This function encapsulates all
 * middleware and route registration so that the app can be used both in
 * serverless environments (e.g. Vercel) and traditional servers. It does
 * **not** start listening on a port; that responsibility remains with the
 * caller. When running in development mode the Vite dev server is mounted
 * (which requires an HTTP server), otherwise static files are served from
 * the `public` directory.
 */
export async function createApp() {
  const app = express();

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  // NOTE: We deliberately omit calling setupVite or serveStatic here. When
  // running on Vercel, static assets under the `public/` directory are
  // automatically served by the platform, and express.static() calls are
  // ignored【382487564759194†screenshot】. During local development, the
  // dev server is run via `npm run dev`, which uses server/_core/index.ts
  // and attaches the Vite middleware. This separation avoids relying on
  // import.meta and filesystem paths that may not be available in serverless
  // environments.

  return app;
}
// Entry point for the Express app when deployed to Vercel.
//
// Vercel detects the default export from this file and uses it to handle
// incoming HTTP requests. We build the Express application via
// `createApp()` from `server/_core/app.ts` and export it. Note that we
// intentionally avoid calling `listen()` here because Vercel manages
// the HTTP server for us.

import { createApp } from "./server/_core/app";

// Using top‑level await here is supported in Node.js ESM modules. It
// allows us to asynchronously build the app (e.g. in development
// `createApp` might attach Vite middlewares) before exporting it.
const app = await createApp();

export default app;
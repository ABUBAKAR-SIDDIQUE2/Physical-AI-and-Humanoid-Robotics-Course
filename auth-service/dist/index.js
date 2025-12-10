import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { auth } from "./auth";
import internalRoutes from "./routes/internal";
import dotenv from "dotenv";
dotenv.config();
const app = new Hono();
// CORS Middleware
app.use("/api/*", cors({
    origin: (origin) => {
        const allowed = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"];
        return allowed.includes(origin) ? origin : null;
    },
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
}));
// Mount Better Auth handler
app.on(["POST", "GET"], "/api/auth/**", (c) => {
    return auth.handler(c.req.raw);
});
// Mount Internal Routes
app.route("/internal", internalRoutes);
app.get("/health", (c) => c.json({ status: "ok", service: "auth-service" }));
const port = 4000;
console.log(`Auth Service running on port ${port}`);
serve({
    fetch: app.fetch,
    port,
});

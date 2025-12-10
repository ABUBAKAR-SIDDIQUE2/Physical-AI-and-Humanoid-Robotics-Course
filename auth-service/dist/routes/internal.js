import { Hono } from "hono";
const app = new Hono();
app.get("/user/:id", async (c) => {
    const internalSecret = c.req.header("x-internal-secret");
    if (internalSecret !== process.env.INTERNAL_SECRET) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    const userId = c.req.param("id");
    // Direct DB lookup might be faster, but using auth.api is safer for abstraction
    // However, better-auth doesn't expose a simple "getUserById" easily without context
    // So we will query the DB directly via the auth instance's internal adapter if possible,
    // or just use the pool. Given we passed the pool to better-auth, we can use it.
    // Using direct SQL for simplicity and speed in this internal route
    const { pool } = require("../db");
    try {
        const res = await pool.query('SELECT * FROM "user" WHERE id = $1', [userId]);
        if (res.rows.length === 0) {
            return c.json({ error: "User not found" }, 404);
        }
        return c.json(res.rows[0]);
    }
    catch (error) {
        console.error(error);
        return c.json({ error: "Internal Server Error" }, 500);
    }
});
export default app;

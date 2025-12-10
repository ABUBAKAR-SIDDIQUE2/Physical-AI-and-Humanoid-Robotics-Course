import { Hono } from "hono";
import { pool } from "../db.js"; // ESM import
const app = new Hono();
app.get("/user/:id", async (c) => {
    const internalSecret = c.req.header("x-internal-secret");
    if (internalSecret !== process.env.INTERNAL_SECRET) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    const userId = c.req.param("id");
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

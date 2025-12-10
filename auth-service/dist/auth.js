import { betterAuth } from "better-auth";
import { pool } from "./db";
export const auth = betterAuth({
    database: pool,
    user: {
        additionalFields: {
            software_bg: {
                type: "string",
                required: false,
            },
            hardware_bg: {
                type: "string",
                required: false,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",")
        : ["http://localhost:3000"],
});

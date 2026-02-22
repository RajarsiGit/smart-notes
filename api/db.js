import { neon } from "@neondatabase/serverless";
import jwt from "jsonwebtoken";

let sql;

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const COOKIE_NAME = "auth_token";

export function getDb() {
  if (!sql) {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    sql = neon(databaseUrl);
  }

  return sql;
}

export async function getUserFromRequest(req) {
  const sql = getDb();

  const cookies =
    req.headers.cookie?.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    }, {}) || {};

  const token = cookies[COOKIE_NAME];

  if (!token) {
    throw new Error("Not authenticated - no token found");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const users = await sql`
      SELECT id, name, email FROM users WHERE id = ${decoded.userId}
    `;

    if (users.length === 0) {
      throw new Error("User not found");
    }

    return users[0];
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      throw new Error("Invalid or expired token");
    }
    throw error;
  }
}

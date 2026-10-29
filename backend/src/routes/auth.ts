import { Router } from "express";
import bcrypt from "bcrypt";

import { pool } from "../database.js";
import {
  AUTH_COOKIE,
  requireAuth,
  signToken,
  type AuthedRequest,
} from "../middleware/auth.js";

const router = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const COOKIE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

type SignupBody = { email?: unknown; password?: unknown };
type LoginBody = { email?: unknown; password?: unknown };

function cookieOptions(): {
  httpOnly: true;
  sameSite: "lax";
  secure: boolean;
  maxAge: number;
  path: string;
} {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE_MS,
    path: "/",
  };
}

router.post("/signup", async (req, res) => {
  const { email, password } = (req.body ?? {}) as SignupBody;

  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    res.status(400).json({ error: "Enter a valid email address." });
    return;
  }

  if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
    res.status(400).json({
      error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
    });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existing = await pool.query<{ id: number }>(
      "SELECT id FROM users WHERE LOWER(email) = $1",
      [normalizedEmail],
    );

    if (existing.rowCount && existing.rowCount > 0) {
      res.status(409).json({ error: "An account with this email already exists." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query<{
      id: number;
      email: string;
      created_at: string;
    }>(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email, created_at`,
      [normalizedEmail, passwordHash],
    );

    const user = result.rows[0];
    const token = signToken(user.id);

    res.cookie(AUTH_COOKIE, token, cookieOptions());
    res.status(201).json({
      user: { id: user.id, email: user.email, created_at: user.created_at },
    });
  } catch (error) {
    console.error("Signup failed:", error);
    res.status(500).json({ error: "Could not create your account." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = (req.body ?? {}) as LoginBody;

  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "Enter your email and password." });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const result = await pool.query<{
      id: number;
      email: string;
      password_hash: string;
      created_at: string;
    }>(
      "SELECT id, email, password_hash, created_at FROM users WHERE LOWER(email) = $1",
      [normalizedEmail],
    );

    if (result.rowCount === 0) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const user = result.rows[0];
    const matches = await bcrypt.compare(password, user.password_hash);

    if (!matches) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const token = signToken(user.id);
    res.cookie(AUTH_COOKIE, token, cookieOptions());
    res.json({
      user: { id: user.id, email: user.email, created_at: user.created_at },
    });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ error: "Could not sign you in." });
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie(AUTH_COOKIE, { path: "/" });
  res.status(204).end();
});

router.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const result = await pool.query<{
      id: number;
      email: string;
      created_at: string;
    }>(
      "SELECT id, email, created_at FROM users WHERE id = $1",
      [req.userId],
    );

    if (result.rowCount === 0) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error("Failed to load current user:", error);
    res.status(500).json({ error: "Could not load your account." });
  }
});

export default router;

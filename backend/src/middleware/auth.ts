import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const AUTH_COOKIE = "spendwise_token";

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET env var is required");
  }
  return secret;
}

export function signToken(userId: number): string {
  return jwt.sign({ sub: userId }, getJwtSecret(), { expiresIn: "30d" });
}

export type AuthedRequest = Request & { userId?: number };

export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.[AUTH_COOKIE];
  if (!token) {
    res.status(401).json({ error: "Not signed in" });
    return;
  }

  try {
    const payload = jwt.verify(token, getJwtSecret()) as unknown as {
      sub: number;
    };
    req.userId = Number(payload.sub);
    next();
  } catch {
    res.status(401).json({ error: "Session expired" });
  }
}

export function optionalAuth(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.[AUTH_COOKIE];
  if (!token) {
    next();
    return;
  }

  try {
    const payload = jwt.verify(token, getJwtSecret()) as unknown as {
      sub: number;
    };
    req.userId = Number(payload.sub);
  } catch {
    // ignore invalid token
  }
  next();
}

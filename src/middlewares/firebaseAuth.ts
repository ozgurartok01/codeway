import { Request, Response, NextFunction } from "express";
import { firebaseAuth } from "../utils/firebase";

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
  };
}

export async function firebaseAuthMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Missing or invalid Authorization header",
    });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decoded = await firebaseAuth.verifyIdToken(token);

    req.user = {
      uid: decoded.uid,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid Firebase token",
    });
  }
}

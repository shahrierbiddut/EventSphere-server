import { NextFunction, Request, Response } from "express";
import { verifyToken } from "./auth";

interface AuthPayload {
  id: string;
  email: string;
  role: string;
}

export const adminAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  verifyToken(req, res, () => {
    const user = (req as Request & { user: AuthPayload }).user;
    
    if (user && user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Admin Access Required" });
    }
  });
};

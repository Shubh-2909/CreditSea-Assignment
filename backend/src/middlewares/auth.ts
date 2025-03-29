// src/middleware/auth.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { IUser } from "../interfaces";
import { userModel } from "../models/user.model";

interface JwtPayload {
  _id: string;
}

// Extend the Express Request type
export interface AuthRequest extends Request {
  user?: IUser;
}

// Fixed middleware functions to handle the TypeScript return type properly
export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log(token);
    if (!token) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    const user = (await userModel.findById(decoded._id)) as IUser;

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Authentication failed",
      error: (error as Error).message,
    });
  }
};

// Middleware to check if user is an admin
export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({ message: "Admin access required" });
    return;
  }

  next();
};

// Middleware to check if user is a verifier
export const isVerifier = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  if (req.user.role !== "verifier") {
    res.status(403).json({ message: "Verifier access required" });
    return;
  }

  next();
};

// Middleware to check if user is an admin or verifier
export const isAdminOrVerifier = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  if (req.user.role !== "admin" && req.user.role !== "verifier") {
    res.status(403).json({ message: "Admin or verifier access required" });
    return;
  }

  next();
};

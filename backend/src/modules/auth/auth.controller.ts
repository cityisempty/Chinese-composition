import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

import {
  authenticateUser,
  getUserProfile,
  registerUser,
} from "@/modules/auth/auth.service";
import { signToken } from "@/utils/jwt";
import { AuthenticatedRequest } from "@/middleware/authenticate";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, fullName, gradeLevel } = req.body as {
    email: string;
    password: string;
    fullName: string;
    gradeLevel?: string;
  };

  const user = await registerUser(email, password, fullName, gradeLevel);
  const token = signToken({ userId: user.id });

  res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      gradeLevel: user.gradeLevel,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  const user = await authenticateUser(email, password);
  const token = signToken({ userId: user.id });

  res.status(200).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      gradeLevel: user.gradeLevel,
    },
  });
});

export const me = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const profile = await getUserProfile(req.user.id);

    res.status(200).json({ user: profile });
  }
);

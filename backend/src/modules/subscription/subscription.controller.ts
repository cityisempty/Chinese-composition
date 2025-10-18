import asyncHandler from "express-async-handler";
import { Response } from "express";

import { AuthenticatedRequest } from "@/middleware/authenticate";
import {
  getSubscription,
  upsertSubscription,
} from "@/modules/subscription/subscription.service";

export const updateSubscription = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { plan } = req.body as { plan: "FREE" | "PRO" | "TEAM" };

    const subscription = await upsertSubscription(req.user.id, plan);

    res.status(200).json({ subscription });
  }
);

export const currentSubscription = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const subscription = await getSubscription(req.user.id);

    res.status(200).json({ subscription });
  }
);

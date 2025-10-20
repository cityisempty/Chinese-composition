import asyncHandler from "express-async-handler";
import { Response } from "express";

import { AuthenticatedRequest } from "@/middleware/authenticate";
import {
  addStudentReview,
  createEssayDraft,
  finalizeEssay,
  getEssayForUser,
  listEssaysForUser,
  reviseEssay,
} from "@/modules/essays/essay.service";

export const generateEssay = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { gradeLevel, essayType, requirements, prompt } = req.body as {
      gradeLevel: string;
      essayType: string;
      requirements: string;
      prompt: string;
    };

    const essay = await createEssayDraft({
      userId: req.user.id,
      gradeLevel,
      essayType,
      requirements,
      prompt,
    });

    res.status(201).json({ essay });
  }
);

export const getEssay = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { essayId } = req.params as { essayId: string };

    const essay = await getEssayForUser(essayId, req.user.id);

    if (!essay) {
      res.status(404).json({ message: "Essay not found" });
      return;
    }

    res.status(200).json({ essay });
  }
);

export const reviewEssay = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { essayId } = req.params as { essayId: string };
    const { rating, feedback } = req.body as {
      rating: number;
      feedback: string;
    };

    const essay = await addStudentReview(essayId, req.user.id, rating, feedback);

    res.status(200).json({ essay });
  }
);

export const reviseEssayController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { essayId } = req.params as { essayId: string };
    const { instructions } = req.body as { instructions: string };

    const essay = await reviseEssay(essayId, req.user.id, instructions);

    res.status(200).json({ essay });
  }
);

export const finalizeEssayController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { essayId } = req.params as { essayId: string };

    const essay = await finalizeEssay(essayId, req.user.id);

    res.status(200).json({ essay });
  }
);

export const listEssays = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const essays = await listEssaysForUser(req.user.id);

    res.status(200).json({ essays });
  }
);

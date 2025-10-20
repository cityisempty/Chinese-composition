import { EssayStatus, ReviewerType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/appError";
import {
  generateAiFeedback,
  generateDraftEssay,
  reviseEssayDraft,
} from "@/services/essayGenerator";

interface EssayInput {
  userId: string;
  gradeLevel: string;
  essayType: string;
  requirements: string;
  prompt: string;
}

export const createEssayDraft = async (input: EssayInput) => {
  const draft = generateDraftEssay(input);

  const essay = await prisma.essay.create({
    data: {
      userId: input.userId,
      gradeLevel: input.gradeLevel,
      essayType: input.essayType,
      requirements: input.requirements,
      prompt: input.prompt,
      aiDraft: draft,
      currentText: draft,
      status: EssayStatus.DRAFT,
      revisions: {
        create: {
          reviewer: ReviewerType.AI,
          feedback: "初始 AI 草稿，包含常見語病與結構問題，請學生進行批改。",
          revisedText: draft,
          iteration: 0,
        },
      },
    },
    include: {
      revisions: true,
    },
  });

  return essay;
};

export const getEssayForUser = async (essayId: string, userId: string) => {
  return prisma.essay.findFirst({
    where: {
      id: essayId,
      userId,
    },
    include: {
      revisions: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
};

export const addStudentReview = async (
  essayId: string,
  userId: string,
  rating: number,
  feedback: string
) => {
  const essay = await getEssayForUser(essayId, userId);

  if (!essay) {
    throw new Error("Essay not found");
  }

  const nextIteration = essay.revisions.length;

  const updated = await prisma.essay.update({
    where: { id: essayId },
    data: {
      studentRating: rating,
      status: EssayStatus.REVIEWING,
      revisions: {
        create: {
          reviewer: ReviewerType.STUDENT,
          feedback,
          rating,
          iteration: nextIteration,
        },
      },
    },
    include: {
      revisions: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return updated;
};

export const reviseEssay = async (
  essayId: string,
  userId: string,
  instructions: string
) => {
  const essay = await getEssayForUser(essayId, userId);

  if (!essay) {
    throw new Error("Essay not found");
  }

  const nextIteration = essay.revisions.length;

  const revisedText = reviseEssayDraft({
    gradeLevel: essay.gradeLevel,
    essayType: essay.essayType,
    requirements: essay.requirements,
    prompt: essay.prompt,
    previousEssay: essay.currentText,
    instructions,
    iteration: nextIteration,
  });

  const updated = await prisma.essay.update({
    where: { id: essayId },
    data: {
      currentText: revisedText,
      revisions: {
        create: {
          reviewer: ReviewerType.AI,
          feedback: `根據學生的指示進行修訂：${instructions}`,
          revisedText,
          iteration: nextIteration,
        },
      },
    },
    include: {
      revisions: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return updated;
};

export const listEssaysForUser = async (userId: string) => {
  return prisma.essay.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      gradeLevel: true,
      essayType: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      studentRating: true,
      aiRating: true,
    },
  });
};

export const finalizeEssay = async (essayId: string, userId: string) => {
  const essay = await getEssayForUser(essayId, userId);

  if (!essay) {
    throw new Error("Essay not found");
  }

  const evaluation = generateAiFeedback(essay.currentText);

  const updated = await prisma.essay.update({
    where: { id: essayId },
    data: {
      aiRating: evaluation.score,
      aiCommentary: evaluation.commentary,
      status: EssayStatus.COMPLETED,
      revisions: {
        create: {
          reviewer: ReviewerType.AI,
          feedback: `AI 評語（編號 ${evaluation.referenceId}）：\n${evaluation.commentary}`,
          rating: evaluation.score,
          iteration: essay.revisions.length,
        },
      },
    },
    include: {
      revisions: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return updated;
};

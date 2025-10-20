import { z } from "zod";

const emptyQuery = z.object({}).optional();

export const essayGenerateSchema = z.object({
  body: z.object({
    gradeLevel: z.string().min(1),
    essayType: z.string().min(1),
    requirements: z.string().min(1),
    prompt: z.string().min(1),
  }),
  params: z.object({}).optional(),
  query: emptyQuery,
});

export const essayReviewSchema = z.object({
  params: z.object({
    essayId: z.string().cuid(),
  }),
  body: z.object({
    rating: z.number().min(0).max(100),
    feedback: z.string().min(1),
  }),
  query: emptyQuery,
});

export const essayReviseSchema = z.object({
  params: z.object({
    essayId: z.string().cuid(),
  }),
  body: z.object({
    instructions: z.string().min(1),
  }),
  query: emptyQuery,
});

export const essayFinalizeSchema = z.object({
  params: z.object({
    essayId: z.string().cuid(),
  }),
  body: z.object({}).optional(),
  query: emptyQuery,
});

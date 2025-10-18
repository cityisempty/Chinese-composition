import { z } from "zod";

const emptyParams = z.object({}).optional();

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    fullName: z.string().min(1),
    gradeLevel: z.string().optional(),
  }),
  params: emptyParams,
  query: emptyParams,
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
  params: emptyParams,
  query: emptyParams,
});

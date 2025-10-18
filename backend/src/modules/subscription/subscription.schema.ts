import { z } from "zod";

const emptyObject = z.object({}).optional();

export const subscriptionUpdateSchema = z.object({
  body: z.object({
    plan: z.enum(["FREE", "PRO", "TEAM"]),
  }),
  params: emptyObject,
  query: emptyObject,
});

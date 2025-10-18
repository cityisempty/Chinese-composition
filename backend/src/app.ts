import cors from "cors";
import express from "express";

import { env } from "@/config/env";
import { errorHandler } from "@/middleware/errorHandler";
import { authRouter } from "@/modules/auth/auth.routes";
import { essayRouter } from "@/modules/essays/essay.routes";
import { subscriptionRouter } from "@/modules/subscription/subscription.routes";

export const createApp = () => {
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/auth", authRouter);
  app.use("/subscriptions", subscriptionRouter);
  app.use("/essays", essayRouter);

  app.use(errorHandler);

  return app;
};

export const app = createApp();

export const config = {
  port: env.PORT,
};

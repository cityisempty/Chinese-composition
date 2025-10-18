import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      res.status(400).json({
        message: "Invalid request",
        issues: result.error.flatten(),
      });
      return;
    }

    const { body, params, query } = result.data as {
      body?: unknown;
      params?: unknown;
      query?: unknown;
    };

    if (typeof body !== "undefined") {
      req.body = body;
    }

    if (typeof params !== "undefined") {
      req.params = params as Record<string, string>;
    }

    if (typeof query !== "undefined") {
      req.query = query as Record<string, string>;
    }

    next();
  };

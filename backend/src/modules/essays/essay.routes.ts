import { Router } from "express";

import { authenticate } from "@/middleware/authenticate";
import { validateRequest } from "@/middleware/validateRequest";
import {
  finalizeEssayController,
  generateEssay,
  getEssay,
  listEssays,
  reviewEssay,
  reviseEssayController,
} from "@/modules/essays/essay.controller";
import {
  essayFinalizeSchema,
  essayGenerateSchema,
  essayReviewSchema,
  essayReviseSchema,
} from "@/modules/essays/essay.schema";

const router = Router();

router.use(authenticate);
router.get("/", listEssays);
router.get("/:essayId", validateRequest(essayFinalizeSchema), getEssay);
router.post("/generate", validateRequest(essayGenerateSchema), generateEssay);
router.post("/:essayId/review", validateRequest(essayReviewSchema), reviewEssay);
router.post("/:essayId/revise", validateRequest(essayReviseSchema), reviseEssayController);
router.post(
  "/:essayId/finalize",
  validateRequest(essayFinalizeSchema),
  finalizeEssayController
);

export const essayRouter = router;

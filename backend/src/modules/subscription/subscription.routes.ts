import { Router } from "express";

import { authenticate } from "@/middleware/authenticate";
import { validateRequest } from "@/middleware/validateRequest";
import {
  currentSubscription,
  updateSubscription,
} from "@/modules/subscription/subscription.controller";
import { subscriptionUpdateSchema } from "@/modules/subscription/subscription.schema";

const router = Router();

router.use(authenticate);
router.get("/current", currentSubscription);
router.post("/update", validateRequest(subscriptionUpdateSchema), updateSubscription);

export const subscriptionRouter = router;

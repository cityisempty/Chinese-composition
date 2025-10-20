import { Router } from "express";

import { authenticate } from "@/middleware/authenticate";
import { validateRequest } from "@/middleware/validateRequest";
import { login, me, register } from "@/modules/auth/auth.controller";
import { loginSchema, registerSchema } from "@/modules/auth/auth.schema";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.get("/me", authenticate, me);

export const authRouter = router;

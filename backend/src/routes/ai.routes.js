import { Router } from "express";
const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateprompt } from "../middlewares/ai.middleware.js";
import { chatresponse } from "../controllers/ai.controller.js";
import aiRateLimit from "../middlewares/reteLimit.middleware.js";
router.route("/generate").post(verifyJWT,aiRateLimit,validateprompt,chatresponse);

export default router;
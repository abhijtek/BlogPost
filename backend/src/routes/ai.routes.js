import { Router } from "express";
const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateprompt } from "../middlewares/ai.middleware.js";
import { chatresponse } from "../controllers/ai.controller.js";
import aiRateLimit from "../middlewares/reteLimit.middleware.js";
import { askBlogQuestion } from "../controllers/ai.controller.js";
router.route("/generate").post(verifyJWT,aiRateLimit,validateprompt,chatresponse);
router.route("/blogs/:blogId/chat").post(
    verifyJWT,aiRateLimit,validateprompt,askBlogQuestion
);
export default router;
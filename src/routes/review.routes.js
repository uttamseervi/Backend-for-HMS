import { createReview } from "../controllers/reviews.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { Router } from "express"

const router = Router();
router.route("/post-review").post(verifyJwt, createReview)

export default router
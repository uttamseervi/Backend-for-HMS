import { createReview, getAllReviews } from "../controllers/reviews.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { Router } from "express"

const router = Router();
router.route("/post-review").post(createReview)
router.route("/get-reviews").get(getAllReviews)

export default router
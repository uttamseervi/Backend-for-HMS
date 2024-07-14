import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Router } from "express"
import { paymentInfo } from "../controllers/payment.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router();
router.route("/user-payment").post(verifyJwt, paymentInfo)

export default router

import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Router } from "express"
import { createPayment, getPaymentInfo, getAmountInfo } from "../controllers/payment.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router();
// router.route("/user-payment").post(verifyJwt, paymentInfo)
router.route("/pay").post(verifyJwt, createPayment)
router.route("/paymentInfo").get(verifyJwt, getPaymentInfo)
router.route("/amountInfo").get(verifyJwt, getAmountInfo)

export default router

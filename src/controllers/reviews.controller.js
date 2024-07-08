import Review from "../models/reviews.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createReview = asyncHandler(async (req, res) => {
    const { fullName, rating, message, email } = req.body;

    if ([fullName, rating, message, email].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All the fields are required");
    }

    const review = await Review.create({
        fullName,
        email,
        rating,
        message,
    });

    if (!review) {
        throw new ApiError(400, "Failed to generate the Review");
    }

    return res.status(200).json(new ApiResponse(200, review, "Review created Successfully"));
});

export { createReview };

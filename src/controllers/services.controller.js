import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Service from "../models/services.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createService = asyncHandler(async (req, res) => {
    const { serviceType, servicePrice, serviceImage, serviceDescription, timeSlots } = req.body;
    if ([serviceType, servicePrice, serviceImage, serviceDescription, timeSlots].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All the fields are compulsory");
    }

    const serviceImageLocalPath = req?.file?.path;
    if (!serviceImageLocalPath) {
        throw new ApiError(400, "Failed to fetch the image");
    }

    const serviceImageUrl = await uploadOnCloudinary(serviceImageLocalPath);
    if (!serviceImageUrl || !serviceImageUrl.url) {
        throw new ApiError(400, "Failed to fetch the image from cloudinary");
    }

    const service = await Service.create({
        serviceType,
        servicePrice,
        serviceImage: serviceImageUrl.url,
        serviceDescription,
        timeSlots
    });

    if (!service) {
        throw new ApiError(400, "Failed to create the service");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, "Service created successfully", service));
});

export {
    createService
};

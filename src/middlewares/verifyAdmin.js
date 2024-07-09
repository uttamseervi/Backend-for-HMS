import jwt from "jsonwebtoken"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import Admin from "../models/admin.models.js"

const verifyAdmin = async () => {
    const token = req.cookie.accessToken || req.header("Authorization").replace("Bearer ", "")
    if (!token) throw new ApiError(400, "Invalid Access Token ");
    try {
        const decodedToken = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);
        if (!decodedToken) throw new ApiError(400, "Failed to decode the token");

        const admin = await Admin.findOne({ _id: decodedToken._id }).select("-password -refreshToken");
        if (!admin) throw new ApiError(400, "Failed to fetch the admin info");

        req.admin = admin;
        next();
    } catch (error) {
        throw new ApiError(400, "Failed to verify the Admin");
    }
}

export {
    verifyAdmin
}

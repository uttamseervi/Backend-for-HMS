import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import Admin from "../models/admin.models.js";

const verifyAdmin = async (req, res, next) => {
    try {
        let token;

        if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        } else if (req.header("Authorization")) {
            const authHeader = req.header("Authorization");

            // Ensure the header is in the correct format
            if (!authHeader.startsWith("Bearer ")) {
                throw new ApiError(400, "Invalid Authorization header format");
            }

            token = authHeader.replace("Bearer ", "");
        } else {
            throw new ApiError(400, "No token provided");
        }

        if (!token) throw new ApiError(400, "Invalid Access Token");

        const decodedToken = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);
        if (!decodedToken) throw new ApiError(400, "Failed to decode the token");

        const admin = await Admin.findOne({ _id: decodedToken._id }).select("-password -refreshToken");
        if (!admin) throw new ApiError(400, "Failed to fetch the admin info");

        req.admin = admin;
        next();
    } catch (error) {
        next(new ApiError(400, "Failed to verify the Admin"));
    }
};

export {
    verifyAdmin
};

import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";

export const verifyJwt = async (req, res, next) => {
    try {
        let token = req.cookies?.accessToken || "";
        console.log("The accessToken is: ", token)

        // Check if token is provided in headers
        if (!token) {
            const authHeader = req.header("Authorization");
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.replace("Bearer ", "");
                console.log("the token from the header is : ", token)
            }
        }

        if (!token) {
            throw new ApiError(401, "Unauthorized Request");
        }

        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message, "Invalid access token");
    }
};

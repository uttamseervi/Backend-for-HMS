import Admin from "../models/admin.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

const generateTokens = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId);
        const refreshToken = await admin.generateRefreshToken();
        const accessToken = await admin.generateAccessToken();
        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating the tokens");
    }
};

const createAdmin = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body;
    if ([username, password, email].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are compulsory");
    }
    const existedAdmin = await Admin.findOne({ email });
    if (existedAdmin) throw new ApiError(400, "Admin already exists, please login.");

    const admin = await Admin.create({
        username,
        password,
        email,
    });
    if (!admin) throw new ApiError(400, "Failed to create the admin");

    const { accessToken, refreshToken } = await generateTokens(admin._id);
    console.log("accessToken from the admin is: ",accessToken)
    console.log("refreshToken  from the admin is: ",refreshToken)


    const createdAdmin = await Admin.findById(admin._id).select("-password -refreshToken");


    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
        })
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
        })
        .json(new ApiResponse(200, createdAdmin, "Admin created and logged in successfully"));
});

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new ApiError(400, "All fields are compulsory");

    const admin = await Admin.findOne({ email });
    if (!admin) throw new ApiError(400, "Admin not found");

    const isPasswordValid = await admin.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(400, "Password is Incorrect");

    const { accessToken, refreshToken } = await generateTokens(admin._id);
    console.log("accessToken from the admin is: ",accessToken)
    console.log("refreshToken  from the admin is: ",refreshToken)

    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, loggedInAdmin, "Admin logged in Successfully"));
});

const logoutAdmin = asyncHandler(async (req, res) => {
    const admin = await Admin.findByIdAndUpdate(
        req.admin._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );
    if (!admin) throw new ApiError(404, "Failed to find the admin");
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Admin logged out successfully"));
});

export { createAdmin, loginAdmin, logoutAdmin };

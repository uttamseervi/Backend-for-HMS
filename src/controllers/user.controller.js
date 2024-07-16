import Room from "../models/room.models.js";
import User from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { isValidObjectId } from "mongoose";
// import { generateAccessToken, generateRefreshToken } from "../utils/tokenGenerator.js"; // Import token generation functions

const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const refreshToken = await user.generateRefreshToken();
        const accessToken = await user.generateAccessTokens();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating the tokens");
    }
};

const createUser = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body;
    if ([username, password, email].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are compulsory");
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) {
        throw new ApiError(400, "User already exists, please login.");
    }

    const user = await User.create({
        username,
        password,
        email,
    });

    const { accessToken, refreshToken } = await generateTokens(user._id);
    console.log("The access token from user controller register is :", accessToken)
    console.log("The refresh token from user controller register is :", refreshToken)

    const options = {
        httpOnly: true,
        secure: true,
    };

    res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, user, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "All fields are compulsory");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);
    console.log("The access token from user controller is :", accessToken)
    console.log("The refresh token from user controller is :", refreshToken)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    };

    res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
});

const allocateRoom = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const user = req.user;

    if (!isValidObjectId(roomId)) {
        throw new ApiError(400, "Invalid ObjectId format");
    }

    const loggedInUser = await User.findById(user._id);
    if (!loggedInUser) {
        throw new ApiError(400, "User not found");
    }

    const room = await Room.findById(roomId);
    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    loggedInUser.allocatedRoom = room._id;
    room.allocatedTo = loggedInUser._id;

    await loggedInUser.save();
    await room.save();

    return res.status(200).json(new ApiResponse(200, { loggedInUser, room }, "Room allocated successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(400, "User not found");
    }
    console.log()

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, user, "User logged out successfully"));
});

export { createUser, loginUser, logoutUser, allocateRoom };

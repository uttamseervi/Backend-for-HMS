import Room from "../models/room.models.js";
import User from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { isValidObjectId } from "mongoose";


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
    // console.log("The access token from user controller register is :", accessToken)
    // console.log("The refresh token from user controller register is :", refreshToken)

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
    // console.log("The access token from user controller is :", accessToken)
    // console.log("The refresh token from user controller is :", refreshToken)
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

const allocateRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { checkInTime, checkOutTime } = req.body;
        const loggedInUserId = req.user._id;

        if (!isValidObjectId(roomId)) {
            return res.status(400).json({ error: 'Invalid ObjectId format' });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            throw new ApiError(404, "Room not found");
        }

        const checkIn = new Date(checkInTime);
        const checkOut = new Date(checkOutTime);
        const roomPrice = room.cost;


        if (checkOut <= checkIn || isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
            throw new ApiError(400, "Invalid date range: checkOutTime must be after checkInTime");
        }


        if (room.allocatedTo) {
            throw new ApiError(400, "Room is already allocated");
        }

        const updatedRoom = await Room.findByIdAndUpdate(roomId, {
            checkInTime: checkIn,
            checkOutTime: checkOut,
            allocatedTo: loggedInUserId,
        }, { new: true });

        if (!updatedRoom) {
            throw new ApiError(404, "Room update failed");
        }

        const updatedUser = await User.findByIdAndUpdate(loggedInUserId, {
            allocatedRoom: roomId,
        }, { new: true });

        if (!updatedUser) {
            throw new ApiError(404, "User update failed");
        }

        res.status(200).json({ message: 'Room allocated successfully', room: updatedRoom });
    } catch (error) {
        console.error('Allocation failed:', error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Allocation failed' });
        }
    }
};




const deAllocateRoom = asyncHandler(async (req, res) => {
    try {
        const roomId = req.body.roomId;
        const room = await Room.findById(roomId);

        if (!room) {
            throw new ApiResponse(404, null, "Room not found");
        }

        const user = await User.findOne({ allocatedRoom: room._id });

        if (user) {
            user.allocatedRoom = null;
            user.paymentId = null;
            await user.save();
        }

        room.allocatedTo = null;
        room.paymentId = null;
        room.checkInTime = null;
        room.checkOutTime = null;
        await room.save();

        return res.status(200).json(new ApiResponse(200, room, "Room deallocated successfully"));
    } catch (error) {

        throw new ApiResponse(500, null, "An error occurred while deallocating the room");
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(400, "User not found");
    }


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


export { createUser, loginUser, logoutUser, allocateRoom, deAllocateRoom };

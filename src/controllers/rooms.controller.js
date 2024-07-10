import mongoose from 'mongoose';
import Room from "../models/room.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const createRoom = asyncHandler(async (req, res) => {
    const { cost, roomImage, title, roomInfo, roomType } = req.body;
    // the below line is not working please check it later
    // if ([cost, roomImage, title, roomInfo, roomType].some((field) => !field || field.trim() === "")) throw new ApiError(400, "All the fields are compulsory");
    const existedRoom = await Room.findOne({ title });
    if (existedRoom) throw new ApiError(400, "Room with this title already exists");

    const roomImageLocalPath = req.file?.path
    console.log("Local path of the roomImage is ->", roomImageLocalPath)
    if (!roomImageLocalPath) throw new ApiError(400, "Failed to fetch the localPath of the image");

    const roomImageUrl = await uploadOnCloudinary(roomImageLocalPath)
    if (!roomImageUrl) throw new ApiError(400, "Error while uploading the image of the room ");

    const room = await Room.create({
        roomType,
        title,
        roomInfo,
        cost,
        roomImage: roomImageUrl.url
    });
    if (!room) throw new ApiError(400, "Failed to create a room, try again later");

    return res
        .status(201)
        .json(new ApiResponse(201, room, "Room created successfully"));
});

const deleteRoom = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id || !mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid ID");

    const room = await Room.findByIdAndDelete(id);
    if (!room) throw new ApiError(400, "Room not found");

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Room deleted successfully"));
});

export { createRoom, deleteRoom };

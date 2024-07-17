import mongoose from 'mongoose';
import Room from "../models/room.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const createRoom = asyncHandler(async (req, res) => {
    const { cost, roomImage, roomInfo, roomType } = req.body;
    // the below line is not working please check it later
    // if ([cost, roomImage, title, roomInfo, roomType].some((field) => !field || field.trim() === "")) throw new ApiError(400, "All the fields are compulsory");
    // const existedRoom = await Room.findOne({  });
    // if (existedRoom) throw new ApiError(400, "Room with this title already exists");

    const roomImageLocalPath = req.file?.path
    console.log("Local path of the roomImage is ->", roomImageLocalPath)
    if (!roomImageLocalPath) throw new ApiError(400, "Failed to fetch the localPath of the image");

    const roomImageUrl = await uploadOnCloudinary(roomImageLocalPath)
    if (!roomImageUrl) throw new ApiError(400, "Error while uploading the image of the room ");

    const room = await Room.create({
        roomType,

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

const getAllRooms = asyncHandler(async (req, res) => {
    const rooms = await Room.find()
    if (!rooms || rooms.length === 0) throw new ApiError(400, "No rooms found");
    
    return res
    .status(200)
    .json(new ApiResponse(200, rooms, "Rooms fetched successfully"));

})

export { createRoom, deleteRoom,getAllRooms };


/*
Using a plain object for form data, including files, does not work for file uploads because plain objects cannot properly handle file data. Instead, files must be sent as part of a FormData object to handle multipart form uploads, which is necessary for the server to correctly interpret the file data.

When sending a file via a POST request, FormData allows you to mix regular form fields and file data. Here's why a plain object doesn't work and FormData does:

    File Handling: Plain objects cannot store file data properly. The file object is a complex data type that requires specific handling to preserve its binary data.
    Content-Type Header: When using plain objects, the Content-Type is typically set to application/json, which doesn't support file uploads. FormData sets the Content-Type to multipart/form-data, which is necessary for file uploads.

Here’s a quick summary of why FormData works and plain objects don’t:

    File data: Files are not correctly handled and serialized in plain objects.
    Content-Type: The Content-Type header needs to be multipart/form-data, which FormData handles automatically.
*/
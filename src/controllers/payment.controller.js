import User from "../models/user.models.js";
import Room from "../models/room.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

const paymentInfo = asyncHandler(async (req, res, next) => {
    const user = req.user;
    const loggedInUser = await User.findById(user._id);
    // Fetch the room details using an aggregation pipeline
    const roomDetails = await User.aggregate([
        {
            $match: { _id: loggedInUser._id }
        },
        {
            $lookup: {
                from: "rooms",
                localField: "allocatedRoom",
                foreignField: "_id",
                as: "userRoomDetails"
            }
        },
        {
            $unwind: "$userRoomDetails"
        },
        {
            $addFields: {
                roomInfo: "$userRoomDetails"
            }
        }
    ]);

    // Check if room details were found
    if (!roomDetails || roomDetails.length === 0) {
        throw new ApiError(404, "Failed to fetch room details");
    }

    const roomInfo = roomDetails[0].roomInfo;
    const roomPrice = roomInfo.cost;

    if (!roomPrice) {
        throw new ApiError(500, "Failed to fetch the price of the room");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { roomInfo, roomPrice }, "Room price fetched successfully"));
});

export {
    paymentInfo
};

/*
import User from "../models/user.models.js";
import Room from "../models/room.models.js";
import Payment from "../models/payment.models.js"; // Assuming you have a Payment model
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

const processPayment = asyncHandler(async (req, res, next) => {
  const user = req.user;

  // Fetch room details including cost using aggregation pipeline
  const roomDetails = await User.aggregate([
    {
      $match: {
        _id: user._id // Match the user by _id
      }
    },
    {
      $lookup: {
        from: "rooms",
        localField: "allocatedRoom",
        foreignField: "_id",
        as: "userRoomDetails"
      }
    },
    {
      $addFields: {
        roomInfo: {
          $arrayElemAt: ["$userRoomDetails", 0]
        }
      }
    }
  ]);

  if (!roomDetails || roomDetails.length === 0) {
    throw new ApiError(404, "Failed to fetch room details");
  }

  const roomInfo = roomDetails[0].roomInfo;
  const roomPrice = roomInfo.cost;

  if (!roomPrice) {
    throw new ApiError(500, "Failed to fetch the price of the room");
  }

  // Simulate successful payment
  const payment = await Payment.create({
    user: user._id,
    room: roomInfo._id,
    amount: roomPrice,
    status: "success", // Simulating a successful payment
    // Add more fields as needed (e.g., transaction ID, payment method)
  });

  return res.status(200).json(new ApiResponse(200, payment, "Payment processed successfully"));
});

export default processPayment;

*/
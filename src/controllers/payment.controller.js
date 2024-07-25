import User from "../models/user.models.js";
import Room from "../models/room.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import Payment from "../models/payment.models.js";
import { isValidObjectId } from "mongoose";


const getAmountInfo = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId || !isValidObjectId(userId)) throw new ApiError(400, "Failed to get the user");
  const loggedInUser = await User.findById(userId);
  if (!loggedInUser) throw new ApiError(400, "Failed to get the userInfo");
  const room = await Room.findById(loggedInUser.allocatedRoom);
  if (!room) throw new ApiError(400, "Failed to fetch the room Details");

  const userRoom = await User.aggregate([
    {
      $match: { _id: userId }
    },
    {
      $lookup: {
        from: "rooms",
        localField: "allocatedRoom",
        foreignField: "_id",
        as: "roomInfo"
      }
    },
    {
      $unwind: "$roomInfo"
    }
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, userRoom, "Fetched the details of the user and room successfully"))

})


const createPayment = asyncHandler(async (req, res, next) => {
  const { cardType, cardNumber, month, year, cardCvv, cost } = req.body;
  const user = req.user;

  const roomDetails = await User.aggregate([
    {
      $match: { _id: user._id }
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

  if (!roomDetails || roomDetails.length === 0) {
    throw new ApiError(404, "Failed to fetch room details");
  }
  const room = roomDetails[0].roomInfo
  // console.log(room)
  const payment = await Payment.create({
    user: user._id,
    roomId: room._id,
    cost,
    cardType: cardType,
    cardNumber: cardNumber,
    month: month,
    year: year,
    cardCvv: cardCvv
  });

  if (!payment) throw new ApiError(400, "Payment Failed");

  user.paymentId = payment._id;
  await user.save();

  room.paymentId = payment._id;
  await Room.findByIdAndUpdate(room._id, { paymentId: payment._id });

  payment.roomId = room._id;
  await payment.save();

  const userPayment = await Payment.findById(payment._id).select("-cardCvv -cardNumber");

  return res.status(200).json(new ApiResponse(200, { userPayment, cost, username: user.username }, "Payment processed successfully"));
});

const getPaymentInfo = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { roomId } = req.params;
  if (!userId || !isValidObjectId(userId)) throw new ApiError(400, "Invalid User");

  const roomDetails = await User.aggregate([
    {
      $match: { _id: userId }
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


  const room = roomDetails[0].roomInfo
  console.log(room)
  const cost = room.cost;


  const payment = await Payment.findOne({ user: userId, roomId: roomId }).sort({ createdAt: -1 }).select("-cardCvv -cardNumber");
  if (!payment) throw new ApiError(400, "Failed to fetch the payment details");

  return res.status(200).json(new ApiResponse(200, { payment, cost }, "Payment details fetched"));
});

export {
  createPayment,
  getPaymentInfo,
  getAmountInfo
};

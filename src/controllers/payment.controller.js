import User from "../models/user.models.js";
import Room from "../models/room.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import Payment from "../models/payment.models.js";
import { isValidObjectId } from "mongoose";

const createPayment = asyncHandler(async (req, res, next) => {
  const { cardType, cardNumber, month, year, cardCvv } = req.body;
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

  const roomInfo = roomDetails[0].roomInfo;
  const cost = roomInfo.cost;

  const payment = await Payment.create({
    user: user._id,
    roomId: roomInfo._id,
    amount: cost,
    cardType: cardType,
    cardNumber: cardNumber,
    month: month,
    year: year,
    cardCvv: cardCvv
  });

  if (!payment) throw new ApiError(400, "Payment Failed");

  user.paymentId = payment._id;
  await user.save();

  roomInfo.paymentId = payment._id;
  await Room.findByIdAndUpdate(roomInfo._id, { paymentId: payment._id });

  payment.roomId = roomInfo._id;
  await payment.save();

  const userPayment = await Payment.findById(payment._id).select("-cardCvv -cardNumber");

  return res.status(200).json(new ApiResponse(200, { userPayment, cost, username: user.username }, "Payment processed successfully"));
});

const getPaymentInfo = asyncHandler(async (req, res) => {
  const userId = req.user._id;
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
  const cost = room.cost;


  const payment = await Payment.findOne({ user: userId }).select("-cardCvv -cardNumber");
  if (!payment) throw new ApiError(400, "Failed to fetch the payment details");

  return res.status(200).json(new ApiResponse(200, { payment, cost }, "Payment details fetched"));
});

export {
  createPayment,
  getPaymentInfo
};

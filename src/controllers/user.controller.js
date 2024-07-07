import User from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { ApiError } from "../utils/apiError.js"

const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const refreshToken = await user.generateRefreshToken();
        const accessToken = await user.generateAccessTokens();
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating the tokens")
    }
}
const createUser = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body
    if ([username, password, email].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All the field are compulsory");
    }
    const existedUser = await User.findOne(
        {
            $or: [{ username }, { email }]
        }
    )
    if (existedUser) throw new ApiError(400, "User already exist please login...");
    const user = await User.create({
        username,
        password,
        email,
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    return res
        .status(200)
        .json(new ApiResponse(200, createdUser, "User created Successfully"))
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email && !password) throw new ApiError(400, "All the fields are compulsory ");

    const user = await User.findOne({ email })
    if (!user) throw new ApiResponse(400, "User not found")

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(400, "Password is Incorrect")

    const { accessToken, refreshToken } = await generateTokens(user._id);
    console.log("AccessToken is: ", accessToken)
    console.log("RefreshToken is: ", refreshToken)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, loggedInUser, "User logged in Successfully"))
})

const logoutUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    if (!user) throw new ApiError(404, "failed to find the user");
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully "))
})



export { createUser, loginUser, logoutUser }
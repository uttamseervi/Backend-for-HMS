import Contact from "../models/contact.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

const createContact = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phoneNumber, message } = req.body;
    console.log(firstName,lastName,email,phoneNumber,message)

    // if ([firstName, lastName, email, phoneNumber, message].some((field) => !field || field.trim() === "")) {
    //     throw new ApiError(400, "All the fields are compulsory");
    // }

    const contact = await Contact.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        message,
    });

    if (!contact) {
        throw new ApiError(400, "Failed to send a contact request");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, contact, "Contact request sent successfully"));
});

export { createContact };

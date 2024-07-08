import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    rating: {
        type: Number,
        required: true,
        min: [1, "Minimum rating is 1"],
        max: [5, "Maximum rating is 5"]
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;

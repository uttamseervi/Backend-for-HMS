import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Define the User schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true, // Removes whitespace from both ends
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures email is unique
        match: [/.+@.+\..+/, 'Please enter a valid email address'] // Validates email format
    },
    address: {
        type: String,
        // required: true,
        trim: true, // Removes whitespace from both ends
    },
    password: {
        type: String,
        required: true,
    },
    allocatedRoom: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    refreshToken: {
        type: String
    },
    checkInTime: {
        type: String,
        default: null, // Default value if not set
    },
    checkOutTime: {
        type: String,
        default: null, // Default value if not set
    },
    paymentId: {
        type: Schema.Types.ObjectId,
        ref: "Payment"
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to check if password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAccessTokens = async function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
const User = mongoose.model("User", userSchema);
export default User;

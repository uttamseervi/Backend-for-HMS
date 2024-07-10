import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true });

adminSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

adminSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

adminSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.ADMIN_ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ADMIN_ACCESS_TOKEN_EXPIRY
        }
    );
};

adminSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.ADMIN_REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.ADMIN_REFRESH_TOKEN_EXPIRY
        }
    );
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;

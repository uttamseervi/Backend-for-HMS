import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
const adminSchema = new Schema({
    userName: {
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

}, { timestamps: true })

adminSchema.pre("save", async (next) => {
    if (!isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})
adminSchema.methods.isPasswordCorrect = async (password) => {
    return await bcrypt.compare(password, this.password)
}
adminSchema.methods.generateAccessToken = async () => {
    return JsonWebTokenError.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.ADMIN_ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ADMIN_ACCESS_TOKEN_EXPIRY
        }
    )
}
adminSchema.methods.generateRefreshToken = async () => {
    return JsonWebTokenError.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.ADMIN_REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.ADMIN_REFRESH_TOKEN_EXPIRY
        }
    )
}

const Admin = mongoose.model("Admin", adminSchema)
export default Admin
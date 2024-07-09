import mongoose from "mongoose";

const { Schema } = mongoose;

const departmentSchema = new Schema({
    departmentName: {
        type: String,
        required: true,
    },
    numberOfEmployees: {
        type: Number,
        // required: true,
        default: 0,
    },
}, { timestamps: true });

const Department = mongoose.model("Department", departmentSchema);

export default Department;

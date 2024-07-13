import mongoose, { Schema } from "mongoose";

const employeeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    departmentId: {
        type: Schema.Types.ObjectId,
        ref: "Department"

    },
    salary: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;

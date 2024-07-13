import mongoose from "mongoose";

const { Schema } = mongoose;

const departmentSchema = new Schema({
    departmentName: {
        type: String,
        required: true,
    },
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: "Employee"
    },

}, { timestamps: true });

const Department = mongoose.model("Department", departmentSchema);

export default Department;

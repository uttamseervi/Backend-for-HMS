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
    designation:{
        type: String,
        required: true,
    },
    gender:{
        type:String,
        required: true,
    },
    department: {
        type: String,
        enum: ['Housekeeping', 'Front Desk', 'Maintenance', 'Food and Beverage', 'Administration'],
        required: true
    },
    salary: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;

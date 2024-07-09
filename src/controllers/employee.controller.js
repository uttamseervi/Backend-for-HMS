import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Employee from "../models/employee.models.js";
import mongoose from 'mongoose';

const createEmployee = asyncHandler(async (req, res) => {
    const { name, age, gender, department, designation, email, salary } = req.body;
    if ([name, age, gender, department, designation, email, salary].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All the fields are compulsory");
    }

    const employee = await Employee.create({
        name,
        age,
        gender,
        department,
        designation,
        email,
        salary
    });
    if (!employee) throw new ApiError(400, "Failed to create the Employee");

    return res
        .status(200)
        .json(new ApiResponse(200, employee, "Employee created Successfully"));
});

const deleteEmployee = asyncHandler(async (req, res) => {
    const { employeeId } = req.params;
    if (!employeeId || !mongoose.isValidObjectId(employeeId)) throw new ApiError(400, "Invalid employee ID");

    const employee = await Employee.findByIdAndDelete(employeeId);
    if (!employee) throw new ApiError(400, "Employee not found");

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Employee deleted Successfully"));
});

export {
    createEmployee,
    deleteEmployee
};

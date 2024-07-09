import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Department from "../models/department.models.js";
import mongoose from "mongoose";

const createDepartment = asyncHandler(async (req, res) => {
    const { departmentName } = req.body;
    if (!departmentName || departmentName.trim() === "") throw new ApiError(400, "Department name is required");

    const department = await Department.create({
        departmentName
    });
    if (!department) throw new ApiError(400, "Failed to create the department");

    return res
        .status(200)
        .json(new ApiResponse(200, department, "Department created successfully"));
});

const getAllDepartments = asyncHandler(async (req, res) => {
    const departments = await Department.find();
    if (!departments || departments.length === 0) throw new ApiError(500, "Failed to fetch all the departments");

    return res
        .status(200)
        .json(new ApiResponse(200, departments, "All the departments are fetched successfully"));
});

const deleteDepartment = asyncHandler(async (req, res) => {
    const { deptId } = req.params;
    if (!deptId || !mongoose.isValidObjectId(deptId)) throw new ApiError(400, "Invalid department ID");

    const department = await Department.findByIdAndDelete(deptId);
    if (!department) throw new ApiError(404, "Department not found");

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Department deleted successfully"));
});

export {
    createDepartment,
    getAllDepartments,
    deleteDepartment
};

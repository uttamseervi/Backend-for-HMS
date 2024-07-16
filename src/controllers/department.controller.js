import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Department from "../models/department.models.js";
import Employee from "../models/employee.models.js"
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
    // Fetch all departments
    const departments = await Department.find();
    if (!departments || departments.length === 0) {
        throw new ApiError(500, "Failed to fetch all the departments");
    }

    // Aggregate to get employee counts per department
    const employeeCount = await Employee.aggregate(
        [
            {
                $lookup: {
                    from: "departments",
                    localField: "departmentId",
                    foreignField: "_id",
                    as: "result"
                }
            },
            {
                $group: {
                    _id: "$result.departmentName",
                    totalEmp: {
                        $sum: 1
                    }
                }
            },
            {
                $addFields: {
                    departmentName: {
                        $first: "$_id"
                    }
                }
            }
        ]
    );
    // console.log(employeeCount)
    // Check if employeeCount has data
    if (!employeeCount || employeeCount.length === 0) {
        throw new ApiError(400, "Failed to fetch the employee counts");
    }


    return res.status(200).json(new ApiResponse(200, { departments, employeeCount }, "All departments and employee counts fetched successfully"));
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

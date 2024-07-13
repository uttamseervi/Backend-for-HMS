import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Employee from "../models/employee.models.js";
import Department from "../models/department.models.js"

import mongoose, { isValidObjectId } from 'mongoose';

const createEmployee = asyncHandler(async (req, res) => {
    const { departmentId, name, age, gender, designation, email, salary } = req.body;
    if ([departmentId, name, age, gender, designation, email, salary].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All the fields are compulsory");
    }

    const employee = await Employee.create({
        name,
        age,
        gender,
        departmentId,
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
const assignDepartment = asyncHandler(async (req, res) => {
    const { departmentName } = req.body;
    const { employeeId } = req.params;

    if (!departmentName || !employeeId) {
        throw new ApiError(400, "All the fields are required");
    }

    if (!isValidObjectId(employeeId)) {
        throw new ApiError(400, "Invalid employee ID");
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
        throw new ApiError(400, "Employee not found");
    }

    employee.department = departmentName;
    await employee.save();

    return res
        .status(200)
        .json(new ApiResponse(200, employee, "Department assigned Successfully"));
});

const getAllEmployees = asyncHandler(async (req, res) => {
    const { departmentId } = req.params;
    if (!departmentId || !mongoose.isValidObjectId(departmentId)) throw new ApiError(400, "Invalid department ID");
    /*const departmentDetails = await Employee.aggregate([

        {
            $lookup: {
                from: "departments",
                localField: "departmentId",
                foreignField: "_id",
                as: "result"
            }
        },
        {
            $match: departmentId
        },
        {
            $addFields: {
                departmentInfo: "$result"
            }
        }
    ])*/
    // console.log(departmentDetails)


    const employees = await Employee.find({ departmentId });
    if (!employees) throw new ApiError(400, "Employees not found");
    return res.status(200).json(new ApiResponse(200, employees, "Employees fetched Successfully"));
})



export {
    createEmployee,
    deleteEmployee,
    assignDepartment,
    getAllEmployees
};

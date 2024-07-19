import { createEmployee, deleteEmployee, getAllEmployees } from "../controllers/employee.controller.js"
import { Router } from "express"
import { verifyAdmin } from "../middlewares/verifyAdmin.js"


const router = Router();

router.route("/add-employee").post(verifyAdmin, createEmployee);
router.route("/remove-employee/:employeeId").delete(verifyAdmin, deleteEmployee)
router.route("/get-all-employees/:departmentId").get(verifyAdmin, getAllEmployees)



export default router
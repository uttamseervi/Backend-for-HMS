import { createEmployee, deleteEmployee, getAllEmployees } from "../controllers/employee.controller.js"
import { Router } from "express"
import { verifyAdmin } from "../middlewares/verifyAdmin.js"


const router = Router();

router.route("/add-employee").post(createEmployee);
router.route("/remove-employee/:employeeId").delete(deleteEmployee)
router.route("/get-all-employees/:departmentId").get(getAllEmployees)



export default router
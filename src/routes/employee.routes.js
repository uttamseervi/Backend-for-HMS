import { createEmployee, deleteEmployee } from "../controllers/employee.controller.js"
import { Router } from "express"
import { verifyAdmin } from "../middlewares/verifyAdmin.js"


const router = Router();

router.route("/add-employee").post(verifyAdmin, createEmployee);
router.route("/remove-employee").delete(verifyAdmin, deleteEmployee)




export default router
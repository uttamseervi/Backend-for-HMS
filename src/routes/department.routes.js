import { createDepartment, deleteDepartment, getAllDepartments } from "../controllers/department.controller.js"
import { Router } from "express"
import { verifyAdmin } from "../middlewares/verifyAdmin.js"


const router = Router();

router.route("/add-department").post(verifyAdmin, createDepartment);
router.route("/remove-department").delete(verifyAdmin, deleteDepartment);
router.route("/departments").get(verifyAdmin, getAllDepartments)




export default router
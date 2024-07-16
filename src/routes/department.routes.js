import { createDepartment, deleteDepartment, getAllDepartments } from "../controllers/department.controller.js"
import { Router } from "express"
import { verifyAdmin } from "../middlewares/verifyAdmin.js"


const router = Router();

router.route("/add-department").post(createDepartment);
router.route("/remove-department/:deptId").delete(deleteDepartment);
router.route("/departments").get(getAllDepartments)
// router.route("/new").get(verifyAdmin,)




export default router
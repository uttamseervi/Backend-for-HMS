import { createAdmin, loginAdmin, logoutAdmin } from "../controllers/admin.controller.js";
import { Router } from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { deAllocateRoom } from "../controllers/user.controller.js"

const router = Router();

router.route("/create-admin").post(createAdmin);
router.route("/login").post(loginAdmin);
router.route("/logout").get(verifyAdmin, logoutAdmin);

router.route("/deallocate-room").post(verifyAdmin, deAllocateRoom);

export default router;

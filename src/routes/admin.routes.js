import { createAdmin, loginAdmin, logoutAdmin } from "../controllers/admin.controller.js";
import { Router } from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = Router();

router.route("/create-admin").post(createAdmin);
router.route("/login").post(loginAdmin);
router.route("/logout").get(verifyAdmin, logoutAdmin); // Assuming verifyAdmin middleware is used here

export default router;

import { createUser, loginUser, logoutUser } from "../controllers/user.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { Router } from "express"

const router = Router();
router.route("/register").post(createUser);
router.route("/login").post(loginUser)
router.route("/logout").get(verifyJwt, logoutUser)





export default router
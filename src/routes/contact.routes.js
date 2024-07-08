import { createContact } from "../controllers/contact.controller.js";
import { Router } from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/send-message").post(verifyJwt, createContact)

export default router;
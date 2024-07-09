import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createRoom, deleteRoom } from "../controllers/rooms.controller.js";

const router = Router();

// Route to create a room
// Uses JWT verification middleware and multer middleware to handle file upload
router.route("/create").post(verifyJwt, upload.single("image"), createRoom);

// Route to delete a room
// Uses JWT verification middleware and expects roomId as a URL parameter
router.route("/delete/:roomId").delete(verifyJwt, deleteRoom);


export default router;

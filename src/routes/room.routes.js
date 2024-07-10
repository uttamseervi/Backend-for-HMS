import { Router } from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createRoom, deleteRoom } from "../controllers/rooms.controller.js";

const router = Router();

// Route to create a room
// Uses JWT verification middleware and multer middleware to handle file upload
router.route("/create-room").post(verifyAdmin, upload.single("roomImage"), createRoom);

// Route to delete a room
// Uses JWT verification middleware and expects roomId as a URL parameter
router.route("/delete/:roomId").delete(verifyAdmin, deleteRoom);


export default router;

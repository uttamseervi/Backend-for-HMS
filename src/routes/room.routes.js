import { Router } from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createRoom, deleteRoom, getAllRooms } from "../controllers/rooms.controller.js";

const router = Router();


router.route("/create-room").post(upload.single("roomImage"), createRoom);
router.route("/get-rooms").get(getAllRooms)
router.route("/delete/:roomId").delete(verifyAdmin, deleteRoom);


export default router;

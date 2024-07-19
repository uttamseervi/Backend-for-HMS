import { Router } from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    createRoom,
    deleteRoom,
    getLuxuryRooms,
    getPremiumRooms,
    getPresidentialRooms,
    findRoomById,
    getAllRooms,
    allocatedRooms,
    unAllocatedRooms
} from "../controllers/rooms.controller.js";

const router = Router();


router.route("/create-room").post(verifyAdmin, upload.single("roomImage"), createRoom);
router.route("/get-presidential-rooms").get(getPresidentialRooms)
router.route("/get-luxury-rooms").get(getLuxuryRooms)
router.route("/get-premium-rooms").get(getPremiumRooms)
router.route("/get-room/:roomId").get(findRoomById)
router.route("/get-all-rooms").get(verifyAdmin, getAllRooms)
router.route("/get-allocated-rooms").get(verifyAdmin, allocatedRooms)
router.route("/get-unallocated-room").get(verifyAdmin, unAllocatedRooms)
router.route("/delete/:roomId").delete(verifyAdmin, deleteRoom);


export default router;

import express from "express";
import { adminControllers } from "./admin.controller";
const router = express.Router();

router.get("/all-users", adminControllers.getAllUsersList);
router.get("/all-posts", adminControllers.getUsersPosts);
router.get("/all-appointments", adminControllers.getAllAppointments);
router.get(`/user-details/:id`, adminControllers.getUsersDetails);

export const adminRoutes = router;

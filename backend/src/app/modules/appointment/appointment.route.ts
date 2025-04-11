import express from "express";
import { appointmentController } from "./appointment.controller";
const router = express.Router();

router.post('/add-schedule', appointmentController.addNewAppointmentSchedule);
router.get(`/view/:id`, appointmentController.getAppointments);
router.patch('/update-status', appointmentController.updateAppointmentStatus);

export const appointmentRoutes = router;
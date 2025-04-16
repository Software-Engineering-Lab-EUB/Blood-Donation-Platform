import express from "express";
import { adminControllers } from "./admin.controller";
const router = express.Router();
//admin sign in
router.post("/sign-in", adminControllers.adminLogin);
// user management
router.get("/all-users", adminControllers.getAllUsersList);
router.get(`/user-details/:id`, adminControllers.getUsersDetails);
router.patch(`/update-user/:id`, adminControllers.updateUserDetails);
//posts management
router.get("/all-posts", adminControllers.getUsersPosts);
//appointment management
router.get("/all-appointments", adminControllers.getAllAppointments);
//campaign management
router.post("/add-campaign", adminControllers.addNewCampaign);
router.get(`/campaign-details/:id`, adminControllers.getCampaignDetails);
router.get("/all-campaigns", adminControllers.getCampaignsList);
router.patch(`/update-campaign/:id`, adminControllers.updateCampaign);
router.delete(`/delete-campaign/:id`, adminControllers.deleteCampaign);
//blood bank management
router.post("/add-blood-bank", adminControllers.addNewBloodBank);
router.get(`/blood-bank-details/:id`, adminControllers.getBloodBankDetails);
router.patch(`/update-blood-bank/:id`, adminControllers.updateBloodBank);
router.delete(`/delete-blood-bank/:id`, adminControllers.deleteBloodBank);
export const adminRoutes = router;

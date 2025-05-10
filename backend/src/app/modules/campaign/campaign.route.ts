import express from "express";
import { campaignControllers } from "./campaign.controller";

const router = express.Router();

router.get('/get-all', campaignControllers.getCampaignsList);

export const campaignRoutes = router;
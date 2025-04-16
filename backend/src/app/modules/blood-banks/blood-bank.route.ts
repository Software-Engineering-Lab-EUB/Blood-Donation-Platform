import express from "express";
import { bloodBankControllers } from "./blood-bank.controller";
const router = express.Router();

router.get('/get-all', bloodBankControllers.getBloodBanksLists);

export const bloodBankRoutes = router;

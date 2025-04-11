import express from "express";
import { postControllers } from "./post.controller";
const router = express.Router();

router.post('/create', postControllers.addBloodNeededPost);

export const postRoutes = router;
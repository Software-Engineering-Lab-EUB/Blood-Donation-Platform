import express from "express";
import { conversationControllers } from "./conversation.controller";

const router = express.Router();

router.get('/chat-room', conversationControllers.getConversationHistory);
router.post('/chat-room', conversationControllers.addNewMessage);
router.patch('/read-status', conversationControllers.updateMessageReadStatus);
router.get(`/unread-messages/:userId`, conversationControllers.getTotalUnreadCount);
export const conversationRoutes = router;
import mongoose, { model, Schema } from "mongoose";
import { TConversation } from "./conversation.interface";

const conversationSchema = new Schema<TConversation>({
  roomId: {
    type: String,
    required: true,
  },
  messages: [
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      message: {
        type: String,
      },
      isRead: {
        type: Boolean,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export const Conversation = model<TConversation>("Conversation", conversationSchema);
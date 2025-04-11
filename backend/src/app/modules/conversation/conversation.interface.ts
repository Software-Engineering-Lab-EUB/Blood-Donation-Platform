import { Types } from "mongoose";

export type TConversation = {
  roomId: string;
  messages: {
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    message: string;
    isRead: boolean;
    timestamp: Date;
  };
};

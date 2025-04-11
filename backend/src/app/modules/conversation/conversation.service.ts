import { User } from "../user/user.model";
import { Conversation } from "./conversation.model";

//get message history
const getRoomMessageHistory = async (roomId: string) => {
  const result = await Conversation.find({ roomId: roomId });
  return result;
};

//add new messages
const addNewMessages = async (roomId: string, message: any) => {
  const existingConversation = await Conversation.findOne({ roomId });

  if (existingConversation) {
    // Update message
    const result = await Conversation.updateOne(
      { roomId },
      { $push: { messages: message } }
    );
    return result;
  } else {
    //new conversation if roomId doesn't exist
    const newConversation : any = await Conversation.create({
      roomId,
      messages: [message],
    });
    console.log(newConversation);
    const senderId = newConversation.messages[0].senderId;
    const receiverId = newConversation.messages[0].receiverId;
    await User.findOneAndUpdate({_id:senderId} , {$push:{conversation:newConversation?._id}})
    await User.findOneAndUpdate({_id:receiverId} , {$push:{conversation:newConversation?._id}})
    return newConversation;
  }
};



// Update message read status
export const updateMessageReadStatus = async (
  roomId: string,
  userId: string
) => {
  try {
    // Find the conversation by roomId
    const conversation : any = await Conversation.findOne({ roomId });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const messagesToUpdate = conversation.messages.filter(
      (message : any) => message.receiverId.toString() === userId && !message.isRead
    );

    if (messagesToUpdate.length === 0) {
      throw new Error("No unread messages found for this user");
    }

    // Update all unread messages
    const updatedConversation = await Conversation.updateOne(
      { roomId },
      {
        $set: {
          "messages.$[elem].isRead": true,
        },
      },
      {
        arrayFilters: [
          {
            "elem.receiverId": userId, 
            "elem.isRead": false, 
          },
        ],
      }
    );

    if (updatedConversation.modifiedCount === 0) {
      throw new Error("No messages were updated");
    }

    return { success: true, message: "Messages marked as read" };
  } catch (error) {
    console.error("Error updating message read status:", error);
    return {
      success: false,
      message: error || "Internal server error",
    };
  }
};

//get unread message count
 const getTotalUnreadMessagesCount = async (userId: string) => {
  try {
    const conversations : any = await Conversation.find({
      "messages.receiverId": userId, 
    });

    if (!conversations.length) return 0; 

    let totalUnreadCount = 0;

    for (const conversation of conversations) {
      totalUnreadCount += conversation.messages.filter(
        (msg : any) => msg.receiverId.toString() === userId && !msg.isRead
      ).length;
    }

    return totalUnreadCount;
  } catch (error) {
    console.error("Error fetching total unread messages count:", error);
    return 0; 
  }
};


export const conversationServices = {
  getRoomMessageHistory,
  addNewMessages,
  updateMessageReadStatus,
  getTotalUnreadMessagesCount,
};

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { conversationServices } from "./conversation.service";

// get message history by room ID
const getConversationHistory = catchAsync(async (req, res) => {
  const roomId = req?.query?.roomId as string;
  if (!roomId) {
    sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "No chat found",
      data: null,
    });
  }
  const result = await conversationServices.getRoomMessageHistory(roomId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "conversation details found",
    data: result,
  });
});

//add new messages to chat
const addNewMessage = catchAsync(async (req, res) => {
  const { roomId, message } = req.body;
  console.log('req aise');
  console.log(roomId, ' ', message);

  if (!roomId || !message) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "roomId and message are required",
      data: null,
    });
  }

  const result = await conversationServices.addNewMessages(roomId, message);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Message stored successfully",
    data: result,
  });
});

//update message read status
const updateMessageReadStatus = catchAsync(async (req, res) => {
  const { roomId, userId } = req?.body;
  const result = await conversationServices.updateMessageReadStatus(roomId, userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Update read status",
    data:result
  })
})

//get unread messages count
export const getTotalUnreadCount = catchAsync(async (req,res) => {
    const userId = req.params.userId;
  const unreadCount = await conversationServices.getTotalUnreadMessagesCount(userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Unread messages count fetched successfully",
    data:unreadCount
  })
})


export const conversationControllers = {
  getConversationHistory,
  addNewMessage,
  updateMessageReadStatus,
  getTotalUnreadCount,
}
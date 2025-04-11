import { serverBaseUrl } from "@/app/utils/serverUrl";


//get chat lists
export const getUsersChatLists = async (email: string) => {
  try {
    const response = await fetch(`${serverBaseUrl}/user/chat-lists/${email}`);
    const data = await response.json();

    if (!data?.data) return [];

    const conversationArray = data.data.conversation;
    const payload = await fetch(`${serverBaseUrl}/user/user-id/${email}`);
    const payload_json = await payload.json();
    const self_id = payload_json?.data?._id;

    if (!self_id) return []; 

    const userFetchPromises = conversationArray
      .filter((chatList: any) => chatList?.messages?.length) 
      .map(async (chatList: any) => {
        const lastMessage = chatList.messages[chatList.messages.length - 1];
        const { senderId, receiverId, isRead, timestamp, message } =
          lastMessage;
        const roomId = chatList.roomId;

        const chatBuddyId = senderId === self_id ? receiverId : senderId;

        return fetch(`${serverBaseUrl}/user/profile-view/${chatBuddyId}`)
          .then((res) => res.json())
          .then((user_json) => ({
            ownMessage: senderId === self_id,
            chatBuddy: user_json?.data?.name,
            roomId,
            isRead,
            timestamp,
            messageData: message,
          }))
          .catch(() => null); 
      });

    //  Promise.allSettled to avoid complete failure
    const chatLists = (await Promise.allSettled(userFetchPromises))
      .filter((result) => result.status === "fulfilled" && result.value) 
      .map((result : any) => result.value);

    return chatLists;
  } catch (error) {
    console.error("Error fetching chat lists:", error);
    return [];
  }
};

//add new message in chat
export const addNewMessage = async (roomId: string, message: any) => {
  const response = await fetch(`${serverBaseUrl}/conversation/chat-room`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({roomId, message}),
  });
  const result = await response.json();
  return result;
}

//chat history of a room
export const getRoomChatHistory = async (roomId: string) => {
  const response = await fetch(`${serverBaseUrl}/conversation/chat-room?roomId=${roomId}`)
  const result = await response.json();
  return result;
}

//update message read status
export const updateMessageReadStatus = async (roomId:string, userId:string) => {
  const response = await fetch(`${serverBaseUrl}/conversation/read-status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomId, userId }),
  });
  const result = await response.json();
  return result;
}

//get unread message count
export const getUnreadMessagesCount = async (userId: string) => {
  const response = await fetch(`${serverBaseUrl}/conversation/unread-messages/${userId}`)
  const result = await response.json();
  return result;
}
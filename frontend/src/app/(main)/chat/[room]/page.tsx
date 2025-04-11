"use client";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import {
  addNewMessage,
  getRoomChatHistory,
  updateMessageReadStatus,
} from "@/service/chatService";
import Link from "next/link";
import { getUsersProfileInfo } from "@/service/userService";
import { useSocket } from "@/app/context/SocketProvider";

export default function Chat() {
  const router = useRouter();
  const { room } = useParams();
  const decodedRoom = room ? decodeURIComponent(room as string) : null;
  const socket = useSocket();
  const userEmail = Cookies.get("userEmail");
  const selfUserId = Cookies.get("selfId");
  const chatBuddyUserId = decodedRoom?.replace(selfUserId as string, "");

  const [selfSocketId, setSelfSocketId] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<
    {
      id?: string;
      msg: string;
      fromSelf: boolean;
      sender?: string;
      isRead: boolean;
      timestamp?: string;
    }[]
  >([]);
  const [connectedUsers, setConnectedUsers] = useState<any[]>([]);
  const [isChatBuddyOnline, setIsChatBuddyOnline] = useState<boolean>(false);
  const [isChatBuddyInRoom, setIsChatBuddyInRoom] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [chatBuddyProfile, setChatBuddyProfile] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll 
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: typeof messages } = {};

    messages.forEach((msg) => {
      const date = msg.timestamp
        ? new Date(msg.timestamp).toLocaleDateString()
        : "Unknown";
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });

    return groups;
  };

  // Format date 
  const formatDate = (dateString: string) => {
    const today = new Date().toLocaleDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toLocaleDateString();

    if (dateString === today) return "Today";
    if (dateString === yesterdayString) return "Yesterday";
    return dateString;
  };

  //  previous chat history 
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (decodedRoom) {
        setIsLoading(true);
        try {
          const buddy = await getUsersProfileInfo(chatBuddyUserId as string);
          setChatBuddyProfile(buddy);
          const response = await getRoomChatHistory(decodedRoom);
          const history = response.data[0]?.messages;
          if (history) {
            await updateMessageReadStatus(decodedRoom, selfUserId as string);

            // Let other users know we've read their messages
            socket?.emit("mark-messages-read", {
              room: decodedRoom,
              readerId: selfUserId,
            });

            setMessages(
              history.map((msg: any) => ({
                id: msg._id || msg.id,
                msg: msg.message,
                fromSelf: msg.senderId === selfUserId,
                sender:
                  msg.senderId === selfUserId
                    ? "You"
                    : buddy?.name || "Chat Buddy",
                isRead: msg.isRead,
                timestamp: msg.timestamp || msg.createdAt || new Date().toISOString(),
              }))
            );

            setTimeout(scrollToBottom, 100);
          }
        } catch (error) {
          console.error("Error fetching chat history:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchChatHistory();
  }, [decodedRoom, selfUserId, chatBuddyUserId, socket]);

  // Scroll to bottom 
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input 
  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  // Handle joining the room and socket events
  useEffect(() => {
    if (socket) {
      if (decodedRoom) {
        socket.emit("set-user-email", userEmail);
        socket.emit("set-user-id", selfUserId);
      }

      socket.emit("join-room", room);

      socket.emit("user-active-in-room", {
        room: decodedRoom,
        userId: selfUserId,
      });

      socket.on("joinRoomNavigate", (data) => {
        if (socket.id === data.socketId) {
          setSelfSocketId(data.socketId);
          setClientId(data.clientId);
        }
      });

      socket.on("joinedRoomsDetailsPass", (data) => {
        setConnectedUsers(data.connectedUsers || []);
      });

      socket.on("user-active-status", (data) => {
        if (data.userId === chatBuddyUserId) {
          setIsChatBuddyOnline(data.isActive);

          if (data.room === decodedRoom) {
            setIsChatBuddyInRoom(data.isActive);
          }
        }
      });

      // Listen for message read events
      socket.on("messages-marked-read", (data) => {
        if (data.room === decodedRoom && data.readerId === chatBuddyUserId) {
          // Update all messages sent by self as read
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.fromSelf ? { ...msg, isRead: true } : msg
            )
          );
        }
      });

      // Listen for "buddy seen messages" events
      socket.on("buddy-seen-messages", (data) => {
        if (data.room === decodedRoom && data.senderId === chatBuddyUserId) {
          // Mark as read
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              !msg.fromSelf ? { ...msg, isRead: true } : msg
            )
          );
        }
      });

      socket.on(
        "message",
        async (data: {
          id?: string;
          msg: string;
          socketId: string;
          clientId: string;
          sender?: string;
          timestamp?: string;
        }) => {
          const fromSelf = data.socketId === selfSocketId;
          const newMessage = {
            id: data.id,
            msg: data.msg,
            fromSelf,
            sender:
              data.sender ||
              (fromSelf ? "You" : chatBuddyProfile?.name || "Chat Buddy"),
            isRead: fromSelf ? isChatBuddyInRoom : true, // Set isRead based on chat buddy being in THIS room
            timestamp: data.timestamp || new Date().toISOString(),
          };

          setMessages((prevMessages) => [...prevMessages, newMessage]);

          //self active and mark it as read
          if (!fromSelf) {
            socket.emit("mark-messages-read", {
              room: decodedRoom,
              readerId: selfUserId,
            });

            //update read status in database
            try {
              await updateMessageReadStatus(
                decodedRoom as string,
                selfUserId as string
              );
            } catch (error) {
              console.error("Error updating read status:", error);
            }
          }
        }
      );
    }

    return () => {
      if (socket) {
        socket.emit("user-inactive-in-room", {
          room: decodedRoom,
          userId: selfUserId,
        });

        socket.off("joinRoomNavigate");
        socket.off("joinedRoomsDetailsPass");
        socket.off("message");
        socket.off("user-active-status");
        socket.off("messages-marked-read");
        socket.off("buddy-seen-messages");
      }
    };
  }, [
    socket,
    room,
    selfSocketId,
    decodedRoom,
    selfUserId,
    chatBuddyUserId,
    isChatBuddyOnline,
    isChatBuddyInRoom,
    chatBuddyProfile,
  ]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (message.trim() && socket) {
      const timestamp = new Date().toISOString();
      const messageData = {
        connectedUsers: connectedUsers,
        msg: message,
        socketId: selfSocketId,
        clientId: clientId,
        room: room,
        sender: "You",
        timestamp,
      };

      socket.emit("message", messageData);

      const data = {
        senderId: selfUserId,
        receiverId: chatBuddyUserId,
        message: message,
        isRead: isChatBuddyInRoom,
        timestamp: timestamp,
      };

      try {
        const response = await addNewMessage(decodedRoom as string, data);
        // Update messages
        if (response?.data?.id) {
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            const lastIndex = updatedMessages.length - 1;
            if (lastIndex >= 0) {
              updatedMessages[lastIndex] = {
                ...updatedMessages[lastIndex],
                id: response.data.id,
              };
            }
            return updatedMessages;
          });
        }
      } catch (error) {
        console.error("Error saving message:", error);
      }

      setMessage("");

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // Handle pressing Enter key to send message
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string | undefined) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
          <button
            onClick={() => router.push("/chat")}
            className="text-blue-500 hover:text-blue-700 mr-4 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-1">Back</span>
          </button>

          <div className="flex-1 flex items-center">
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="ml-3">
                  <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href={`/user-profile/${chatBuddyProfile?._id}`}
                  className="flex items-center group"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold ring-2 ring-blue-100">
                    {chatBuddyProfile?.name?.[0] || "?"}
                  </div>
                  <div className="ml-3">
                    <h1 className="font-medium text-gray-900 group-hover:text-blue-600 transition">
                      {chatBuddyProfile?.name || "Chat Buddy"}
                    </h1>
                    <div className="flex items-center">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isChatBuddyOnline
                            ? isChatBuddyInRoom
                              ? "bg-green-500"
                              : "bg-yellow-500"
                            : "bg-gray-400"
                        } mr-1`}
                      ></span>
                      <span className="text-xs text-gray-500">
                        {isChatBuddyOnline
                          ? isChatBuddyInRoom
                            ? "Active now"
                            : "Online"
                          : "Offline"}
                      </span>
                    </div>
                  </div>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 pb-4 pt-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div
            ref={messagesContainerRef}
            className="bg-white rounded-xl shadow-sm h-[600px] overflow-y-auto p-4 mb-4"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-1">
                  No messages yet
                </h3>
                <p className="text-gray-500 max-w-xs">
                  Send a message to {chatBuddyProfile?.name || "your buddy"} to
                  start the conversation!
                </p>
              </div>
            ) : (
              <>
                {Object.entries(groupMessagesByDate()).map(([date, msgs]) => (
                  <div key={date} className="mb-4">
                    <div className="flex justify-center mb-3">
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                        {formatDate(date)}
                      </span>
                    </div>
                    {msgs.map((message, index) => (
                      <div
                        key={index}
                        className={`flex flex-col mb-3 ${
                          message.fromSelf ? "items-end" : "items-start"
                        }`}
                      >
                        <div className="flex items-end mb-1">
                          {!message.fromSelf && (
                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700 mr-2">
                              {chatBuddyProfile?.name?.[0] || "?"}
                            </div>
                          )}
                          <div
                            className={`px-4 py-2 rounded-2xl max-w-xs sm:max-w-md shadow-sm ${
                              message.fromSelf
                                ? "bg-blue-500 text-white rounded-br-none"
                                : "bg-gray-100 text-gray-800 rounded-bl-none"
                            }`}
                          >
                            <div className="whitespace-pre-wrap break-words">
                              {message.msg}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`flex items-center text-xs text-gray-400 ${
                            message.fromSelf
                              ? "justify-end"
                              : "justify-start ml-8"
                          }`}
                        >
                          <span>{formatTime(message.timestamp)}</span>
                          {message.fromSelf && (
                            <span className="ml-2">
                              {message.isRead ? (
                                <span className="flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 text-blue-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Message Input */}
        <div className="bg-white rounded-xl shadow-sm p-3 flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${chatBuddyProfile?.name || ""}...`}
            className="flex-1 py-3 px-4 bg-gray-50 border border-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            className={`p-3 rounded-full text-white shadow-sm transition-all ${
              message.trim() && !isLoading
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";
import { getUsersChatLists } from "@/service/chatService";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { AuthContext } from "@/context/AuthContext";
import withAuth from "@/lib/hoc/withAuth";

interface ChatInfo {
  roomId: string;
  chatBuddy: string;
  messageData: string;
  timestamp: string;
  isRead: boolean;
  ownMessage: boolean;
}

function ChatPage() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is not provided.");
  }
  const { user } = authContext;
  const [chatLists, setChatLists] = useState<ChatInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getChatLists = async () => {
      if (!user?.email) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await getUsersChatLists(user.email);

        // Sort chat lists (newest first)
        const sortedChats = [...res].sort((a: ChatInfo, b: ChatInfo) => {
          return (
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        });

        setChatLists(sortedChats);
      } catch (err) {
        console.error("Failed to fetch chat lists:", err);
        setError("Failed to load your conversations. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    getChatLists();
  }, [user?.email]);

  // Spinner Loading Component
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-medium">Loading conversations...</p>
    </div>
  );

  if (error) {
    return (
      <div className="max-w-lg mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Chats</h2>
        <div className="p-5 rounded-xl bg-red-50 border-l-4 border-red-500 text-red-700 shadow-sm">
          <p className="font-medium">{error}</p>
          <button
            onClick={() => {
              setIsLoading(true);
              setError(null);
              getUsersChatLists(user?.email || "")
                .then((res) => {
                  // Sort chat lists by timestamp (newest first)
                  const sortedChats = [...res].sort(
                    (a: ChatInfo, b: ChatInfo) => {
                      return (
                        new Date(b.timestamp).getTime() -
                        new Date(a.timestamp).getTime()
                      );
                    }
                  );

                  setChatLists(sortedChats);
                  setIsLoading(false);
                })
                .catch((err) => {
                  console.error("Failed to fetch chat lists:", err);
                  setError(
                    "Failed to load your conversations. Please try again later."
                  );
                  setIsLoading(false);
                });
            }}
            className="mt-3 px-5 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-700 text-sm font-medium transition flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg min-h-[700px] mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Chats</h2>
        {!isLoading && chatLists.length > 0 && (
          <div className="px-3 py-1 bg-blue-50 rounded-full text-sm text-blue-600 font-medium">
            {chatLists.length} conversation{chatLists.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          {chatLists.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-inner mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 font-medium text-lg">
                No conversations yet
              </p>
              <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                Start chatting with someone to see your conversations here
              </p>
              <button className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition">
                Start a new chat
              </button>
            </div>
          ) : (
            chatLists.map((chatInfo: ChatInfo) => (
              <Link href={`/chat/${chatInfo.roomId}`} key={chatInfo.roomId}>
                <div
                  className={`flex items-center gap-4 p-4 rounded-xl shadow-sm cursor-pointer transition ${
                    chatInfo.isRead ? "bg-white" : "bg-blue-50"
                  } hover:bg-gray-50`}
                >
                  {/* Avatar with initials */}
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-sm ${
                      chatInfo.isRead
                        ? "bg-gradient-to-br from-gray-400 to-gray-500"
                        : "bg-gradient-to-br from-blue-500 to-blue-600"
                    }`}
                  >
                    {chatInfo.chatBuddy[0]}
                  </div>

                  {/* Chat Details */}
                  <div className="flex-1 overflow-hidden">
                    <h3
                      className={`text-lg truncate ${
                        !chatInfo.isRead
                          ? "font-bold text-gray-800"
                          : "font-medium text-gray-700"
                      }`}
                    >
                      {chatInfo.chatBuddy}
                    </h3>
                    <p
                      className={`text-sm truncate ${
                        !chatInfo.isRead
                          ? "font-medium text-gray-700"
                          : "text-gray-500"
                      }`}
                    >
                      {chatInfo.ownMessage ? "You: " : ""}
                      {chatInfo.messageData}
                    </p>
                  </div>

                  {/* Timestamp and Status */}
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatDistanceToNow(new Date(chatInfo.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                    {!chatInfo.isRead && !chatInfo.ownMessage && (
                      <span className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default withAuth(ChatPage);
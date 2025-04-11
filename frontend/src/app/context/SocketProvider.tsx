"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

const socketContext = createContext<SocketContextType | null>(null);

export const useSocket = (): Socket | null => {
  const context = useContext(socketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context.socket;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Create a new socket connection for each client
    const newSocket = io("http://localhost:4001", {
      transports: ["websocket"],
      autoConnect: true,
      // Add this to make socket connections unique per user session
      query: {
        clientId:
          Date.now().toString() + Math.random().toString(36).substring(2, 15),
      },
    });

    setSocket(newSocket);

    // Clean up socket connection on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  );
};

export default SocketProvider;

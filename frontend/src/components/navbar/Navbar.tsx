"use client";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import logo from "../../../public/logo/logo.png";
import Image from "next/image";
import NavbarSkeleton from "../skeletons/NavbarSkeleton";
import Cookies from "js-cookie";
import { getUnreadMessagesCount } from "@/service/chatService";
import { AuthContext } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketProvider";


export default function Navbar() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is not provided.");
  }

  const { user } = authContext;
  const userId = Cookies.get("selfId");
  const socket = useSocket();
  const [unReadMessages, setUnReadMessages] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  // Default avatar
  const defaultAvatar = "/images/profile/default-profile.png";

  // Handle loading state and fetch unread messages
 useEffect(() => {
   const fetchUnreadCount = async () => {
     if (userId) {
       try {
         const counts = await getUnreadMessagesCount(userId);
         setUnReadMessages(counts?.data);
       } catch (error) {
         console.error("Error fetching unread message count:", error);
       }
     }
     setIsLoading(false);
   };

   fetchUnreadCount();


   const interval = setInterval(fetchUnreadCount, 3000);

   if (socket) {
     socket.on("new-message-alert", fetchUnreadCount);
     return () => {
       socket.off("new-message-alert", fetchUnreadCount);
       clearInterval(interval);
     };
   }

   return () => clearInterval(interval); 
 }, [userId, socket]);

  //skeleton while loading
  if (isLoading) {
    return <NavbarSkeleton />;
  }

  // Centralized Menu Items
  const menuItems = [
    { name: "Home", href: "/" },
    ...(user ? [{ name: "Donate", href: "/donate" }] : []),
    ...(user ? [{ name: "Request", href: "/request" }] : []),
    { name: "Donors", href: "/donors" },
    ...(user ? [{ name: "Appointments", href: "/appointment/status" }] : []),
  ];

  return (
    <nav className="bg-white mt-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="h-14 flex items-center w-[200px]">
            <Link href="/" className="">
              <Image
                className="h-[35px] w-[140px]"
                src={logo}
                alt="Life Drop"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-6">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.name}
              </Link>
            ))}
            {user && (
              <Link href="/chat" className="flex items-center gap-1 nav-link">
                Messages{" "}
                {unReadMessages > 0 && (
                  <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex justify-center items-center">
                    {unReadMessages}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* User Profile / Login */}
          <div className="hidden lg:flex">
            {!user ? (
              <Link
                href="/auth/sign-in"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Sign In
              </Link>
            ) : (
              <Link href="/self-profile" className="flex items-center gap-2">
                <img
                  className="h-8 w-8 rounded-full"
                  src={defaultAvatar}
                  alt="profile"
                />
                <div>{user?.displayName}</div>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="focus:outline-none"
            >
              {menuOpen ? (
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-gray-100 shadow-lg transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          ✖
        </button>
        <div className="flex flex-col items-start p-6 space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="hover:text-red-500"
            >
              {item.name}
            </Link>
          ))}
          {user && (
            <Link
              href="/chat"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-1 hover:text-red-500"
            >
              Messages{" "}
              {unReadMessages > 0 && (
                <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex justify-center items-center">
                  {unReadMessages}
                </span>
              )}
            </Link>
          )}
          {!user ? (
            <Link
              href="/auth/sign-in"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Login
            </Link>
          ) : (
            <Link
              href="/self-profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <img
                className="h-8 w-8 rounded-full"
                src={defaultAvatar}
                alt="profile"
              />
              <div>{user?.displayName}</div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

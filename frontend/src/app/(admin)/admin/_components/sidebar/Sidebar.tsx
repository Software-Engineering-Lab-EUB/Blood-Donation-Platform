"use client";
import { useState } from "react";
import {
  User,
  FileText,
  Heart,
  Calendar,
  Megaphone,
  Droplet,
  Menu,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    {
      name: "Admin Dashboard",
      icon: <Settings />,
      path: "/admin",
    },
    { name: "Users", icon: <User />, path: "/admin/users" },
    { name: "Posts", icon: <FileText />, path: "/admin/posts" },
    { name: "Appointments", icon: <Calendar />, path: "/admin/appointments" },
    { name: "Campaigns", icon: <Megaphone />, path: "/admin/campaigns" },
    { name: "Blood Banks", icon: <Droplet />, path: "/admin/blood-banks" },
  ];

  return (
    <div
      className={`h-screen fixed bg-gray-900 text-white p-5 ${
        isOpen ? "w-64" : "w-20"
      } transition-all duration-0`}
    >
      <button onClick={toggleSidebar} className="mb-5 text-white">
        <Menu />
      </button>
      <nav>
        <ul>
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`mb-3 ${pathname === item.path ? "bg-gray-800" : ""}`}
            >
              <Link
                href={item.path}
                className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-md"
              >
                <span className="text-xl">{item.icon}</span>
                {isOpen && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
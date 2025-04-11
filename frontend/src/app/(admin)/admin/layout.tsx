import type { Metadata } from "next";
import Sidebar from "./_components/sidebar/Sidebar";

export const metadata: Metadata = {
  title: "Blood Donation Platform",
  description: "This is the admin dashboard layout for the Blood Donation Platform, designed to provide administrators with a streamlined interface for managing donors, blood requests, user roles, and platform content. Featuring a responsive sidebar navigation, the layout ensures easy access to key modules while keeping the focus on operational efficiency and user-friendly control.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      <div className="ml-[calc(16rem+1rem)]">{children}</div>
    </div>
  );
}

import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blood Donation Platform",
  description: "Welcome to the Blood Donation Platform – a user-friendly and secure space where donors and recipients connect seamlessly. Easily find nearby blood donors, manage donation requests, and stay informed with real-time updates. With an intuitive layout featuring a top navigation bar and responsive design, this homepage serves as the gateway to life-saving support and community-driven blood donation efforts.enerated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      <div className="max-w-[1280px] mx-auto">{children}</div>
      <Footer />
    </div>
  );
}

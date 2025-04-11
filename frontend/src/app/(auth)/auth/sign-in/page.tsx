"use client";

import { AuthContext } from "@/app/context/AuthContext";
import { getAdditionalUserInfo } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function SignIn() {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    router.push("/auth/sign-in");
    throw new Error("AuthContext is not provided.");
  }
  const { GoogleSignIn } = authContext;

  const handleGoogleSignIn = async () => {
    try {
      const response = await GoogleSignIn();
      const additionalUserInfo = getAdditionalUserInfo(response);
      console.log(additionalUserInfo);
      if (additionalUserInfo?.isNewUser) {
        router.push("/auth/register");
      } else {
        router.push("/home");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-gray-500 to-[#13202d] p-6 flex items-center justify-center">
      <div className="max-w-xl shadow-gray-700 shadow-xl w-full z-50 bg-white rounded-[20px]  overflow-hidden transform transition duration-300 ease-in-out ">
        {/* Banner Section */}
        <div className="relative h-56">
          <Image
            src="/images/login-page/login-banner.jpg"
            alt="Blood Donation Banner"
            fill
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <h1 className="text-white font-semibold text-3xl p-6">
              Life Saver Connect
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <h2 className="text-4xl font-bold text-red-600 mb-6">
            Welcome to Blood Donation Platform
          </h2>

          <div className="space-y-6 mb-8">
            {[
              {
                title: "Donate Blood",
                description:
                  "Your donation can save up to three lives. Join our community today.",
                iconColor: "bg-red-100 text-red-600",
                path: "M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z",
              },
              {
                title: "Request Blood",
                description:
                  "Emergency? Get immediate response from nearby donors.",
                iconColor: "bg-blue-100 text-blue-600",
                path: "M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z",
              },
              {
                title: "Track Donations",
                description:
                  "Monitor your donation history and see your impact.",
                iconColor: "bg-green-100 text-green-600",
                path: "M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z",
              },
            ].map(({ title, description, iconColor, path }, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className={`p-4 rounded-full ${iconColor}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d={path} clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-gray-800">
                    {title}
                  </h3>
                  <p className="text-gray-600 text-lg">{description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Google Sign-in Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-red-50 hover:bg-red-100 text-gray-700 border border-gray-300 font-medium py-4 px-5 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-102"
          >
            <span className="text-xl font-semibold text-gray-700">
              Continue with{" "}
              <span className="text-2xl font-semibold">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#DB4437]">o</span>
                <span className="text-[#F4B400]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#0F9D58]">l</span>
                <span className="text-[#DB4437]">e</span>
              </span>
            </span>
          </button>

          {/* Terms & Conditions */}
          <div className="mt-10 text-center">
            <p className="text-base text-gray-500">
              By signing in, you agree to our{" "}
              <a href="#" className="text-red-600 hover:underline text-lg">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-red-600 hover:underline text-lg">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

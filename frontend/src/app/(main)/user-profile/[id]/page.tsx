"use client";
import { getUsersProfileInfo } from "@/service/userService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { createRoom } from "@/app/utils/chatRoomGenerate";


//user interface 
interface UserInfo {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  blood_group: string;
  gender: string;
  dob: {
    day: number;
    month: number;
    year: number;
  };
  nid: number;
  photoURL: string;
  role: string;
  isAvailableForDonation: boolean;
  isPhoneNumberVisible: boolean;
  isVerified: boolean;
  isBanned: boolean;
  isSmoker: boolean;
  isRegistered: boolean;
  critical_disease: boolean;
  critical_disease_description: string;
  createdAt: string;
  updatedAt: string;
  posts: any[];
  __v: number;
}

export default function UserProfile() {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [roomId, setRoomId] = useState<any>(null);
  const selfId = Cookies.get("selfId");
  useEffect(() => {
    const getUserProfileDetails = async () => {
      setLoading(true);
      try {
        const res = await getUsersProfileInfo(id as string);
        setUserInfo(res);
        if (res && selfId) {
          console.log(res?._id);
          setRoomId(createRoom(selfId as string, res?._id as string));
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    getUserProfileDetails();
  }, [id]);

  // Calculate age 
  const calculateAge = (dob: { day: number; month: number; year: number }) => {
    const today = new Date();
    const birthDate = new Date(dob.year, dob.month - 1, dob.day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center p-8 bg-red-50 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-700">
            The user profile you're looking for could not be found.
          </p>
        </div>
      </div>
    );
  }

  console.log(userInfo);

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header with basic info */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 transition-all duration-300 hover:shadow-xl relative">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="h-28 w-28 md:h-32 md:w-32 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center text-gray-800 text-4xl font-bold">
                  {userInfo?.name?.charAt(0) || "U"}
                </div>
              </div>

              {/* Basic Info */}
              <div className="md:ml-8 flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {userInfo.name}
                    </h1>
                    <div className="flex flex-wrap justify-center md:justify-start items-center mt-3 gap-2">
                      <span className="px-4 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-full shadow-sm">
                        {userInfo.blood_group}
                      </span>
                      <span className="px-4 py-1.5 bg-gray-200 text-blue-600 font-semibold text-sm rounded-full shadow-sm">
                        {userInfo.gender}
                      </span>
                      <span className="px-4 py-1.5 bg-purple-200 text-blue-800 font-semibold text-sm rounded-full shadow-sm">
                        {userInfo.role === "Both"
                          ? "Donor | Receiver"
                          : userInfo.role}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 md:mt-0 flex space-x-3">
                    {userInfo.isAvailableForDonation && (
                      <Link href={`/appointment/request/${userInfo?._id}`} className="bg-green-500 cursor-pointer text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-md flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Schedule Appointment
                      </Link>
                    )}

                    {/* Chat Button */}
                    {roomId && (
                      <Link href={`/chat/${roomId}`} passHref>
                        <div className="bg-white text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-lg font-semibold text-sm shadow-md flex items-center cursor-pointer transition-all duration-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
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
                          Chat Now
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4 transition-all duration-300 hover:shadow-md">
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <Link
                  href={`mailto:${userInfo?.email}`}
                  className="text-gray-800 font-medium flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {userInfo.email}
                </Link>
              </div>
              {userInfo.isPhoneNumberVisible && (
                <div className="bg-gray-50 rounded-lg p-4 transition-all duration-300 hover:shadow-md">
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="text-gray-800 font-medium flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {userInfo.phone}
                  </p>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-4 transition-all duration-300 hover:shadow-md">
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <p className="text-gray-800 font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {userInfo.address}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 transition-all duration-300 hover:shadow-md">
                <p className="text-sm text-gray-500 mb-1">Member Since</p>
                <p className="text-gray-800 font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {formatDate(userInfo.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Fixed Chat Button for Mobile */}
          <div className="md:hidden fixed bottom-6 right-6 z-10">
            <Link href={`/chat/${userInfo._id}`} passHref>
              <div className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-300">
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 mt-12 md:grid-cols-3 gap-6">
          {/* Personal Details */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Personal Details
              </h2>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <span className="text-gray-500 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Age
                  </span>
                  <span className="font-medium text-gray-800">
                    {calculateAge(userInfo.dob)} years
                  </span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <span className="text-gray-500 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Date of Birth
                  </span>
                  <span className="font-medium text-gray-800">
                    {new Date(
                      userInfo.dob.year,
                      userInfo.dob.month - 1,
                      userInfo.dob.day
                    ).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <span className="text-gray-500 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"
                      />
                    </svg>
                    NID
                  </span>
                  <span className="font-medium text-gray-800">
                    {userInfo.nid}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Health Information */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Health Information
              </h2>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div
                    className={`w-4 h-4 rounded-full mr-2 ${
                      userInfo.isSmoker ? "bg-red-500" : "bg-green-500"
                    }`}
                  ></div>
                  <span className="text-gray-800">
                    {userInfo.isSmoker ? "Smoker" : "Non-Smoker"}
                  </span>
                </li>
                <li className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div
                    className={`w-4 h-4 rounded-full mr-2 ${
                      userInfo.critical_disease ? "bg-red-500" : "bg-green-500"
                    }`}
                  ></div>
                  <span className="text-gray-800">
                    {userInfo.critical_disease
                      ? "Has Critical Disease"
                      : "No Critical Disease"}
                  </span>
                </li>
                {userInfo.critical_disease &&
                  userInfo.critical_disease_description && (
                    <li className="mt-2 p-2 rounded-lg bg-red-50">
                      <p className="text-sm text-gray-500">Disease Details</p>
                      <p className="text-gray-800 mt-1">
                        {userInfo.critical_disease_description}
                      </p>
                    </li>
                  )}
              </ul>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Account Status
              </h2>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div
                    className={`w-4 h-4 rounded-full mr-2 ${
                      userInfo.isBanned ? "bg-red-500" : "bg-green-500"
                    }`}
                  ></div>
                  <span className="text-gray-800">
                    {userInfo.isBanned ? "Account Banned" : "Account Active"}
                  </span>
                </li>
                <li className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div
                    className={`w-4 h-4 rounded-full mr-2 ${
                      userInfo.isRegistered ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  ></div>
                  <span className="text-gray-800">
                    {userInfo.isRegistered
                      ? "Registered User"
                      : "Unregistered User"}
                  </span>
                </li>
                <li className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div
                    className={`w-4 h-4 rounded-full mr-2 ${
                      userInfo.isAvailableForDonation
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  ></div>
                  <span className="text-gray-800">
                    {userInfo.isAvailableForDonation
                      ? "Available for Donation"
                      : "Not Available for Donation"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Posts Section - If needed */}
        {userInfo.posts && userInfo.posts.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
                Posts ({userInfo.posts.length})
              </h2>
            </div>
            <div className="p-6">
              {/* Posts content would go here */}
              <p className="text-gray-500">
                This user has {userInfo.posts.length} posts
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

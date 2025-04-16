"use client";


import { getUserInfoByEmail } from "@/service/userService";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import withAuth from "@/lib/hoc/withAuth";


function SelfProfile() {
  const authContext = useContext(AuthContext);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  if (!authContext) {
    throw new Error("AuthContext is not provided.");
  }

  const { user, logOut } = authContext;

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setLoading(true);
        const data = await getUserInfoByEmail(user?.email);
        console.log(data[0]);
        setUserData(data[0]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      getUserDetails();
    }
  }, [user]);

  const handleLogOut = async () => {
    await logOut();
    window.location.replace('/');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-b-blue-500 border-gray-200 rounded-full animate-spin"></div>
          <div className="text-xl font-medium text-gray-700">
            Loading your profile...
          </div>
        </div>
      </div>
    );
  }

  // Format date from the dob object
  const formatDate = (dob: any) => {
    if (!dob) return "Not provided";
    return `${dob.day}/${dob.month}/${dob.year}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Header */}
          <div className="relative">
            {/* Banner Background */}
            <div className="h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"></div>

            {/* Profile Info Overlay */}
            <div className="absolute inset-0 flex items-end">
              <div className="w-full px-6 pb-6 pt-24 bg-gradient-to-t from-black/70 to-transparent">
                <div className="flex flex-col md:flex-row md:items-end gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="h-28 w-28 md:h-32 md:w-32 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center text-gray-800 text-4xl font-bold">
                      {userData?.name?.charAt(0) ||
                        user?.displayName?.charAt(0) ||
                        "U"}
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                      {userData?.name || user?.displayName}
                    </h1>
                    <p className="text-gray-200 font-light">
                      {userData?.email}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-600/90 text-white backdrop-blur-sm">
                        {userData?.role || "User"}
                      </div>
                      {userData?.isAvailableForDonation && (
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/90 text-white backdrop-blur-sm">
                          Available for Donation
                        </div>
                      )}
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-600/90 text-white backdrop-blur-sm">
                        {userData?.blood_group || "Blood Group Not Set"}
                      </div>
                    </div>
                  </div>

                  {/* Buttons - Desktop */}
                  <div className="hidden md:flex md:flex-row gap-3">
                    <Link href="/edit-profile">
                      <button className="px-4 cursor-pointer py-2 bg-white hover:bg-gray-100 text-indigo-700 font-medium rounded-lg transition duration-200 shadow-md">
                        Edit Profile
                      </button>
                    </Link>
                    <button
                      onClick={handleLogOut}
                      className="px-4 cursor-pointer py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition duration-200 shadow-md"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons - Mobile */}
          <div className="md:hidden flex gap-3 px-6 pt-4">
            <Link href="/edit-profile" className="flex-1">
              <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 shadow-md">
                Edit Profile
              </button>
            </Link>
            <button
              onClick={logOut}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition duration-200 shadow-md"
            >
              Sign Out
            </button>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-4 text-indigo-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Personal Information
                </h2>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium sm:w-1/3">
                      Blood Group:
                    </span>
                    <span className="text-lg font-bold text-pink-600">
                      {userData?.blood_group || "Not provided"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium sm:w-1/3">
                      Gender:
                    </span>
                    <span className="text-gray-800">
                      {userData?.gender || "Not provided"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium sm:w-1/3">
                      Date of Birth:
                    </span>
                    <span className="text-gray-800">
                      {formatDate(userData?.dob)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium sm:w-1/3">
                      Phone:
                    </span>
                    <span className="text-gray-800">
                      {userData?.phone || "Not provided"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium sm:w-1/3">
                      Address:
                    </span>
                    <span className="text-gray-800">
                      {userData?.address || "Not provided"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center py-2">
                    <span className="text-gray-500 font-medium sm:w-1/3">
                      NID:
                    </span>
                    <span className="text-gray-800">
                      {userData?.nid
                        ? "•••••" + String(userData.nid).slice(-4)
                        : "Not provided"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Donation Information */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-4 text-indigo-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Donation Information
                </h2>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium sm:w-1/3">
                      Donation Status:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        userData?.isAvailableForDonation
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {userData?.isAvailableForDonation
                        ? "Available"
                        : "Not Available"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium sm:w-1/3">
                      Critical Disease:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        userData?.critical_disease
                          ? "bg-red-100 text-red-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {userData?.critical_disease ? "Yes" : "No"}
                    </span>
                  </div>

                  {userData?.critical_disease &&
                    userData?.critical_disease_description && (
                      <div className="flex flex-col sm:flex-row py-2 border-b border-gray-100">
                        <span className="text-gray-500 font-medium sm:w-1/3">
                          Disease Description:
                        </span>
                        <span className="text-gray-800">
                          {userData?.critical_disease_description}
                        </span>
                      </div>
                    )}

                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium sm:w-1/3">
                      Smoker:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        userData?.isSmoker
                          ? "bg-red-100 text-red-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {userData?.isSmoker ? "Yes" : "No"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium sm:w-1/3">
                      Number Visibility:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        userData?.isPhoneNumberVisible
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {userData?.isPhoneNumberVisible ? "Public" : "Private"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center py-2">
                    <span className="text-gray-500 font-medium sm:w-1/3">
                      Notification:
                    </span>
                    <span className="text-gray-800">
                      {userData?.notificationPreference || "Not set"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="mt-6 bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-4 text-indigo-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
                    clipRule="evenodd"
                  />
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                Account Status
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-gray-500 font-medium block mb-1">
                    Registration Status
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      userData?.isRegistered
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {userData?.isRegistered ? "Registered" : "Not Registered"}
                  </span>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-gray-500 font-medium block mb-1">
                    Account Status
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      userData?.isBanned
                        ? "bg-red-100 text-red-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {userData?.isBanned ? "Banned" : "Active"}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Dates */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100 flex flex-col sm:flex-row justify-between">
              <div>
                <span className="text-gray-500 font-medium">Created:</span>{" "}
                <span className="text-gray-800">
                  {new Date(userData?.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-2 sm:mt-0">
                <span className="text-gray-500 font-medium">Last Updated:</span>{" "}
                <span className="text-gray-800">
                  {new Date(userData?.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(SelfProfile);
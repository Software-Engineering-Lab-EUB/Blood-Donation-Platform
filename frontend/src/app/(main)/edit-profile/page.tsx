"use client";

import { useContext, useEffect, useState } from "react";

import { getUserInfoByEmail, updateUserProfile } from "@/service/userService";
import { useRouter } from "next/navigation";
import {
  User,
  Edit,
  Phone,
  MapPin,
  Calendar,
  Droplet,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import withAuth from "@/lib/hoc/withAuth";

function EditProfile() {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [activeSection, setActiveSection] = useState("personal");

  if (!authContext) {
    throw new Error("AuthContext is not provided.");
  }

  const { user, logOut } = authContext;

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setLoading(true);
        const data = await getUserInfoByEmail(user?.email);
        setUserData(data[0]);
        setFormData({
          name: data[0]?.name || "",
          blood_group: data[0]?.blood_group || "",
          gender: data[0]?.gender || "",
          dob: data[0]?.dob || { day: "", month: "", year: "" },
          phone: data[0]?.phone || "",
          address: data[0]?.address || "",
          isSmoker: data[0]?.isSmoker || false,
          critical_disease: data[0]?.critical_disease || false,
          critical_disease_description:
            data[0]?.critical_disease_description || "",
          isAvailableForDonation: data[0]?.isAvailableForDonation || false,
          notificationPreference: data[0]?.notificationPreference || "Yes",
          isPhoneNumberVisible: data[0]?.isPhoneNumberVisible || false,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setNotification({
          show: true,
          message: "Failed to load profile data",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      getUserDetails();
    }
  }, [user]);

  const handleChange = (e:any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(userData._id, formData);
      setNotification({
        show: true,
        message: "Profile updated successfully!",
        type: "success",
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({
        show: true,
        message: "Failed to update profile",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mb-4"></div>
        <div className="text-xl font-medium text-gray-700">
          Loading your profile...
        </div>
      </div>
    );
  }

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="relative">
        <div className="h-56 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 flex justify-center">
          <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-xl flex items-center justify-center text-gray-800 text-4xl font-bold">
            {userData?.name?.charAt(0) || user?.displayName?.charAt(0) || "U"}
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification.show && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border-l-4 border-green-500"
              : "bg-red-100 text-red-800 border-l-4 border-red-500"
          }`}
        >
          {notification.type === "success" ? (
            <Check size={20} className="text-green-500" />
          ) : (
            <AlertCircle size={20} className="text-red-500" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Edit Profile</h1>
          <p className="text-gray-600 mt-2">
            Update your personal information and preferences
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white rounded-lg shadow-md flex p-1">
            <button
              onClick={() => setActiveSection("personal")}
              className={`px-4 py-2 rounded-md font-medium transition ${
                activeSection === "personal"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveSection("health")}
              className={`px-4 py-2 rounded-md font-medium transition ${
                activeSection === "health"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Health Info
            </button>
            <button
              onClick={() => setActiveSection("preferences")}
              className={`px-4 py-2 rounded-md font-medium transition ${
                activeSection === "preferences"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Preferences
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Personal Information Section */}
            {activeSection === "personal" && (
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <User size={24} className="text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Personal Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData?.name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Gender
                    </label>
                    <select
                      name="gender"
                      id="gender"
                      value={formData?.gender}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <label
                      htmlFor="dob"
                      className=" text-sm font-medium text-gray-700 flex items-center"
                    >
                      <Calendar size={16} className="mr-1 text-gray-500" />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      id="dob"
                      value={
                        formData?.dob?.year
                          ? `${formData?.dob?.year}-${formData?.dob?.month}-${formData?.dob?.day}`
                          : ""
                      }
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className=" text-sm font-medium text-gray-700 flex items-center"
                    >
                      <Phone size={16} className="mr-1 text-gray-500" />
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={formData?.phone}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2 md:col-span-2">
                    <label
                      htmlFor="address"
                      className=" text-sm font-medium text-gray-700 flex items-center"
                    >
                      <MapPin size={16} className="mr-1 text-gray-500" />
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={formData?.address}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Health Information Section */}
            {activeSection === "health" && (
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <Droplet size={24} className="text-red-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Health Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Blood Group */}
                  <div className="space-y-2">
                    <label
                      htmlFor="blood_group"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Blood Group
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {bloodGroups.map((group) => (
                        <div
                          key={group}
                          onClick={() =>
                            setFormData({ ...formData, blood_group: group })
                          }
                          className={`cursor-pointer text-center p-3 rounded-lg border ${
                            formData?.blood_group === group
                              ? "bg-red-100 border-red-500 text-red-800"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {group}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Smoker Status */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Health Factors
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-700">Are you a smoker?</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="isSmoker"
                            checked={formData?.isSmoker}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Critical Disease */}
                  <div className="space-y-2 md:col-span-2">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-700">
                          Do you have any critical diseases?
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="critical_disease"
                            checked={formData?.critical_disease}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      {formData?.critical_disease && (
                        <div className="mt-3">
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Please describe your condition
                          </label>
                          <textarea
                            name="critical_disease_description"
                            value={formData?.critical_disease_description}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                            placeholder="Describe your medical condition here..."
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Section */}
            {activeSection === "preferences" && (
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <Edit size={24} className="text-purple-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Preferences
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {/* Donation Availability */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Donation Status
                    </h3>
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <p className="text-gray-700 mb-4 md:mb-0">
                        Are you available to donate blood?
                      </p>
                      <div className="flex items-center space-x-4">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              isAvailableForDonation: true,
                            })
                          }
                          className={`px-4 py-2 rounded-lg flex items-center ${
                            formData?.isAvailableForDonation
                              ? "bg-green-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700"
                          }`}
                        >
                          <Check size={16} className="mr-1" />
                          Available
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              isAvailableForDonation: false,
                            })
                          }
                          className={`px-4 py-2 rounded-lg flex items-center ${
                            !formData?.isAvailableForDonation
                              ? "bg-red-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700"
                          }`}
                        >
                          <X size={16} className="mr-1" />
                          Unavailable
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Phone Number Visibility */}
                  <div className="bg-white border border-gray-200 p-6 rounded-xl">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Privacy Settings
                    </h3>
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <p className="text-gray-700">
                          Make my phone number visible to other users
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          This allows potential blood recipients to contact you
                          directly
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-4 md:mt-0">
                        <input
                          type="checkbox"
                          name="isPhoneNumberVisible"
                          checked={formData?.isPhoneNumberVisible}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Notification Preference */}
                  <div className="bg-white border border-gray-200 p-6 rounded-xl">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Notification Settings
                    </h3>
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <p className="text-gray-700">
                          Receive notifications about donation requests
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          We'll let you know when your blood type is needed
                        </p>
                      </div>
                      <select
                        name="notificationPreference"
                        value={formData?.notificationPreference}
                        onChange={handleChange}
                        className="mt-4 md:mt-0 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Yes">Yes, notify me</option>
                        <option value="No">No, don't notify me</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="bg-gray-50 px-8 py-6 flex justify-between items-center">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-200"
              >
                Cancel
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    // Reset form logic here
                    const resetData = userData
                      ? {
                          name: userData?.name || "",
                          blood_group: userData?.blood_group || "",
                          gender: userData?.gender || "",
                          dob: userData?.dob || {
                            day: "",
                            month: "",
                            year: "",
                          },
                          phone: userData?.phone || "",
                          address: userData?.address || "",
                          isSmoker: userData?.isSmoker || false,
                          critical_disease: userData?.critical_disease || false,
                          critical_disease_description:
                            userData?.critical_disease_description || "",
                          isAvailableForDonation:
                            userData?.isAvailableForDonation || false,
                          notificationPreference:
                            userData?.notificationPreference || "Yes",
                          isPhoneNumberVisible:
                            userData?.isPhoneNumberVisible || false,
                        }
                      : {};
                    setFormData(resetData);
                  }}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-200"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


export default withAuth(EditProfile);
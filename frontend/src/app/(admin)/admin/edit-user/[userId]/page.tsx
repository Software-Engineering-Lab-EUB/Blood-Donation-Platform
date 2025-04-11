"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Mail,
  Shield,
  AlertCircle,
  UserCheck,
  Droplet,
  UserX,
  Lock,
  MessageCircle,
  Bell,
} from "lucide-react";
import { getUserDetails } from "../../services/userService";

// Define proper TypeScript interface for user data
interface UserData {
  name: string;
  blood_group: string;
  dob: {
    day: number;
    month: number;
    year: number;
  };
  gender: string;
  phone: string;
  photoURL: string;
  isPhoneNumberVisible: boolean;
  nid: number;
  address: string;
  email: string;
  isSmoker: boolean;
  critical_disease: boolean;
  critical_disease_description: string;
  notificationPreference: string;
  isAvailableForDonation: boolean;
  donation_eligibility: string;
  role: string;
  isRegistered: boolean;
  isVerified: boolean;
  isBanned: boolean;
}

// default values for user 
const defaultUserData: UserData = {
  name: "",
  blood_group: "A+",
  dob: { day: 1, month: 1, year: 2000 },
  gender: "Male",
  phone: "",
  photoURL: "",
  isPhoneNumberVisible: true,
  nid: 0,
  address: "",
  email: "",
  isSmoker: false,
  critical_disease: false,
  critical_disease_description: "",
  notificationPreference: "Yes",
  isAvailableForDonation: true,
  donation_eligibility: "Eligible",
  role: "Both",
  isRegistered: true,
  isVerified: false,
  isBanned: false,
};

const EditUserProfile = () => {
  const {userId}  = useParams();
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsFetching(true);
      setError(null);
      try {
        const data = await getUserDetails(userId as string);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data", error);
        setError("Failed to load user profile. Please try again.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchUserData();
  }, [userId]);
  console.log(userId);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      setUserData({
        ...userData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (name.startsWith("dob_")) {
      // Handle date of birth fields
      const dobPart = name.split("_")[1];
      const numValue = parseInt(value) || 0;

      setUserData({
        ...userData,
        dob: {
          ...userData.dob,
          [dobPart]: numValue,
        },
      });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
     //edit user logics 
    } catch (error) {
      console.error("Error updating user profile", error);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state UI
  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Edit User Profile
            </h2>
            <span className="text-sm px-3 py-1 bg-red-100 text-red-800 rounded-full">
              Admin Mode
            </span>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
              <div className="flex">
                <CheckCircle className="h-5 w-5 mr-2" />
                <p>{successMessage}</p>
              </div>
            </div>
          )}

          {userData && (
            <>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information Section */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                      Basic Information
                    </h3>
                  </div>

                  {/* Name */}
                  <div className="form-group">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      <User className="h-5 w-5 text-gray-500 inline-block mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={userData?.name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      <Mail className="h-5 w-5 text-gray-500 inline-block mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userData?.email}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>

                  {/* Blood Group */}
                  <div className="form-group">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      <Droplet className="h-5 w-5 text-gray-500 inline-block mr-2" />
                      Blood Group
                    </label>
                    <select
                      name="blood_group"
                      value={userData?.blood_group}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    >
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                        (group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Gender */}
                  <div className="form-group">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      <User className="h-5 w-5 text-gray-500 inline-block mr-2" />
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={userData?.gender}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    >
                      {["Male", "Female", "Other"].map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div className="form-group md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      <Calendar className="h-5 w-5 text-gray-500 inline-block mr-2" />
                      Date of Birth
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-gray-500">Day</label>
                        <input
                          type="number"
                          name="dob_day"
                          min="1"
                          max="31"
                          value={userData?.dob.day}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Month</label>
                        <input
                          type="number"
                          name="dob_month"
                          min="1"
                          max="12"
                          value={userData?.dob.month}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Year</label>
                        <input
                          type="number"
                          name="dob_year"
                          min="1900"
                          max={new Date().getFullYear()}
                          value={userData?.dob.year}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="md:col-span-2 mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                      Contact Information
                    </h3>
                  </div>

                  {/* Phone Number */}
                  <div className="form-group">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      <Phone className="h-5 w-5 text-gray-500 inline-block mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={userData?.phone}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>

                  {/* Phone Number Visibility */}
                  <div className="form-group flex items-center">
                    <input
                      type="checkbox"
                      id="isPhoneNumberVisible"
                      name="isPhoneNumberVisible"
                      checked={userData?.isPhoneNumberVisible}
                      onChange={handleChange}
                      className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
                    />
                    <label
                      htmlFor="isPhoneNumberVisible"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Make phone number visible to other users
                    </label>
                  </div>

                  {/* Address */}
                  <div className="form-group md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      <MapPin className="h-5 w-5 text-gray-500 inline-block mr-2" />
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={userData?.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>

                  {/* Medical Information Section */}
                  <div className="md:col-span-2 mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                      Medical Information
                    </h3>
                  </div>

                  {/* NID */}
                  <div className="form-group">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      <Lock className="h-5 w-5 text-gray-500 inline-block mr-2" />
                      National ID Number
                    </label>
                    <input
                      type="number"
                      name="nid"
                      value={userData?.nid}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  {/* Donation Eligibility */}
                  <div className="form-group">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-gray-500 inline-block mr-2" />
                      Donation Eligibility
                    </label>
                    <select
                      name="donation_eligibility"
                      value={userData?.donation_eligibility}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="Eligible">Eligible</option>
                      <option value="Not Eligible">Not Eligible</option>
                      <option value="Temporarily Not Eligible">
                        Temporarily Not Eligible
                      </option>
                    </select>
                  </div>

                  {/* Smoker Status */}
                  <div className="form-group flex items-center">
                    <input
                      type="checkbox"
                      id="isSmoker"
                      name="isSmoker"
                      checked={userData?.isSmoker}
                      onChange={handleChange}
                      className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
                    />
                    <label
                      htmlFor="isSmoker"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Smoker
                    </label>
                  </div>

                  {/* Available for Donation */}
                  <div className="form-group flex items-center">
                    <input
                      type="checkbox"
                      id="isAvailableForDonation"
                      name="isAvailableForDonation"
                      checked={userData?.isAvailableForDonation}
                      onChange={handleChange}
                      className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
                    />
                    <label
                      htmlFor="isAvailableForDonation"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Available for Donation
                    </label>
                  </div>

                  {/* Critical Disease */}
                  <div className="form-group flex items-center">
                    <input
                      type="checkbox"
                      id="critical_disease"
                      name="critical_disease"
                      checked={userData?.critical_disease}
                      onChange={handleChange}
                      className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
                    />
                    <label
                      htmlFor="critical_disease"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Has Critical Disease
                    </label>
                  </div>

                  {/* Disease Description - Only show if critical_disease is true */}
                  {userData?.critical_disease && (
                    <div className="form-group md:col-span-2">
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        <AlertCircle className="h-5 w-5 text-gray-500 inline-block mr-2" />
                        Disease Description
                      </label>
                      <textarea
                        name="critical_disease_description"
                        value={userData?.critical_disease_description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  )}

                  {/* Admin Settings Section */}
                  <div className="md:col-span-2 mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                      Admin Settings
                    </h3>
                  </div>

                  {/* User Role */}
                  <div className="form-group">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      <Shield className="h-5 w-5 text-gray-500 inline-block mr-2" />
                      User Role
                    </label>
                    <select
                      name="role"
                      value={userData?.role}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="Donor">Donor</option>
                      <option value="Patient">Patient</option>
                      <option value="Both">Both</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  {/* Notification Preference */}
                  <div className="form-group">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      <Bell className="h-5 w-5 text-gray-500 inline-block mr-2" />
                      Notification Preference
                    </label>
                    <select
                      name="notificationPreference"
                      value={userData?.notificationPreference}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="Yes">Receive Notifications</option>
                      <option value="No">Do Not Receive Notifications</option>
                    </select>
                  </div>

                  {/* User Verification Status */}
                  <div className="form-group flex items-center">
                    <input
                      type="checkbox"
                      id="isVerified"
                      name="isVerified"
                      checked={userData?.isVerified}
                      onChange={handleChange}
                      className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
                    />
                    <label
                      htmlFor="isVerified"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Verified User
                    </label>
                  </div>

                  {/* Ban Status */}
                  <div className="form-group flex items-center">
                    <input
                      type="checkbox"
                      id="isBanned"
                      name="isBanned"
                      checked={userData?.isBanned}
                      onChange={handleChange}
                      className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
                    />
                    <label
                      htmlFor="isBanned"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Ban User
                    </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 justify-end mt-8">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center ${
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                        Updating...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditUserProfile;

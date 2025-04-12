"use client";

import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerNewUser } from "@/service/authService";
;
import { getUsersProfileInfo } from "@/service/userService";
import { AuthContext } from "@/context/AuthContext";
import { successMessage } from "@/utils/alertMessages";


export default function Register() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [userEmail, setUserEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // form state with default values
  const [formData, setFormData] = useState({
    name: "",
    blood_group: "A+",
    dob: { day: 1, month: 1, year: 2000 },
    gender: "Male",
    phone: "+880",
    photoURL: "",
    isPhoneNumberVisible: true,
    nid: "",
    address: "",
    email: "",
    isSmoker: false,
    critical_disease: false,
    critical_disease_description: "",
    notificationPreference: "Yes",
    role: "Both",
  });

  
  useEffect(() => {
    setMounted(true);
    const getCookieData = async () => {
      try {
        const Cookies = require("js-cookie");
        const email = Cookies.get("userEmail") || "";
        const id = Cookies.get("selfId") || null;
        setUserEmail(email);

        setFormData((prev) => ({
          ...prev,
          email: email,
        }));

        // Check if user already registered 
        if (id) {
          try {
            const userProfile = await getUsersProfileInfo(id);
            if (userProfile?.isRegistered) {
              console.log(
                "User already registered, redirecting to profile page"
              );
              router.push("/self-profile");
            } else {
              console.log(
                "User ID exists but not fully registered, continuing with registration"
              );
            }
          } catch (error) {
            console.error("Error checking user registration status:", error);
          }
        }
      } catch (error) {
        console.error("Error getting cookie data:", error);
      }
    };

    getCookieData();

    // user data from context
    if (authContext) {
      const { user } = authContext;
      const photo = user?.photoURL || "";
      setPhotoURL(photo);

      // Update form with photo URL
      setFormData((prev) => ({
        ...prev,
        photoURL: photo,
      }));
    }
  }, [authContext]);

  // Handle form input changes
  const handleChange = (e:any) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("dob_")) {
      // Handle date of birth fields
      setFormData({
        ...formData,
        dob: {
          ...formData.dob,
          [name.split("_")[1]]: parseInt(value) || "",
        },
      });
    } else {
      // Handle all other fields
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e:any) => {
    e.preventDefault();

    try {
      console.log("Form Data Submitted:", { ...formData });
      const res = await registerNewUser(formData);

      if (res?.success) {
        successMessage("Registration successful");
        setTimeout(() => {
          router.push("/home");
        }, 600);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  //  next step
  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  // previous step
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Check if current step is complete
  const isCurrentStepComplete = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.name &&
          formData.blood_group &&
          formData.dob.day &&
          formData.dob.month &&
          formData.dob.year
        );
      case 2:
        return (
          formData.gender && formData.phone && formData.nid && formData.address
        );
      case 3:
        return true;
      default:
        return false;
    }
  };

  //hydration handling
  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-pulse bg-white rounded-xl p-8 max-w-2xl w-full shadow-lg">
          <div className="h-8 bg-red-100 rounded mb-8 w-3/4 mx-auto"></div>
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Blood group options
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const genderOptions = ["Male", "Female", "Other"];
  const roleOptions = ["Donor", "Recipient", "Both"];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-red-100 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-red-600"
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
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Join Our Blood Donation Network
          </h1>
          <p className="mt-3 text-xl text-gray-600">
            Your contribution can save lives
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[...Array(totalSteps)].map((_, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-medium transition-all ${
                    idx + 1 === currentStep
                      ? "bg-red-600 text-white"
                      : idx + 1 < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {idx + 1 < currentStep ? (
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                <span
                  className={`text-sm mt-2 ${
                    idx + 1 === currentStep
                      ? "text-red-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {idx === 0
                    ? "Basic Info"
                    : idx === 1
                    ? "Contact Details"
                    : "Health & Preferences"}
                </span>
              </div>
            ))}
          </div>

          <div className="overflow-hidden h-2 mt-4 mb-4 flex rounded bg-gray-200">
            <div
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              className="bg-red-600 transition-all duration-300"
            ></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <form onSubmit={handleSubmit}>
              {/* Step 1 - Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Basic Information
                  </h2>

                  {/* Email */}
                  <div className="form-group">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2 text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userEmail}
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed focus:outline-none text-gray-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Name */}
                  <div className="form-group">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2 text-gray-700"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  {/* Blood Group */}
                  <div className="form-group">
                    <label
                      htmlFor="blood_group"
                      className="block text-sm font-medium mb-2 text-gray-700"
                    >
                      Blood Group <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="blood_group"
                        name="blood_group"
                        value={formData.blood_group}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                      >
                        {bloodGroups.map((bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="form-group">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <input
                          type="number"
                          id="dob_day"
                          name="dob_day"
                          placeholder="Day"
                          min={1}
                          max={31}
                          required
                          value={formData.dob.day}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          id="dob_month"
                          name="dob_month"
                          placeholder="Month"
                          min={1}
                          max={12}
                          required
                          value={formData.dob.month}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          id="dob_year"
                          name="dob_year"
                          placeholder="Year"
                          min={1900}
                          max={new Date().getFullYear()}
                          required
                          value={formData.dob.year}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 - Contact Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Contact Details
                  </h2>

                  {/* Gender */}
                  <div className="form-group">
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium mb-2 text-gray-700"
                    >
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-4">
                      {genderOptions.map((gender) => (
                        <div key={gender} className="flex items-center">
                          <input
                            type="radio"
                            id={`gender_${gender}`}
                            name="gender"
                            value={gender}
                            checked={formData.gender === gender}
                            onChange={handleChange}
                            className="h-4 w-4 text-red-600 focus:ring-red-500"
                          />
                          <label
                            htmlFor={`gender_${gender}`}
                            className="ml-2 text-gray-700"
                          >
                            {gender}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="form-group">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium mb-2 text-gray-700"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  {/* Phone number privacy check */}
                  <div className="form-group flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isPhoneNumberVisible"
                      name="isPhoneNumberVisible"
                      checked={formData.isPhoneNumberVisible === true}
                      onChange={handleChange}
                      className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
                    />
                    <label
                      htmlFor="isPhoneNumberVisible"
                      className="text-sm text-gray-700"
                    >
                      Allow others to see my contact number
                    </label>
                  </div>

                  {/* NID */}
                  <div className="form-group">
                    <label
                      htmlFor="nid"
                      className="block text-sm font-medium mb-2 text-gray-700"
                    >
                      National ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nid"
                      name="nid"
                      value={formData.nid}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  {/* Address */}
                  <div className="form-group">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium mb-2 text-gray-700"
                    >
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                      required
                    ></textarea>
                    <p className="mt-1.5 text-xs text-gray-500">
                      Enter your complete address for emergency contact purposes
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3 - Health & Preferences */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Health & Preferences
                  </h2>

                  {/* Health Information Section */}
                  <div className="bg-red-50 p-5 rounded-lg border border-red-100">
                    <h3 className="text-lg font-medium mb-4 text-gray-800">
                      Health Information
                    </h3>

                    {/* Smoker Checkbox */}
                    <div className="form-group flex items-center space-x-3 mb-4">
                      <input
                        type="checkbox"
                        id="isSmoker"
                        name="isSmoker"
                        checked={formData.isSmoker}
                        onChange={(e) => {
                          e.stopPropagation(); // Prevent event bubbling
                          handleChange(e);
                        }}
                        className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
                      />
                      <label
                        htmlFor="isSmoker"
                        className="text-sm text-gray-700"
                        onClick={(e) => e.preventDefault()} // Prevent clicking on label from triggering form
                      >
                        I am a smoker
                      </label>
                    </div>

                    {/* Critical Disease Checkbox */}
                    <div className="form-group flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="critical_disease"
                        name="critical_disease"
                        checked={formData.critical_disease}
                        onChange={(e) => {
                          e.stopPropagation(); // Prevent event bubbling
                          handleChange(e);
                        }}
                        className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
                      />
                      <label
                        htmlFor="critical_disease"
                        className="text-sm text-gray-700"
                        onClick={(e) => e.preventDefault()} // Prevent clicking on label from triggering form
                      >
                        I have a critical health condition
                      </label>
                    </div>

                    {formData.critical_disease && (
                      <div className="form-group mt-4">
                        <label
                          htmlFor="critical_disease_description"
                          className="block text-sm font-medium mb-2 text-gray-700"
                        >
                          Please describe your health condition
                        </label>
                        <textarea
                          id="critical_disease_description"
                          name="critical_disease_description"
                          value={formData.critical_disease_description}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>

                  {/* Role Selection */}
                  <div className="form-group">
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium mb-2 text-gray-700"
                    >
                      I want to register as:
                    </label>
                    <div className="grid grid-cols-3 gap-4 mb-2">
                      {roleOptions.map((role) => (
                        <div
                          key={role}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            formData.role === role
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 hover:border-red-200"
                          }`}
                          onClick={(e) => {
                            e.preventDefault(); // Prevent default behavior
                            e.stopPropagation(); // Stop event propagation
                            setFormData({ ...formData, role });
                          }}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={`role_${role}`}
                              name="role"
                              value={role}
                              checked={formData.role === role}
                              onChange={(e) => {
                                e.stopPropagation(); // Stop event propagation
                                handleChange(e);
                              }}
                              className="h-4 w-4 text-red-600 focus:ring-red-500"
                              onClick={(e) => e.stopPropagation()} // Stop click from bubbling up
                            />
                            <label
                              htmlFor={`role_${role}`}
                              className="ml-2 font-medium text-gray-700"
                              onClick={(e) => e.preventDefault()} // Prevent clicking on label from triggering form
                            >
                              {role}
                            </label>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {role === "Donor" &&
                              "I want to donate blood to help others"}
                            {role === "Recipient" &&
                              "I may need blood donations"}
                            {role === "Both" &&
                              "I want to both donate and receive blood"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notification Preference */}
                  <div className="form-group flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="notificationPreference"
                      name="notificationPreference"
                      checked={formData.notificationPreference === "Yes"}
                      onChange={(e) => {
                        e.preventDefault(); // Prevent default behavior from bubbling up
                        e.stopPropagation(); // Stop event propagation
                        setFormData({
                          ...formData,
                          notificationPreference:
                            formData.notificationPreference === "Yes"
                              ? "No"
                              : "Yes",
                        });
                      }}
                      className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
                    />
                    <label
                      htmlFor="notificationPreference"
                      className="text-sm text-gray-700"
                      onClick={(e) => e.preventDefault()} // Prevent clicking on label from triggering form
                    >
                      Send me notifications about donation requests in my area
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-10">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      prevStep();
                    }}
                    className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Back
                  </button>
                ) : (
                  <div></div> // Empty div to maintain layout with flex justify-between
                )}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      nextStep();
                    }}
                    disabled={!isCurrentStepComplete()}
                    className={`px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                      isCurrentStepComplete()
                        ? "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        : "bg-red-300 cursor-not-allowed"
                    }`}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Complete Registration
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Bottom info */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            By registering, you agree to our Terms of Service and Privacy
            Policy.
          </p>
          <p className="mt-2">
            Your information is secure and will only be used for blood donation
            purposes.
          </p>
          <div className="mt-4">
            <p className="font-medium text-red-600">Be a hero. Save a life.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

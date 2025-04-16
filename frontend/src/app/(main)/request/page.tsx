"use client";
import { postBloodRequest } from "@/service/bloodService";
import { useState, ChangeEvent, FormEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Calendar,
  User,
  MapPin,
  Phone,
  FileText,
  Droplet,
  AlertCircle,
} from "lucide-react";
import withAuth from "@/lib/hoc/withAuth";

function BloodRequestForm() {
  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: "",
    gender: "",
    bloodGroup: "",
    dateNeeded: null as Date | null,
    location: "",
    contactInfo: "",
    notes: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: Date | null) => {
    setFormData({ ...formData, dateNeeded: date });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await postBloodRequest(formData);
      setIsSubmitted(true);
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          patientName: "",
          patientAge: "",
          gender: "",
          bloodGroup: "",
          dateNeeded: null,
          location: "",
          contactInfo: "",
          notes: "",
        });
      }, 5000);
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 py-6 px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Droplet className="mr-2 h-6 w-6" />
              Blood Donation Request
            </h2>
            <div className="bg-white rounded-full p-2">
              <Droplet className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="text-red-100 mt-1">
            Please fill out the form completely to request blood donation
          </p>
        </div>

        {/* Success Message */}
        {isSubmitted && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Request submitted successfully! 
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Patient Information */}
            <div className="col-span-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                Patient Information
              </h3>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-500" />
                  Patient Name*
                </span>
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
                placeholder="Enter full name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-500" />
                  Patient Age*
                </span>
              </label>
              <input
                type="number"
                name="patientAge"
                min={0}
                max={120}
                value={formData.patientAge}
                onChange={handleChange}
                required
                placeholder="Enter age"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-500" />
                  Gender*
                </span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <Droplet className="h-4 w-4 mr-1 text-red-500" />
                  Blood Group*
                </span>
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all"
              >
                <option value="">Select blood group</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            {/* Request Details */}
            <div className="col-span-2 mb-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                Request Details
              </h3>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  Blood Requirement Date*
                </span>
              </label>
              <DatePicker
                selected={formData.dateNeeded}
                onChange={handleDateChange}
                dateFormat="d MMMM yyyy"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                placeholderText="Pick a date"
                minDate={new Date()}
                wrapperClassName="w-full"
                customInput={
                  <input className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all" />
                }
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  Hospital/Location*
                </span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Hospital name and address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <Phone className="h-4 w-4 mr-1 text-gray-500" />
                  Contact Information*
                </span>
              </label>
              <input
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                required
                placeholder="Phone number or email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
            </div>

            <div className="col-span-2 space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-1 text-gray-500" />
                  Additional Notes
                </span>
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any specific requirements or additional information"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                rows={3}
              />
            </div>
          </div>

          <div className="pt-4 flex items-center text-sm text-gray-600">
            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
            <p>Fields marked with * are required</p>
          </div>

          <button
            type="submit"
            disabled={isLoading || isSubmitted}
            className={`w-full mt-6 py-4 px-6 rounded-lg text-white font-medium text-lg flex items-center justify-center
              ${
                isLoading || isSubmitted
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 transition-all"
              }
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : isSubmitted ? (
              "Request Submitted"
            ) : (
              "Submit Blood Request"
            )}
          </button>
        </form>
      </div>

      <div className="mt-6 bg-red-50 p-4 rounded-lg border border-red-100">
        <h3 className="text-red-700 font-medium mb-2 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          Important Information
        </h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>
            Your request will be shared with potential donors in your area
          </li>
          <li>Please ensure all contact information is accurate</li>
          <li>Our team may contact you to verify details</li>
          <li>Urgent requests are prioritized based on medical necessity</li>
        </ul>
      </div>
    </div>
  );
}

export default withAuth(BloodRequestForm);
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Calendar,
  User,
  Phone,
  MapPin,
  FileText,
  Droplet,
  ChevronDown,
} from "lucide-react";
import { postAppointmentRequest } from "@/service/appointmentService";
import { successMessage } from "@/utils/alertMessages";
import withAuth from "@/lib/hoc/withAuth";



const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
function ScheduleAppointment() {
  const { donor } = useParams();
  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: "",
    patientGender: "",
    blood_group: "",
    contact_number: "",
    location: "",
    disease: "",
    additional_notes: "",
    date: "",
  });

  const handleChange = (e : any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    try {
      const result = await postAppointmentRequest(donor as string, formData);
      if (result.success) {
        successMessage("Appointment Request Sent");
        window.location.replace('/appointment/status');
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      alert("Failed to schedule appointment.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-8 px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Droplet className="mr-2 h-6 w-6" />
              Schedule Blood Donation
            </h2>
            <div className="bg-white rounded-full p-2 shadow-md">
              <Droplet className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-blue-100 mt-2">
            <Link
              href={`/user-profile/${donor}`}
              className="hover:underline flex items-center"
            >
              <User className="mr-1 h-4 w-4" /> View Donor Profile
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Patient Information */}
            <div className="col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-600" />
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                value={formData.patientAge}
                onChange={handleChange}
                required
                placeholder="Enter age"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-500" />
                  Patient Gender*
                </span>
              </label>
              <select
                name="patientGender"
                value={formData.patientGender}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
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
              <div className="relative">
                <select
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white pr-10"
                >
                  <option value="">Select blood group</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <Phone className="h-4 w-4 mr-1 text-gray-500" />
                  Contact Number*
                </span>
              </label>
              <input
                type="tel"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                required
                placeholder="Enter contact number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Donation Place & Disease Information */}
            <div className="col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center mt-4">
                <FileText className="mr-2 h-5 w-5 text-blue-600" />
                Additional Information
              </h3>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  Donation Place*
                </span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Enter donation place"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  Appointment Date*
                </span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-1 text-gray-500" />
                  Disease (if any)
                </span>
              </label>
              <input
                type="text"
                name="disease"
                value={formData.disease}
                onChange={handleChange}
                placeholder="Enter disease (if any)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-1 text-gray-500" />
                  Additional Notes
                </span>
              </label>
              <textarea
                name="additional_notes"
                value={formData.additional_notes}
                onChange={handleChange}
                placeholder="Enter any additional notes"
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-lg text-white font-medium text-lg flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(ScheduleAppointment);
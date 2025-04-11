"use client";

import {
  updateAppointmentStatus,
  viewAppointments,
} from "@/service/appointmentService";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Appointment {
  _id: string;
  patientName: string;
  patientGender: string;
  patientAge: number;
  blood_group: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  date: string;
  location: string;
  contact_number: string;
  disease?: string;
  additional_notes?: string;
  status: "Pending" | "Accepted" | "Rejected";
  applicant: string;
  donor: string;
  isDeleted: boolean;
}

export default function ViewAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selfId, setSelfId] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterBloodGroup, setFilterBloodGroup] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAppointmentSchedules = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { result, selfId } = await viewAppointments();
        console.log(result, selfId);
        if (result?.data) {
          setAppointments(result.data as Appointment[]);
          setSelfId(selfId);
        }
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Failed to load appointments. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    getAppointmentSchedules();
  }, []);

  const handleAppointmentStatus = async (
    appointmentId: string,
    newStatus: "Accepted" | "Rejected"
  ) => {
    try {
      setUpdatingAppointmentId(appointmentId);
      setError(null);
      const result = await updateAppointmentStatus(appointmentId, newStatus);
      if (result.success) {
        // Update the appointments list in state 
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, status: newStatus }
              : appointment
          )
        );
      } else {
        setError("Failed to update appointment status");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      setError("Failed to update appointment status. Please try again.");
    } finally {
      setUpdatingAppointmentId(null);
    }
  };

  // Filter appointments based on selected filters
  const filteredAppointments = appointments.filter((appointment) => {
    const statusMatch =
      filterStatus === "All" || appointment.status === filterStatus;
    const bloodGroupMatch =
      filterBloodGroup === "All" ||
      appointment.blood_group === filterBloodGroup;
    return statusMatch && bloodGroupMatch && !appointment.isDeleted;
  });

  // Sort appointments by date
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const statusOptions: Array<Appointment["status"]> = [
    "Pending",
    "Accepted",
    "Rejected",
  ];

  // Format date 
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  //  status badge color based on status
  const getStatusColor = (status: Appointment["status"]): string => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Accepted":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-red-700 mb-6">
          Blood Donation Appointments
        </h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-700"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-red-700 mb-6">
        Blood Donation Appointments
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filters and Sorting Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 w-full"
              >
                <option value="All">All Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Group
              </label>
              <select
                value={filterBloodGroup}
                onChange={(e) => setFilterBloodGroup(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 w-full"
              >
                <option value="All">All Blood Groups</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort by Date
            </label>
            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as "newest" | "oldest")
              }
              className="rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 w-full"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      {sortedAppointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-lg text-gray-500">
            No appointments found matching your filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {sortedAppointments.map((appointment : Appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="bg-red-50 p-4 border-b border-red-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Patient: {appointment.patientName}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Blood Group</p>
                    <p className="text-lg font-medium text-red-600">
                      {appointment.blood_group}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {formatDate(appointment.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{appointment.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Patient Details</p>
                    <p className="font-medium">
                      {appointment.patientGender}, {appointment.patientAge}{" "}
                      years
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{appointment.contact_number}</p>
                  </div>
                  {appointment.disease && (
                    <div>
                      <p className="text-sm text-gray-500">Disease</p>
                      <p className="font-medium">{appointment.disease}</p>
                    </div>
                  )}
                </div>

                {appointment.additional_notes && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Additional Notes</p>
                    <p className="text-sm">{appointment.additional_notes}</p>
                  </div>
                )}

                {appointment.applicant === selfId && (
                  <div>
                    <Link
                      href={`/user-profile/${appointment.donor}`}
                      className="text-sm cursor-pointer text-blue-500"
                    >
                      View Donor's Profile
                    </Link>
                  </div>
                )}
                {appointment.donor === selfId && (
                  <div>
                    <Link
                      href={`/user-profile/${appointment.applicant}`}
                      className="text-sm cursor-pointer text-blue-500"
                    >
                      View Applicant's Profile
                    </Link>
                  </div>
                )}

                {/* Action buttons for donors */}
                {selfId === appointment.donor &&
                  appointment.status === "Pending" && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() =>
                          handleAppointmentStatus(appointment._id, "Accepted")
                        }
                        disabled={updatingAppointmentId === appointment._id}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex-1 disabled:bg-green-300"
                      >
                        {updatingAppointmentId === appointment._id ? (
                          <span className="flex items-center justify-center">
                            <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                            Processing...
                          </span>
                        ) : (
                          "Accept"
                        )}
                      </button>
                      <button
                        onClick={() =>
                          handleAppointmentStatus(appointment._id, "Rejected")
                        }
                        disabled={updatingAppointmentId === appointment._id}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex-1 disabled:bg-red-300"
                      >
                        {updatingAppointmentId === appointment._id ? (
                          <span className="flex items-center justify-center">
                            <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                            Processing...
                          </span>
                        ) : (
                          "Reject"
                        )}
                      </button>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

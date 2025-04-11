"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import AppointmentSkeleton from "../_components/skeletons/AppointmentSkeleton";
import { getAllAppointments } from "../services/appointmentSerive";

// Appointment interfaces
interface Appointment {
  _id: string;
  patientName: string;
  patientAge: number;
  blood_group: string;
  date: string;
  location: string;
  donor: string;
  applicant: string;
}

interface SortConfig {
  key: keyof Appointment;
  direction: "asc" | "desc";
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "date",
    direction: "asc",
  });
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const getAppointments = async () => {
      setLoading(true);
      try {
        const res = await getAllAppointments();
        setAppointments(res);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    getAppointments();
  }, []);

  // Sort function
  const sortedAppointments = [...appointments].sort((a, b) => {
    if (sortConfig.key === "date") {
      return sortConfig.direction === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }

    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Request sort
  const requestSort = (key: keyof Appointment) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter and search function
  const filteredAppointments = sortedAppointments.filter((appointment) => {
    if (filter !== "all" && appointment.blood_group !== filter) {
      return false;
    }

    const searchFields = [
      appointment.patientName,
      appointment.location,
      appointment.blood_group,
    ]
      .join(" ")
      .toLowerCase();

    return searchFields.includes(searchTerm.toLowerCase());
  });

  // Format date 
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // unique blood groups filter
  const bloodGroups = [
    "all",
    ...Array.from(new Set(appointments.map((app) => app.blood_group))),
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Blood Donation Appointments
        </h1>
        <p className="text-gray-600">
          Manage upcoming blood donation appointments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">
            Total Appointments
          </h2>
          <p className="text-3xl font-bold text-blue-600">
            {appointments.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">
            Upcoming (Next 7 Days)
          </h2>
          <p className="text-3xl font-bold text-green-600">
            {
              appointments.filter((a) => {
                const appDate = new Date(a.date);
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                return appDate <= nextWeek && appDate >= new Date();
              }).length
            }
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">
            Most Common Blood Type
          </h2>
          <p className="text-3xl font-bold text-red-600">
            {bloodGroups.length > 1
              ? bloodGroups
                  .filter((bg) => bg !== "all")
                  .sort(
                    (a, b) =>
                      appointments.filter((app) => app.blood_group === b)
                        .length -
                      appointments.filter((app) => app.blood_group === a).length
                  )[0]
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-1/3">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search
            </label>
            <input
              type="text"
              id="search"
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by name, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full md:w-1/4">
            <label
              htmlFor="bloodFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Blood Group
            </label>
            <select
              id="bloodFilter"
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group === "all" ? "All Blood Groups" : group}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <label
              htmlFor="sortBy"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sort By
            </label>
            <select
              id="sortBy"
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={sortConfig.key}
              onChange={(e) => requestSort(e.target.value as keyof Appointment)}
            >
              <option value="date">Date</option>
              <option value="patientName">Patient Name</option>
              <option value="patientAge">Patient Age</option>
              <option value="location">Location</option>
              <option value="blood_group">Blood Group</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div>
            <AppointmentSkeleton />
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No appointments found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <button
                      className="font-medium text-gray-500 uppercase tracking-wider flex items-center"
                      onClick={() => requestSort("patientName")}
                    >
                      Patient
                      {sortConfig.key === "patientName" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <button
                      className="font-medium text-gray-500 uppercase tracking-wider flex items-center"
                      onClick={() => requestSort("blood_group")}
                    >
                      Blood Group
                      {sortConfig.key === "blood_group" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <button
                      className="font-medium text-gray-500 uppercase tracking-wider flex items-center"
                      onClick={() => requestSort("date")}
                    >
                      Date & Time
                      {sortConfig.key === "date" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <button
                      className="font-medium text-gray-500 uppercase tracking-wider flex items-center"
                      onClick={() => requestSort("location")}
                    >
                      Location
                      {sortConfig.key === "location" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    IDs
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.patientName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Age: {appointment.patientAge}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        {appointment.blood_group}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(appointment.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      <div>
                        Donor:{" "}
                        <span>
                          <Link
                            className="text-blue-400"
                            href={`/user-profile/${appointment.donor}`}
                          >
                            {appointment.donor}
                          </Link>
                        </span>
                      </div>
                      <div>
                        Applicant:{" "}
                        <span>
                          <Link
                            className="text-blue-400"
                            href={`/user-profile/${appointment.applicant}`}
                          >
                            {appointment.applicant}
                          </Link>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { getDonorsLists } from "@/service/userService";
import { useState, useEffect } from "react";
import {
  Search as SearchIcon,
  Filter,
  User,
  Users,
  Droplet,
  MessageCircle,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";

interface DateOfBirth {
  day: number;
  month: number;
  year: number;
}

interface UserData {
  _id: string;
  name: string;
  blood_group: string;
  gender: string;
  photoURL: string;
  nid: number;
  address: string;
  email: string;
  isSmoker: boolean;
  critical_disease: boolean;
  critical_disease_description: string;
  posts: any[];
  isAvailableForDonation: boolean;
  role: string;
  isRegistered: boolean;
  isVerified: boolean;
  isPhoneNumberVisible: boolean;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
  dob: DateOfBirth;
  __v: number;
}

interface FilterOptions {
  bloodGroup: string;
  gender: string;
  isAvailableForDonation: boolean | null;
  criticalDisease: boolean | null;
}

export default function Search() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<FilterOptions>({
    bloodGroup: "",
    gender: "",
    isAvailableForDonation: null,
    criticalDisease: null,
  });
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const selfId = Cookies.get("selfId");

  const bloodGroups: string[] = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ];

  useEffect(() => {
    const getDonors = async (): Promise<void> => {
      try {
        setLoading(true);
        const res = await getDonorsLists();
        const filterRes = res.filter((user: UserData) => user._id != selfId);
        setUsers(filterRes);
        setFilteredUsers(filterRes);
      } catch (error) {
        console.error("Error fetching donors:", error);
      } finally {
        setLoading(false);
      }
    };
    getDonors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, users]);

  const applyFilters = (): void => {
    let result = [...users];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.address.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.blood_group.toLowerCase().includes(term)
      );
    }

    if (filters.bloodGroup) {
      result = result.filter((user) => user.blood_group === filters.bloodGroup);
    }

    if (filters.gender) {
      result = result.filter((user) => user.gender === filters.gender);
    }

    if (filters.isAvailableForDonation !== null) {
      result = result.filter(
        (user) => user.isAvailableForDonation === filters.isAvailableForDonation
      );
    }

    if (filters.criticalDisease !== null) {
      result = result.filter(
        (user) => user.critical_disease === filters.criticalDisease
      );
    }

    setFilteredUsers(result);
  };

  const resetFilters = (): void => {
    setFilters({
      bloodGroup: "",
      gender: "",
      isAvailableForDonation: null,
      criticalDisease: null,
    });
    setSearchTerm("");
  };

  const getAgeFromDOB = (dob: DateOfBirth): number => {
    const birthDate = new Date(dob.year, dob.month - 1, dob.day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className="container mx-auto px-4 py-10 bg-gray-50 min-h-screen">
      {/* Header with Title and Description */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-3 text-gray-800">
          Blood Donor Directory
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find compatible blood donors quickly and easily. Use filters to narrow
          your search and connect directly with potential donors.
        </p>
      </div>

      {/* Search and Filter Box */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, location, or blood group"
              className="pl-12 pr-4 py-3.5 w-full border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3.5 rounded-lg hover:bg-red-700 transition font-medium min-w-[120px]"
          >
            <Filter className="h-5 w-5" />
            {isFilterOpen ? "Hide Filters" : "Filters"}
          </button>
        </div>

        {isFilterOpen && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={filters.bloodGroup}
                  onChange={(e) =>
                    setFilters({ ...filters, bloodGroup: e.target.value })
                  }
                >
                  <option value="">All Blood Groups</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={filters.gender}
                  onChange={(e) =>
                    setFilters({ ...filters, gender: e.target.value })
                  }
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability Status
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={
                    filters.isAvailableForDonation === null
                      ? ""
                      : filters.isAvailableForDonation.toString()
                  }
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      isAvailableForDonation:
                        e.target.value === ""
                          ? null
                          : e.target.value === "true",
                    })
                  }
                >
                  <option value="">All Availability</option>
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Status
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={
                    filters.criticalDisease === null
                      ? ""
                      : filters.criticalDisease.toString()
                  }
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      criticalDisease:
                        e.target.value === ""
                          ? null
                          : e.target.value === "true",
                    })
                  }
                >
                  <option value="">All Health Status</option>
                  <option value="false">No Critical Disease</option>
                  <option value="true">Has Critical Disease</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={resetFilters}
                className="text-gray-600 hover:text-red-600 mr-4 font-medium py-2.5 px-4"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="bg-red-600 text-white px-6 py-2.5 rounded-md hover:bg-red-700 font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Mode and Results Count */}
      {!loading && (
        <div className="mb-6 bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
          <p className="text-lg font-medium text-gray-700">
            <span className="text-red-600 font-bold">
              {filteredUsers.length}
            </span>{" "}
            donor{filteredUsers.length !== 1 && "s"} found
          </p>
          <div className="flex items-center gap-4">
            {Object.values(filters).some(
              (val) => val !== "" && val !== null
            ) && (
              <button
                onClick={resetFilters}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Clear all filters
              </button>
            )}
            <div className="flex gap-2 border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-red-50 text-red-600"
                    : "bg-white text-gray-600"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-red-50 text-red-600"
                    : "bg-white text-gray-600"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading, Empty State, or Results */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-sm p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-500 mb-4"></div>
          <p className="text-gray-600">Finding donors...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <Users className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-6 text-xl font-medium text-gray-900">
            No donors found
          </h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            Try adjusting your search or filter criteria to find more donors
          </p>
          <button
            onClick={resetFilters}
            className="mt-6 text-white bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-lg font-medium transition"
          >
            Reset all filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-200 flex flex-col"
            >
              {/* Blood Type and Availability Banner */}
              <div className="bg-gradient-to-r from-red-100 to-red-200 p-4 relative">
                <div className="absolute top-4 right-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.isAvailableForDonation
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {user.isAvailableForDonation
                      ? "Available"
                      : "Not available"}
                  </span>
                </div>

                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-2 border-red-200 shadow-sm">
                    <span className="text-xl font-bold text-red-600">
                      {user.blood_group}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {user.name}
                  </h3>
                  <p className="text-gray-500 text-sm flex items-center justify-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {user.address}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-50 p-2 rounded flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">Age</span>
                    <span className="font-medium text-gray-800">
                      {getAgeFromDOB(user.dob)}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">Gender</span>
                    <span className="font-medium text-gray-800">
                      {user.gender}
                    </span>
                  </div>
                </div>

                <div className="flex items-center mb-4 justify-between text-sm">
                  <div className="flex items-center">
                    <span className="mr-1 text-gray-500">Health:</span>
                    <span
                      className={`flex items-center ${
                        user.critical_disease
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {user.critical_disease ? (
                        <>
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Issue
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Healthy
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1 text-gray-500">Smoker:</span>
                    <span
                      className={`${
                        user.isSmoker ? "text-yellow-600" : "text-green-600"
                      }`}
                    >
                      {user.isSmoker ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  <Link
                    href={`/user-profile/${user?._id}`}
                    className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-700 text-white rounded-lg text-center text-sm font-medium transition"
                  >
                    View Profile
                  </Link>
                  <Link
                    href={`/chat/${user?._id}`}
                    className="flex items-center justify-center px-3 py-2.5 bg-green-500 hover:bg-green-700 text-white rounded-lg transition"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row">
                <div className="bg-gradient-to-r from-red-100 to-red-200 p-4 md:w-48 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-2 border-red-200 shadow-sm">
                    <span className="text-xl font-bold text-red-600">
                      {user.blood_group}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {user.name}
                      </h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {user.address}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.isAvailableForDonation
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.isAvailableForDonation
                        ? "Available for donation"
                        : "Not available"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-gray-50 p-2 rounded flex items-center justify-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-800">
                        {getAgeFromDOB(user.dob)} years
                      </span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded flex items-center justify-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-800">{user.gender}</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded flex items-center justify-center">
                      <span
                        className={`flex items-center ${
                          user.critical_disease
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {user.critical_disease ? (
                          <>
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Health Issue
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Healthy
                          </>
                        )}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded flex items-center justify-center">
                      <span
                        className={`${
                          user.isSmoker ? "text-yellow-600" : "text-green-600"
                        }`}
                      >
                        {user.isSmoker ? "Smoker" : "Non-smoker"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Link
                      href={`/user-profile/${user?._id}`}
                      className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-700 text-white rounded-lg text-center text-sm font-medium transition"
                    >
                      View Profile
                    </Link>
                    <Link
                      href={`/chat/${user?._id}`}
                      className="w-36 flex items-center justify-center px-4 py-2.5 bg-green-500 hover:bg-green-700 text-white rounded-lg transition gap-2"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Message
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
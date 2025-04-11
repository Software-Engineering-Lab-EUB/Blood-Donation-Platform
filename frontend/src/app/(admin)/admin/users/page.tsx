"use client";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  User,
  MapPin,
  Calendar,
  Cigarette,
  Ban,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Edit,
  Trash2,
} from "lucide-react";
import { getAllUers } from "../services/userService";
import Link from "next/link";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // State for Filters and Sorting
  const [filters, setFilters] = useState({
    name: "",
    bloodGroup: "Any",
    location: "",
    role: "Both",
    smoker: "Any",
    banned: "Any",
    minAge: "",
    maxAge: "",
  });

  const [sort, setSort] = useState({
    field: "name",
    direction: "asc",
  });

  // Fetching users
  useEffect(() => {
    const getUsersList = async () => {
      try {
        const res = await getAllUers();
        setUsers(res);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    getUsersList();
  }, []);

  // Calculate age 
  const calculateAge = (dob: any) => {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob.year, dob.month - 1, dob.day);
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

  // Sorting Logic
  const sortUsers = (users: any) => {
    return users.sort((a: any, b: any) => {
      if (sort.field === "age") {
        const ageA = calculateAge(a.dob);
        const ageB = calculateAge(b.dob);
        return sort.direction === "asc" ? ageA - ageB : ageB - ageA;
      }

      if (a[sort.field] < b[sort.field])
        return sort.direction === "asc" ? -1 : 1;
      if (a[sort.field] > b[sort.field])
        return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Filtering Logic
  const filterUsers = (users: any) => {
    return users.filter((user: any) => {
      const userAge = calculateAge(user.dob);

      return (
        (!filters.name ||
          user.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (filters.bloodGroup === "Any" ||
          user.blood_group === filters.bloodGroup) &&
        (!filters.location ||
          user.address
            .toLowerCase()
            .includes(filters.location.toLowerCase())) &&
        (filters.role === "" ||
          (filters.role === "Both" &&
            (user.role === "Donor" || user.role === "Receiver")) ||
          user.role === filters.role) &&
        (filters.smoker === "Any" ||
          (filters.smoker === "Yes" ? user.isSmoker : !user.isSmoker)) &&
        (filters.banned === "Any" ||
          (filters.banned === "Yes" ? user.isBanned : !user.isBanned)) &&
        (!filters.minAge || userAge >= parseInt(filters.minAge)) &&
        (!filters.maxAge || userAge <= parseInt(filters.maxAge))
      );
    });
  };

  const filteredAndSortedUsers = sortUsers(filterUsers(users));

  // Function to clear all filters
  const clearFilters = () => {
    setFilters({
      name: "",
      bloodGroup: "Any",
      location: "",
      role: "Both",
      smoker: "Any",
      banned: "Any",
      minAge: "",
      maxAge: "",
    });
  };

  //toggle sort direction for a field
  const toggleSort = (field: string) => {
    setSort({
      field,
      direction:
        sort.field === field && sort.direction === "asc" ? "desc" : "asc",
    });
  };

  // Handle filter change
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        {!loading && (
          <>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showFilters ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Filter className="w-4 h-4" />
                )}
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
          </>
        )}
      </div>

      {/*  Filters */}
      {showFilters && (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Name Filter */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </span>
                <input
                  type="text"
                  name="name"
                  placeholder="Filter by name"
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.name}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Blood Group Filter */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.bloodGroup}
                onChange={handleFilterChange}
              >
                <option value="Any">Any Blood Group</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="O+">O+</option>
                <option value="AB+">AB+</option>
                <option value="A-">A-</option>
                <option value="B-">B-</option>
                <option value="O-">O-</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            {/* Location Filter */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </span>
                <input
                  type="text"
                  name="location"
                  placeholder="Filter by location"
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.location}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                name="role"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.role}
                onChange={handleFilterChange}
              >
                <option value="">Any Role</option>
                <option value="Donor">Donor</option>
                <option value="Receiver">Receiver</option>
                <option value="Both">Both</option>
              </select>
            </div>

            {/* Age Range Filter */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Age Range
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    name="minAge"
                    placeholder="Min"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.minAge}
                    onChange={handleFilterChange}
                    min="0"
                  />
                </div>
                <div className="relative flex-1">
                  <input
                    type="number"
                    name="maxAge"
                    placeholder="Max"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.maxAge}
                    onChange={handleFilterChange}
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Smoker Filter */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Smoker
              </label>
              <select
                name="smoker"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.smoker}
                onChange={handleFilterChange}
              >
                <option value="Any">Any</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Banned Filter */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Banned Status
              </label>
              <select
                name="banned"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.banned}
                onChange={handleFilterChange}
              >
                <option value="Any">Any</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Sort By
              </label>
              <div className="flex space-x-2">
                <select
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={sort.field}
                  onChange={(e) => setSort({ ...sort, field: e.target.value })}
                >
                  <option value="name">Name</option>
                  <option value="age">Age</option>
                  <option value="blood_group">Blood Group</option>
                  <option value="role">Role</option>
                </select>
                <button
                  className="p-2 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                  onClick={() =>
                    setSort({
                      ...sort,
                      direction: sort.direction === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  {sort.direction === "asc" ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {filteredAndSortedUsers.length} of {users.length} users
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={clearFilters}
            >
              <RefreshCw className="w-4 h-4" />
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-700">Loading users...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-4 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3 border">Id</th>
                <th
                  className="p-3 border cursor-pointer hover:bg-gray-300"
                  onClick={() => toggleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Name
                    {sort.field === "name" &&
                      (sort.direction === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th className="p-3 border">Blood Group</th>
                <th className="p-3 border">Gender</th>
                <th
                  className="p-3 border cursor-pointer hover:bg-gray-300"
                  onClick={() => toggleSort("age")}
                >
                  <div className="flex items-center gap-1">
                    Age/DOB
                    {sort.field === "age" &&
                      (sort.direction === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th className="p-3 border">Phone</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">NID</th>
                <th className="p-3 border">Address</th>
                <th
                  className="p-3 border cursor-pointer hover:bg-gray-300"
                  onClick={() => toggleSort("role")}
                >
                  <div className="flex items-center gap-1">
                    Role
                    {sort.field === "role" &&
                      (sort.direction === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th className="p-3 border text-center">Smoker</th>
                <th className="p-3 border text-center">Critical Disease</th>
                <th className="p-3 border text-center">Available</th>
                <th className="p-3 border">Notification</th>
                <th className="p-3 border">Eligibility</th>
                <th className="p-3 border text-center">Registered</th>
                <th className="p-3 border text-center">Verified</th>
                <th className="p-3 border text-center">Phone Visible</th>
                <th className="p-3 border text-center">Banned</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedUsers.length > 0 ? (
                filteredAndSortedUsers.map((user: any) => (
                  <tr key={user._id} className="hover:bg-gray-100">
                    <td className="p-3 border">{user._id}</td>
                    <td className="p-3 border">{user.name}</td>
                    <td className="p-3 border">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          user.blood_group.includes("+")
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.blood_group}
                      </span>
                    </td>
                    <td className="p-3 border">{user.gender}</td>
                    <td className="p-3 border">
                      <div className="flex gap-1 items-center">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {user.dob?.day}/{user.dob?.month}/{user.dob?.year}
                        <span className="text-xs text-gray-500 ml-1">
                          ({calculateAge(user.dob)} y)
                        </span>
                      </div>
                    </td>
                    <td className="p-3 border">{user.phone}</td>
                    <td className="p-3 border">{user.email}</td>
                    <td className="p-3 border">{user.nid}</td>
                    <td className="p-3 border">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        {user.address}
                      </div>
                    </td>
                    <td className="p-3 border">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === "Donor"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3 border text-center">
                      {user.isSmoker ? (
                        <Cigarette className="text-red-500 mx-auto" />
                      ) : (
                        <CheckCircle className="text-green-500 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 border text-center">
                      {user.critical_disease ? (
                        <XCircle className="text-red-500 mx-auto" />
                      ) : (
                        <CheckCircle className="text-green-500 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 border text-center">
                      {user.isAvailableForDonation ? (
                        <CheckCircle className="text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 border">
                      {user.notificationPreference}
                    </td>
                    <td className="p-3 border">
                      {user.donation_eligibility || "N/A"}
                    </td>
                    <td className="p-3 border text-center">
                      {user.isRegistered ? (
                        <CheckCircle className="text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="text-gray-500 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 border text-center">
                      {user.isVerified ? (
                        <CheckCircle className="text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 border text-center">
                      {user.isPhoneNumberVisible ? (
                        <Eye className="text-green-500 mx-auto" />
                      ) : (
                        <EyeOff className="text-gray-500 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 border text-center">
                      {user.isBanned ? (
                        <Ban className="text-red-500 mx-auto" />
                      ) : (
                        <CheckCircle className="text-green-500 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 border text-center">
                      <div className="flex items-center justify-center gap-4">
                        {/* Edit Button */}
                        <Link
                          href={`/admin/edit-user/${user._id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                        >
                          <Edit className="h-5 w-5" /> <span>Edit</span>
                        </Link>

                        {/* Delete Button */}
                        <button className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
                          <Trash2 className="h-5 w-5" /> <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={19} className="text-center py-4">
                    No users found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

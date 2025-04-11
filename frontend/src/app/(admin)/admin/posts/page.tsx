"use client";
import { useEffect, useState } from "react";

import { Calendar, MapPin, User, Trash2, Filter, X } from "lucide-react";
import { getAllPosts } from "../services/postService";

export default function Posts() {
  const [posts, setPosts] = useState<any>([]);
  const [filteredPosts, setFilteredPosts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter states
  const [filters, setFilters] = useState({
    patientName: "",
    minAge: "",
    maxAge: "",
    bloodGroup: "",
    dateFrom: "",
    dateTo: "",
    location: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const getAllUsersPosts = async () => {
      try {
        const result = await getAllPosts();
        setPosts(result);
        setFilteredPosts(result);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    getAllUsersPosts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, posts]);

  const applyFilters = () => {
    let filtered = [...posts];

    // Filter by patient name
    if (filters.patientName) {
      filtered = filtered.filter((post) =>
        post.patientName
          .toLowerCase()
          .includes(filters.patientName.toLowerCase())
      );
    }

    // Filter by age range
    if (filters.minAge) {
      filtered = filtered.filter(
        (post) => post.patientAge >= parseInt(filters.minAge)
      );
    }
    if (filters.maxAge) {
      filtered = filtered.filter(
        (post) => post.patientAge <= parseInt(filters.maxAge)
      );
    }

    // Filter by blood group
    if (filters.bloodGroup) {
      filtered = filtered.filter(
        (post) => post.bloodGroup === filters.bloodGroup
      );
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(
        (post) => new Date(post.dateNeeded) >= fromDate
      );
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59); // Set to end of day
      filtered = filtered.filter((post) => new Date(post.dateNeeded) <= toDate);
    }

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter((post) =>
        post.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      patientName: "",
      minAge: "",
      maxAge: "",
      bloodGroup: "",
      dateFrom: "",
      dateTo: "",
      location: "",
    });
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleDeletePost = (postId: string) => {
    // Delete logic....
    console.log(`Delete post with ID: ${postId}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Blood Donation Posts
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showFilters ? (
              <X className="w-4 h-4 mr-2" />
            ) : (
              <Filter className="w-4 h-4 mr-2" />
            )}
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          {showFilters && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name
              </label>
              <input
                type="text"
                name="patientName"
                value={filters.patientName}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={filters.bloodGroup}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Filter by location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="minAge"
                  value={filters.minAge}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Min"
                  min="0"
                />
                <input
                  type="number"
                  name="maxAge"
                  value={filters.maxAge}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Max"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Needed (From)
              </label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Needed (To)
              </label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredPosts.length} of {posts.length} posts
          </div>
        </div>
      )}

      {/* Posts Table */}
      {loading ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading posts...</div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-left table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  Age
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  Blood Group
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  Date Needed
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  Location
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post: any) => (
                  <tr key={post._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {post.patientName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {post.patientAge}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          post.bloodGroup.includes("+")
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {post.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {new Date(post.dateNeeded).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {post.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {post.contactInfo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <button
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                        onClick={() => handleDeletePost(post._id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-lg text-gray-500"
                  >
                    No posts available matching your filters.
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

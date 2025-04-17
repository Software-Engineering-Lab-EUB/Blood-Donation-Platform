"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, Edit, Search, X } from "lucide-react";
import {
  addNewBloodBank,
  deleteBloodBank,
  getAllBloodBanks,
} from "../services/bloodBanksService";
import { useRouter } from "next/navigation";

const BloodBankAdminPage = () => {
  const [bloodBanks, setBloodBanks] = useState<any[]>([]);
  const [filteredBanks, setFilteredBanks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    name: "",
    registration_id: "",
    location: "",
    contactNumber: "",
  });

  const router = useRouter();

  useEffect(() => {
    fetchBloodBanks();
  }, []);

  // filters
  useEffect(() => {
    if (bloodBanks.length > 0) {
      const filtered = bloodBanks.filter(
        (bank) =>
          bank.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (locationFilter === "" ||
            bank.location.toLowerCase() === locationFilter.toLowerCase())
      );
      setFilteredBanks(filtered);
    }
  }, [searchTerm, locationFilter, bloodBanks]);

  // Fetch blood banks from API
  const fetchBloodBanks = async () => {
    setIsLoading(true);
    try {
      const data = await getAllBloodBanks();
      // Filter out deleted blood banks
      const activeBanks = data.filter((bank: any) => !bank.isDeleted);
      setBloodBanks(activeBanks);
      setFilteredBanks(activeBanks);
    } catch (error) {
      console.error("Error fetching blood banks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addNewBloodBank(formData);
      setShowModal(false);
      resetForm();
      fetchBloodBanks();
    } catch (error) {
      console.error("Error adding blood bank:", error);
    }
  };

  // handle form data
  const resetForm = () => {
    setFormData({
      name: "",
      registration_id: "",
      location: "",
      contactNumber: "",
    });
    setEditMode(false);
    setCurrentId("");
  };

  // Handle edit
  const handleEdit = (id: string) => {
    setEditMode(true);
    setCurrentId(id);
    router.push(`/admin/edit-blood-bank/${id}`);
  };

  const handleDelete = async (id: string) => {
    setDeleteLoading(true);
    try {
      const result = await deleteBloodBank(id);
      if (result && !result.error) {
        setBloodBanks(bloodBanks.filter((bank) => bank._id !== id));
        setDeleteConfirm(null);
      } else {
        alert("Failed to delete blood bank");
      }
    } catch (error) {
      console.error("Error deleting blood bank:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  //locations filtering
  const uniqueLocations = [...new Set(bloodBanks.map((bank) => bank.location))];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blood Bank Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={20} />
          Add New Blood Bank
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Locations</option>
          {uniqueLocations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Blood Banks Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredBanks.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No blood banks found
                  </td>
                </tr>
              ) : (
                filteredBanks.map((bank) => (
                  <tr key={bank._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {bank.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bank.registration_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bank.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bank.contactNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(bank._id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(bank._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this blood bank? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-200 flex items-center"
              >
                {deleteLoading ? (
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                ) : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Add/Edit Blood Bank */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editMode ? "Edit Blood Bank" : "Add New Blood Bank"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="registration_id"
                >
                  Registration ID
                </label>
                <input
                  type="text"
                  id="registration_id"
                  name="registration_id"
                  value={formData.registration_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="location"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="contactNumber"
                >
                  Contact Number
                </label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editMode ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodBankAdminPage;
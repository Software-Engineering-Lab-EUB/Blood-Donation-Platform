"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit, AlertCircle, Plus, X } from "lucide-react";
import {
  deleteCampaign,
  getAllCampaigns,
  addNewCampaign,
} from "../services/campaignService";

export default function CampaignListPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    host: "",
    date: "",
    location: "",
    start_time: "",
    contactNumber: "",
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const data = await getAllCampaigns();
      setCampaigns(data || []);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteLoading(true);
    try {
      const result = await deleteCampaign(id);
      if (result && !result.error) {
        setCampaigns(campaigns.filter((campaign) => campaign._id !== id));
        setDeleteConfirm(null);
      } else {
        alert("Failed to delete campaign");
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/edit-campaign/${id}`);
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
    setIsSubmitting(true);

    try {
      const result = await addNewCampaign(formData);
      if (result && !result.error) {
        resetForm();
        setShowModal(false);
        fetchCampaigns(); 
      } else {
        alert("Failed to add campaign");
      }
    } catch (error) {
      console.error("Error adding campaign:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      title: "",
      host: "",
      date: "",
      location: "",
      start_time: "",
      contactNumber: "",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Campaign Management
        </h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 rounded-lg hover:bg-blue-700 text-white font-medium py-2 px-4 shadow transition duration-200 flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Campaign
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-800">
            No campaigns found
          </h3>
          <p className="text-gray-600 mt-2">
            Create a new campaign to get started.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Host
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact
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
                {campaigns.map((campaign) => (
                  <tr key={campaign._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {campaign.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {campaign.host}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {formatDate(campaign.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {campaign.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {campaign.start_time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {campaign.contactNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(campaign._id)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded p-2 transition duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(campaign._id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded p-2 transition duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Campaign Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Add New Campaign
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Campaign Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter campaign title"
                  required
                />
              </div>

              {/* Host */}
              <div>
                <label
                  htmlFor="host"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Host Organization
                </label>
                <input
                  type="text"
                  id="host"
                  name="host"
                  value={formData.host}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter host organization"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="date"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter location"
                  required
                />
              </div>

              {/* Start Time */}
              <div>
                <label
                  htmlFor="start_time"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Time
                </label>
                <input
                  type="time"
                  id="start_time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {/* Contact Number */}
              <div>
                <label
                  htmlFor="contactNumber"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter contact number"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Adding...
                    </>
                  ) : (
                    "Add Campaign"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this campaign? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-200"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-200 flex items-center"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
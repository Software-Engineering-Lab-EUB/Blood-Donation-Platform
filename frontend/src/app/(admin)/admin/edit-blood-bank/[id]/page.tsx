"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getBloodBankDetails,
  updateBloodBank,
  deleteBloodBank,
} from "../../services/bloodBanksService";
import { ArrowLeft, MapPin, Phone, Trash2 } from "lucide-react";
import Link from "next/link";

const EditBloodBankPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [bloodBank, setBloodBank] = useState<any>({
    name: "",
    registration_id: "",
    location: "",
    contactNumber: "",
  });

  useEffect(() => {
    const fetchBloodBankDetails = async () => {
      if (!id) return;

      try {
        const data = await getBloodBankDetails(id as string);
        if (data) {
          setBloodBank(data);
        } else {
          setFormError("Blood bank not found");
        }
      } catch (error) {
        console.error("Failed to fetch blood bank details:", error);
        setFormError("Failed to load blood bank details");
      } finally {
        setLoading(false);
      }
    };

    fetchBloodBankDetails();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBloodBank((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      if (
        !bloodBank.name ||
        !bloodBank.registration_id ||
        !bloodBank.location ||
        !bloodBank.contactNumber
      ) {
        setFormError("All fields are required");
        setSubmitting(false);
        return;
      }

      const result = await updateBloodBank(id as string, bloodBank);

      if (result && !result.error) {
        router.push("/admin/blood-banks");
      } else {
        setFormError(result?.message || "Failed to update blood bank");
      }
    } catch (error) {
      console.error("Error updating blood bank:", error);
      setFormError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blood bank?"
    );
    if (confirmDelete) {
      try {
        const result = await deleteBloodBank(id as string);
        if (result && !result.error) {
          router.push("/admin/blood-banks");
        } else {
          alert(result?.message || "Failed to delete blood bank");
        }
      } catch (error) {
        console.error("Error deleting blood bank:", error);
        alert("An error occurred while deleting the blood bank");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/admin/blood-banks"
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Blood Banks
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Edit Blood Bank
        </h1>

        {formError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{formError}</p>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="name"
            >
              Blood Bank Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={bloodBank.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="registration_id"
            >
              Registration ID
            </label>
            <input
              type="text"
              id="registration_id"
              name="registration_id"
              value={bloodBank.registration_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="location"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={bloodBank.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="contactNumber"
            >
              Contact Number
            </label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={bloodBank.contactNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/blood-banks"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded transition duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Updating...
                </>
              ) : (
                "Update Blood Bank"
              )}
            </button>
          </div>
        </form>

        {/* Delete Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded shadow transition duration-200"
          >
            <Trash2 className="inline-block mr-2" />
            Delete Blood Bank
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBloodBankPage;
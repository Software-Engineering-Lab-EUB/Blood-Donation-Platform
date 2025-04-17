"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";
import { getCampaignDetails, updateCampaign } from "../../services/campaignService";

export default function EditCampaignPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [campaign, setCampaign] = useState<any>({
    title: "",
    host: "",
    date: new Date(),
    location: "",
    start_time: "",
    contactNumber: "",
  });

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (!id) return;

      try {
        const data = await getCampaignDetails(id as string);
        if (data) {
          // Format date for date input
          const campaignDate = new Date(data.date);
          const formattedDate = campaignDate.toISOString().split("T")[0];

          setCampaign({
            ...data,
            date: formattedDate,
          });
        } else {
          setFormError("Campaign not found");
        }
      } catch (error) {
        console.error("Failed to fetch campaign details:", error);
        setFormError("Failed to load campaign details");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCampaign((prev:any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      // Validation
      if (
        !campaign.title ||
        !campaign.host ||
        !campaign.date ||
        !campaign.location ||
        !campaign.start_time ||
        !campaign.contactNumber
      ) {
        setFormError("All fields are required");
        setSubmitting(false);
        return;
      }

      const result = await updateCampaign(id as string, campaign);

      if (result && !result.error) {
        router.push("/admin/campaigns");
      } else {
        setFormError(result?.message || "Failed to update campaign");
      }
    } catch (error) {
      console.error("Error updating campaign:", error);
      setFormError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
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
          href="/admin/campaigns"
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Campaigns
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Campaign</h1>

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
              htmlFor="title"
            >
              Campaign Title
            </label>
            <div className="relative">
              <input
                type="text"
                id="title"
                name="title"
                value={campaign.title}
                onChange={handleChange}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter campaign title"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h10M7 16h10"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="host"
            >
              Host
            </label>
            <div className="relative">
              <input
                type="text"
                id="host"
                name="host"
                value={campaign.host}
                onChange={handleChange}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter host name"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <User className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="date"
            >
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="date"
                name="date"
                value={
                  campaign.date instanceof Date
                    ? campaign.date.toISOString().split("T")[0]
                    : campaign.date
                }
                onChange={handleChange}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="location"
            >
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                id="location"
                name="location"
                value={campaign.location}
                onChange={handleChange}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter location"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="start_time"
            >
              Start Time
            </label>
            <div className="relative">
              <input
                type="time"
                id="start_time"
                name="start_time"
                value={campaign.start_time}
                onChange={handleChange}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="contactNumber"
            >
              Contact Number
            </label>
            <div className="relative">
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={campaign.contactNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter contact number"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Phone className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/campaign"
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
                "Update Campaign"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
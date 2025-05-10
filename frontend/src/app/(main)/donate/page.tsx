"use client";
import React, { useState, useEffect } from "react";

import {
  MapPin,
  Phone,
  Calendar,
  User,
  Clock,
  MessageCircle,
  Search,
  Filter,
  X,
  CalendarDays,
  Globe,
} from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import withAuth from "@/lib/hoc/withAuth";
import { getAllBloodRequestsPosts, getBloodBanksList } from "@/service/bloodService";
import { getCampaignsList } from "@/service/campaignService";

//  types
interface BloodBank {
  _id: string;
  name: string;
  registration_id: string;
  location: string;
  contactNumber: string;
}

interface Post {
  _id: string;
  user: any;
  patientName: string;
  patientAge: number;
  gender: "Male" | "Female" | "Others";
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  dateNeeded: string;
  location: string;
  contactInfo: string;
  notes?: string;
}

interface Campaign {
  _id?: string;
  title: string;
  host: string;
  date: string;
  location: string;
  start_time: string;
  contactNumber: string;
  isDeleted?: boolean;
}

function Donate() {
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "banks" | "requests" | "campaigns"
  >("banks");
  const [searchTerm, setSearchTerm] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const selfId = Cookies.get("selfId");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [banksData, postsData, campaignsData] = await Promise.all([
          getBloodBanksList(),
          getAllBloodRequestsPosts(),
          getCampaignsList(),
        ]);
        setBloodBanks(banksData || []);
        setPosts(postsData || []);
        setCampaigns(campaignsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter functions
  const filteredBanks = bloodBanks.filter(
    (bank) =>
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (locationFilter === "" ||
        bank.location.toLowerCase().includes(locationFilter.toLowerCase()))
  );

  const filteredPosts = posts
    .filter(
      (post) =>
        (post.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (bloodGroupFilter === "" || post.bloodGroup === bloodGroupFilter) &&
        (locationFilter === "" ||
          post.location.toLowerCase().includes(locationFilter.toLowerCase()))
    )
    .sort((a, b) => {
      const dateA = new Date(a.dateNeeded);
      const dateB = new Date(b.dateNeeded);
      return dateB.getTime() - dateA.getTime();
    });

  const filteredCampaigns = campaigns
    .filter(
      (campaign) =>
        (campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.host.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (locationFilter === "" ||
          campaign.location
            .toLowerCase()
            .includes(locationFilter.toLowerCase())) &&
        !campaign.isDeleted
    )
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

  //  locations filter
  const uniqueLocations = [
    ...new Set([
      ...bloodBanks.map((bank) => bank.location),
      ...posts.map((post) => post.location),
      ...campaigns
        .filter((campaign) => !campaign.isDeleted)
        .map((campaign) => campaign.location),
    ]),
  ];

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCampaignStatus = (campaignDate: string) => {
    const today = new Date();
    const date = new Date(campaignDate);

    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return { label: "Today", class: "bg-green-100 text-green-800" };
    } else if (date > today) {
      return { label: "Upcoming", class: "bg-blue-100 text-blue-800" };
    } else {
      return { label: "Past", class: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Donate Blood & Save Lives
      </h1>

      {/* Hero section */}
      <div className="bg-red-50 rounded-lg p-6 mb-8 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">
          Your Donation Matters
        </h2>
        <p className="text-gray-700 mb-4">
          Every donation can save up to three lives. Find blood banks near you
          or connect with people in need.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <MapPin className="text-red-600" size={20} />
            </div>
            <div className="text-left">
              <p className="font-semibold">Find Nearby</p>
              <p className="text-sm text-gray-600">Blood banks in your area</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <CalendarDays className="text-red-600" size={20} />
            </div>
            <div className="text-left">
              <p className="font-semibold">Join Campaigns</p>
              <p className="text-sm text-gray-600">
                Participate in donation events
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <MessageCircle className="text-red-600" size={20} />
            </div>
            <div className="text-left">
              <p className="font-semibold">Connect</p>
              <p className="text-sm text-gray-600">Chat with requesters</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "banks"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("banks")}
        >
          Blood Banks
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "requests"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("requests")}
        >
          Blood Requests
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "campaigns"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("campaigns")}
        >
          Campaigns
        </button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
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
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <option value="">All Locations</option>
          {uniqueLocations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

        {activeTab === "requests" && (
          <select
            value={bloodGroupFilter}
            onChange={(e) => setBloodGroupFilter(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="">All Blood Groups</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        )}

      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <>
          {/* Blood Banks List */}
          {activeTab === "banks" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBanks.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No blood banks found matching your search.
                </div>
              ) : (
                filteredBanks.map((bank) => (
                  <div
                    key={bank._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-5">
                      <h3 className="text-lg font-semibold mb-2">
                        {bank.name}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPin size={16} />
                        <span>{bank.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Phone size={16} />
                        <a
                          href={`tel:${bank.contactNumber}`}
                          className="hover:text-red-600"
                        >
                          {bank.contactNumber}
                        </a>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        Registration ID: {bank.registration_id}
                      </p>
                      <button className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors">
                        Contact
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Blood Requests List */}
          {activeTab === "requests" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No blood requests found matching your search.
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="bg-red-50 p-3 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          {post.bloodGroup}
                        </div>
                        <div>
                          <h3 className="font-semibold">{post.patientName}</h3>
                          <p className="text-sm text-gray-600">
                            {post.gender}, {post.patientAge} years
                          </p>
                        </div>
                      </div>
                      <div className="text-red-600 font-semibold">Urgent</div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPin size={16} />
                        <span>{post.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Phone size={16} />
                        <a
                          href={`tel:${post.contactInfo}`}
                          className="hover:text-red-600"
                        >
                          {post.contactInfo}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Calendar size={16} />
                        <span>Needed by: {formatDate(post.dateNeeded)}</span>
                      </div>
                      {post.notes && (
                        <p className="text-sm text-gray-700 mt-2 mb-3 bg-gray-50 p-2 rounded">
                          {post.notes}
                        </p>
                      )}
                      {post?.user !== selfId && (
                        <div className="flex gap-2 mt-4">
                          <Link
                            href={`/user-profile/${post?.user}`}
                            className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                          >
                            <User size={16} />
                            Profile
                          </Link>
                          <Link
                            href={`/chat/${post?.user}`}
                            className="flex-1 cursor-pointer bg-white border border-red-600 text-red-600 py-2 rounded-md hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                          >
                            <MessageCircle size={16} />
                            Chat
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Campaigns List */}
          {activeTab === "campaigns" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No campaigns found matching your search.
                </div>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <div
                    key={campaign._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="bg-red-50 p-3 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{campaign.title}</h3>
                        <p className="text-sm text-gray-600">
                          By: {campaign.host}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          getCampaignStatus(campaign.date).class
                        }`}
                      >
                        {getCampaignStatus(campaign.date).label}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPin size={16} />
                        <span>{campaign.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Phone size={16} />
                        <a
                          href={`tel:${campaign.contactNumber}`}
                          className="hover:text-red-600"
                        >
                          {campaign.contactNumber}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Calendar size={16} />
                        <span>{formatDate(campaign.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Clock size={16} />
                        <span>Starts at: {campaign.start_time}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors">
                          Register
                        </button>
                        <button className="flex-1 bg-white border border-red-600 text-red-600 py-2 rounded-md hover:bg-red-50 transition-colors">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default withAuth(Donate);
"use client";

import { useState, useEffect } from "react";
import {
  ArrowUpRight,
  Users,
  FileText,
  Calendar,
  Building,
  Clock,
  Activity,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { getAllUers } from "./services/userService";
import { getAllPosts } from "./services/postService";
import { getAllCampaigns } from "./services/campaignService";
import { getAllBloodBanks } from "./services/bloodBanksService";
import { getAllAppointments } from "./services/appointmentSerive";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminHome() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalCampaigns: 0,
    totalBloodBanks: 0,
    totalAppointments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // Mock data for charts
  const monthlyDonations = [
    { name: "Jan", donations: 65 },
    { name: "Feb", donations: 59 },
    { name: "Mar", donations: 80 },
    { name: "Apr", donations: 81 },
    { name: "May", donations: 56 },
    { name: "Jun", donations: 55 },
    { name: "Jul", donations: 40 },
  ];

  const bloodTypeDistribution = [
    { name: "A+", value: 35 },
    { name: "O+", value: 45 },
    { name: "B+", value: 20 },
    { name: "AB+", value: 10 },
    { name: "A-", value: 15 },
    { name: "O-", value: 25 },
    { name: "B-", value: 5 },
    { name: "AB-", value: 5 },
  ];

  const userActivityData = [
    { name: "Posts", count: stats.totalPosts },
    { name: "Campaigns", count: stats.totalCampaigns },
    { name: "Appointments", count: stats.totalAppointments },
  ];

  const campaignSuccessRate = [
    { name: "Successful", value: 68 },
    { name: "In Progress", value: 22 },
    { name: "Cancelled", value: 10 },
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
  ];

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch all data
        const users = await getAllUers();
        const posts = await getAllPosts();
        const campaigns = await getAllCampaigns();
        const bloodBanks = await getAllBloodBanks();
        const appointments = await getAllAppointments();

        setStats({
          totalUsers: users?.length || 0,
          totalPosts: posts?.length || 0,
          totalCampaigns: campaigns?.length || 0,
          totalBloodBanks: bloodBanks?.length || 0,
          totalAppointments: appointments?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-700">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 flex items-center">
          <AlertCircle className="text-red-500 mr-3" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Blood Donation Admin Dashboard
          </h1>
          <p className="text-gray-500">
            Overview of system statistics and activities
          </p>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            link="/admin/users"
            icon={<Users className="text-blue-500" />}
            color="blue"
          />
          <StatCard
            title="Total Posts"
            value={stats.totalPosts}
            link="/admin/posts"
            icon={<FileText className="text-green-500" />}
            color="green"
          />
          <StatCard
            title="Total Campaigns"
            value={stats.totalCampaigns}
            link="/admin/campaigns"
            icon={<Calendar className="text-purple-500" />}
            color="purple"
          />
          <StatCard
            title="Blood Banks"
            value={stats.totalBloodBanks}
            link="/admin/blood-banks"
            icon={<Building className="text-red-500" />}
            color="red"
          />
          <StatCard
            title="Appointments"
            value={stats.totalAppointments}
            link="/admin/appointments"
            icon={<Clock className="text-amber-500" />}
            color="amber"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Donations Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Monthly Donations
              </h2>
              <TrendingUp className="text-blue-500" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyDonations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="donations"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Activity Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                User Activity
              </h2>
              <Activity className="text-green-500" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Second row of charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blood Type Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Blood Type Distribution
              </h2>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">
                  Total samples:
                </span>
                <span className="font-medium">
                  {bloodTypeDistribution.reduce(
                    (acc, item) => acc + item.value,
                    0
                  )}
                </span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bloodTypeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {bloodTypeDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Campaign Success Rate */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Campaign Status
              </h2>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">
                  Success rate:
                </span>
                <span className="font-medium text-green-500">68%</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={campaignSuccessRate}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    <Cell fill="#10b981" /> {/* Success - Green */}
                    <Cell fill="#3b82f6" /> {/* In Progress - Blue */}
                    <Cell fill="#ef4444" /> {/* Cancelled - Red */}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Enhanced StatCard Component
const StatCard = ({ title, value, link, icon, color = "blue" }:{title:string,value:any,link:any,icon:any,color:any}) => {
  const colorVariants : any= {
    blue: "border-blue-200 bg-blue-50 text-blue-600",
    green: "border-green-200 bg-green-50 text-green-600",
    purple: "border-purple-200 bg-purple-50 text-purple-600",
    red: "border-red-200 bg-red-50 text-red-600",
    amber: "border-amber-200 bg-amber-50 text-amber-600",
  };

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${colorVariants[color]}`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="p-2 rounded-lg bg-gray-100">{icon}</div>
        <Link href={link} className="text-gray-500 hover:text-gray-700">
          <ArrowUpRight size={18} />
        </Link>
      </div>
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
};
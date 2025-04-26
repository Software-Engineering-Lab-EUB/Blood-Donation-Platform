"use client"
import { useState } from "react";
import { Lock, User, AlertCircle } from "lucide-react";
import { serverBaseUrl } from "@/utils/serverUrl";
import { successMessage } from "@/utils/alertMessages";

export default function AdminLoginPage() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!adminId || !password) {
      setError("Admin ID and password are required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${serverBaseUrl}/admin/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id:adminId, password }),
      });

        const data = await response.json();
      if (response.ok && data.success) {
        setTimeout(() => {
            successMessage('Login Success')
            window.location.replace('/admin');
        }, 200);
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header with logo */}
        <div className="bg-red-600 p-6 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l2 5h5l-4 4 2 5-5-3-5 3 2-5-4-4h5z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">LifeSource</h1>
          <p className="text-red-100">Blood Donation Management System</p>
        </div>

        {/* Login form */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Administrator Login
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="adminId"
              >
                Admin ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="adminId"
                  type="text"
                  className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your admin ID"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-150 flex justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Trouble logging in? Contact{" "}
              <span className="text-red-600 font-medium">
                system administrator
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-center text-gray-500">
            © {new Date().getFullYear()} LifeSource Blood Donation Platform. All
            rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
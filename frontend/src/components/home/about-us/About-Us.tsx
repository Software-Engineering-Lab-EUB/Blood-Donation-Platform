import React from "react";

export default function AboutUs() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-red-600 mb-4">About Us</h2>
          <div className="w-24 h-1 bg-red-600 mx-auto"></div>
        </div>

        {/* Mission Statement - Wider layout */}
        <div className="mb-16 max-w-5xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Our Mission
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 p-8 rounded-xl shadow-sm">
              <p className="text-lg text-gray-700 leading-relaxed">
                At BloodConnect, we're dedicated to bridging the gap between
                blood donors and those in need through a user-friendly platform.
                Our mission is to ensure that no life is lost due to blood
                shortage by creating a responsive community of donors ready to
                help at a moment's notice.
              </p>
            </div>
            <div className="bg-red-50 p-8 rounded-xl shadow-sm">
              <p className="text-lg text-gray-700 leading-relaxed">
                Founded in 2025, we've grown from a small community initiative
                to a nationwide network of compassionate individuals committed
                to saving lives through blood donation. Together, we're making a
                meaningful difference in emergency medical care across the
                country.
              </p>
            </div>
          </div>
        </div>

        {/* What We Do - 4 columns with new notification feature */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            What We Do
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-red-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-5 mx-auto">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-medium mb-3 text-center">
                Connect Donors
              </h4>
              <p className="text-gray-600 text-center">
                We help you find blood donors in your area based on blood type
                and urgency with our advanced matching system.
              </p>
            </div>

            <div className="bg-red-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-5 mx-auto">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-medium mb-3 text-center">
                Direct Communication
              </h4>
              <p className="text-gray-600 text-center">
                Our platform enables secure direct messaging between donors and
                recipients, maintaining privacy while facilitating coordination.
              </p>
            </div>

            <div className="bg-red-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-5 mx-auto">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-medium mb-3 text-center">
                Blood Request Notifications
              </h4>
              <p className="text-gray-600 text-center">
                Receive real-time alerts for urgent blood requests in your area,
                allowing you to respond quickly to critical needs.
              </p>
            </div>

            <div className="bg-red-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-5 mx-auto">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-medium mb-3 text-center">
                Blood Bank Network
              </h4>
              <p className="text-gray-600 text-center">
                We partner with blood banks nationwide to ensure availability
                during emergencies and maintain a reliable supply chain.
              </p>
            </div>
          </div>
        </div>

        {/* Impact Section - Enhanced visuals */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Our Impact
          </h3>
          <div className="bg-gradient-to-r from-red-500 to-red-700 text-white p-10 rounded-xl shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <div className="text-4xl font-bold mb-2">200+</div>
                <p className="text-lg">Registered Donors</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <div className="text-4xl font-bold mb-2">50+</div>
                <p className="text-lg">Successful Donations</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <div className="text-4xl font-bold mb-2">80+</div>
                <p className="text-lg">Emergency Requests</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <div className="text-4xl font-bold mb-2">10+</div>
                <p className="text-lg">Partner Blood Banks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information - Better layout */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Contact Us
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-5">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-medium mb-2">Address</h4>
                <p className="text-gray-600 text-center">
                  123 Health Avenue,
                  <br />
                  Medical District,
                  <br />
                  City, Country
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-5">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-medium mb-2">Email</h4>
                <p className="text-gray-600 text-center">
                  info@bloodconnect.org
                  <br />
                  support@bloodconnect.org
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-5">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-medium mb-2">Phone</h4>
                <p className="text-gray-600 text-center">
                  +1 (555) 123-4567
                  <br />
                  Emergency: +1 (555) 987-6543
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

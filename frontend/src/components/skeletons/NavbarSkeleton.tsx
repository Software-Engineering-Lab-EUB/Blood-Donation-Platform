"use client";

export default function NavbarSkeleton() {
  return (
    <nav className="bg-white mt-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Skeleton */}
          <div className="h-14 flex items-center w-[200px]">
            <div className="h-[35px] w-[140px] bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Desktop Menu Skeleton */}
          <div className="hidden lg:flex space-x-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-4 w-20 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>

          {/* User Profile Skeleton */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Mobile Menu Button Skeleton */}
          <div className="lg:hidden">
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}

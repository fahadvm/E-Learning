"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Search, Settings, ChevronDown, LogOut, Menu, X } from "lucide-react";
import { teacherAuthApi } from "@/services/APImethods/teacherAPImethods";

export default function Header() {
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await teacherAuthApi.logout();
      localStorage.removeItem("tempSignupEmail");
      router.push("/teacher/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-gray-900 text-white px-4 sm:px-6 py-3 shadow-md flex justify-between items-center">
      {/* Logo */}
      <div
        className="text-2xl font-extrabold cursor-pointer tracking-tight hover:text-blue-400 transition"
        onClick={() => router.push("/teacher/home")}
      >
        DevNext
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6 relative">
        <Link href="/teacher/home" className="text-gray-300 hover:text-white font-medium transition">
          Dashboard
        </Link>

        {/* Browse Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setIsBrowseOpen(true)}
          onMouseLeave={() => setIsBrowseOpen(false)}
        >
          <button className="flex items-center text-gray-300 hover:text-white font-medium transition">
            Browse
            <ChevronDown className="ml-1 w-4 h-4" />
          </button>
          {isBrowseOpen && (
            <div className="absolute top-full left-0 bg-gray-800 mt-2 rounded shadow-lg z-50 w-40 py-2 animate-fadeIn">
              <Link href="/course" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition">
                Courses
              </Link>
              <Link href="/learning-paths" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition">
                Learning Paths
              </Link>
            </div>
          )}
        </div>

        <Link href="/teacher/slots" className="text-gray-300 hover:text-white font-medium transition">
          Slot
        </Link>
        <Link href="/teacher/courses" className="text-gray-300 hover:text-white font-medium transition">
          My Courses
        </Link>
        <Link href="/teacher/callSchedule" className="text-gray-300 hover:text-white font-medium transition">
          Call Schedule
        </Link>
      </nav>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <button title="Search" className="hover:text-blue-400 transition">
          <Search size={20} />
        </button>
        <Link href="/teacher/profile" title="Profile" className="hover:text-blue-400 transition">
          <Settings size={20} />
        </Link>
        <button title="Notifications" className="hover:text-blue-400 transition">
          <Bell size={20} />
        </button>
        <button onClick={handleLogout} title="Logout" className="hover:text-blue-400 transition">
          <LogOut size={20} />
        </button>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden ml-2"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900 flex flex-col items-start p-4 space-y-2 md:hidden z-50">
          <Link href="/teacher/home" className="w-full text-gray-300 hover:text-white font-medium transition">
            Dashboard
          </Link>

          {/* Browse dropdown in mobile */}
          <div className="w-full relative">
            <button
              className="flex items-center w-full text-gray-300 hover:text-white font-medium transition"
              onClick={() => setIsBrowseOpen((prev) => !prev)}
            >
              Browse <ChevronDown className="ml-1 w-4 h-4" />
            </button>
            {isBrowseOpen && (
              <div className="flex flex-col bg-gray-800 rounded mt-1 w-full">
                <Link href="/course" className="px-4 py-2 text-gray-200 hover:bg-gray-700">
                  Courses
                </Link>
                <Link href="/learning-paths" className="px-4 py-2 text-gray-200 hover:bg-gray-700">
                  Learning Paths
                </Link>
              </div>
            )}
          </div>

          <Link href="/schedule" className="w-full text-gray-300 hover:text-white font-medium transition">
            My Schedule
          </Link>
          <Link href="/teacher/courses" className="w-full text-gray-300 hover:text-white font-medium transition">
            My Courses
          </Link>
          <Link href="/call-schedule" className="w-full text-gray-300 hover:text-white font-medium transition">
            Call Schedule
          </Link>
        </div>
      )}
    </header>
  );
}

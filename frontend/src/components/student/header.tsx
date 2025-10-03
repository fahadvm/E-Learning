"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Settings,
  ChevronDown,
  LogOut,
  Heart,
  User,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";

import { studentAuthApi } from "@/services/APImethods/studentAPImethods";

export default function Header() {
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await studentAuthApi.logout();
      localStorage.removeItem("tempSignupEmail");
      router.push("/student/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-indigo-900 text-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div
          className="text-2xl font-extrabold cursor-pointer tracking-tight hover:text-blue-400 transition"
          onClick={() => router.push("/student/home")}
        >
          DevNext
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 relative">
          <Link
            href="/student/home"
            className="text-gray-300 hover:text-white font-medium transition"
          >
            Dashboard
          </Link>

          {/* Browse Dropdown */}
          {/* <div
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
                <Link
                  href="/courses"
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition"
                >
                  Courses
                </Link>
                <Link
                  href="/learning-paths"
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition"
                >
                  Learning Paths
                </Link>
              </div>
            )}
          </div> */}

          <Link
            href="/student/subscription"
            className="text-gray-300 hover:text-white font-medium transition"
          >
            Subscription
          </Link>
          <Link
            href="/student/courses"
            className="text-gray-300 hover:text-white font-medium transition"
          >
            Courses
          </Link>
          <Link
            href="/student/mycourses"
            className="text-gray-300 hover:text-white font-medium transition"
          >
            My Courses
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Link
            href="/student/wishlist"
            title="Wishlist"
            className="hover:text-blue-400 transition"
          >
            <Heart size={20} />
          </Link>
          <Link
            href="/student/cart"
            title="Cart"
            className="hover:text-blue-400 transition"
          >
            <ShoppingCart size={20} />
          </Link>
          <button title="Settings" className="hover:text-blue-400 transition">
            <Settings size={20} />
          </button>
          <button title="Notifications" className="hover:text-blue-400 transition">
            <Bell size={20} />
          </button>
          <Link
            href="/student/profile"
            title="User"
            className="hover:text-blue-400 transition"
          >
            <User size={20} />
          </Link>
          <button
            title="Logout"
            onClick={handleLogout}
            className="hover:text-blue-400 transition"
          >
            <LogOut size={20} />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden hover:text-blue-400 transition"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden mt-4 space-y-3 flex flex-col bg-indigo-800 rounded-lg p-4">
          <Link href="/student/home" className="text-gray-200 hover:text-white">
            Dashboard
          </Link>
          <Link href="/courses" className="text-gray-200 hover:text-white">
            Courses
          </Link>
          <Link href="/learning-paths" className="text-gray-200 hover:text-white">
            Learning Paths
          </Link>
          <Link
            href="/student/subscription"
            className="text-gray-200 hover:text-white"
          >
            Subscription
          </Link>
          <Link
            href="/student/mycourses"
            className="text-gray-200 hover:text-white"
          >
            My Courses
          </Link>
        </nav>
      )}
    </header>
  );
}

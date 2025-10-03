"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Bell, Heart, ShoppingCart, LogOut, BookOpen,Users, Route, Compass, User } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { companyApiMethods } from "@/services/APImethods/companyAPImethods";



export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();


  const navLinks = [
    { href: "/company/home", label: "Home" },
    { href: "/company/courses", label: "Courses", icon: <BookOpen size={20} /> },
    { href: "/company/employees", label: "Employees", icon: <Users size={20} /> },
    { href: "/learning-path", label: "Learning Path", icon: <Route size={20} /> },
    { href: "/company/mycourses", label: "MyCourses", icon: <BookOpen size={20} /> },
    { href: "/tracker", label: "Tracker", icon: <Compass size={20} /> },
  ];

  const handleLogout = async () => {
    try {
      await companyApiMethods.logout()

      localStorage.removeItem("tempSignupEmail");
      router.push("/company/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* Brand */}
        <Link href="/company/home" className="text-2xl font-bold text-indigo-700 tracking-wide">
          DevNext
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 font-medium"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}

          {/* Icons */}
          <div className="flex items-center gap-5 ml-6">
            <Link href="/notifications" className="relative group">
              <Bell size={20} className="text-gray-600 group-hover:text-indigo-600" />
              <span className="absolute top-[-6px] right-[-6px] bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </Link>
            <Link href="/company/wishlist">
              <Heart size={20} className="text-gray-600 hover:text-indigo-600" />
            </Link>
            <Link href="/company/cart">
              <ShoppingCart size={20} className="text-gray-600 hover:text-indigo-600" />
            </Link>
            <Link href="/company/profile">
              <User size={20} className="text-gray-600 hover:text-indigo-600" />
            </Link>
            <button onClick={handleLogout}>
              <LogOut size={20} className="text-gray-600 hover:text-indigo-600" />
            </button>

          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-4 py-4 space-y-4 shadow-md">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-700 hover:text-indigo-600 font-medium"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-6 pt-2">
            <Link href="/notifications">
              <Bell size={20} className="text-gray-600 hover:text-indigo-600" />
            </Link>
            <Link href="/wishlist">
              <Heart size={20} className="text-gray-600 hover:text-indigo-600" />
            </Link>
            <Link href="/cart">
              <ShoppingCart size={20} className="text-gray-600 hover:text-indigo-600" />
            </Link>
            <Link href="/logout">
              <LogOut size={20} className="text-gray-600 hover:text-indigo-600" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

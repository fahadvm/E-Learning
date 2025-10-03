// components/layout/TopNavBar.tsx
"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const navItems = [
  { icon: "home", label: "Dashboard", href: "/" },
  { icon: "book", label: "My Courses", href: "/courses" },
  { icon: "users", label: "Students", href: "/students" },
  { icon: "tasks", label: "Assignments", href: "/assignments" },
  { icon: "chart-line", label: "Analytics", href: "/analytics" },
  { icon: "calendar", label: "Schedule", href: "/schedule" },
  { icon: "comments", label: "Messages", href: "/messages" },
];

export const TopNavBar = () => {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200 z-30">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <FontAwesomeIcon icon="graduation-cap" className="text-white text-xl" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">DevNext</h1>
        </div>

        {/* Center: Navigation Items */}
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center text-gray-600 hover:text-primary transition-colors"
            >
              <FontAwesomeIcon icon={item.icon as any} className="w-4 mr-1" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Profile */}
        <div className="flex items-center space-x-3">
          <img
            src="https://picsum.photos/seed/teacher/40/40.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-gray-800">Dr. Sarah Johnson</p>
            <p className="text-xs text-gray-500">Mathematics</p>
          </div>
        </div>
      </div>
    </header>
  );
};

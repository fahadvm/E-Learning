"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  UserCog,
  Award,
  BookOpen,
  Trophy,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

import { useStudent } from "@/context/studentContext";

export const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { student } = useStudent();

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/student/profile" },
    { icon: Award, label: "Certificates", path: "/student/profile/certificates" },
    { icon: BookOpen, label: "Courses", path: "/student/profile/courses" },
    { icon: Trophy, label: "Achievements", path: "/student/profile/achievements" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  /* ---------------- Sidebar Content ---------------- */
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
     

      {/* User Card */}
      <div className="mt-15 px-4 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 flex items-center gap-3 group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <div className="relative">
            <img
              src={student?.profilePicture}
              alt={student?.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">
              {student?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {student?.role}
            </p>
          </div>

          <ChevronRight
            size={16}
            className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Menu
        </p>

        {navItems.map((item) => {
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                active
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/10 dark:hover:text-red-400 transition-all duration-200 group">
          <LogOut
            size={20}
            className="group-hover:rotate-180 transition-transform duration-300"
          />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
  /* --------------------------------------------------- */

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : "-100%" }}
        className="fixed top-0 left-0 z-40 h-screen w-72 lg:translate-x-0 lg:hidden transition-transform duration-300 ease-in-out shadow-2xl"
      >
        <SidebarContent />
      </motion.aside>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block w-72 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </div>
    </>
  );
};

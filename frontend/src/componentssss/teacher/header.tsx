"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Search, Settings, ChevronDown, LogOut } from "lucide-react";
import axios from "axios";
import { teacherAuthApi, teacherProfileApi } from "@/services/APImethods/teacherAPImethods";


export default function Header() {
    const [isBrowseOpen, setIsBrowseOpen] = useState(false);
    const [isAvatarOpen, setIsAvatarOpen] = useState(false);
    const router = useRouter();


    const handleLogout = async () => {
        try {
            await teacherAuthApi.logout()

            localStorage.removeItem("tempSignupEmail");
            router.push("/teacher/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="bg-gray-900 text-white px-6 py-3 shadow-md flex justify-between items-center">
            {/* Logo */}
            <div
                className="text-2xl font-extrabold cursor-pointer tracking-tight hover:text-blue-400 transition"
                onClick={() => router.push("/teacher/home")}
            >
                DevNext
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-6 relative">
                <Link
                    href="/teacher/home"
                    className="text-gray-300 hover:text-white font-medium transition"
                >
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
                            <Link
                                href="/course"
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
                </div>

                <Link
                    href="/schedule"
                    className="text-gray-300 hover:text-white font-medium transition"
                >
                    My Schedule
                </Link>
                <Link
                    href="/teacher/courses"
                    className="text-gray-300 hover:text-white font-medium transition"
                >
                    My Courses
                </Link>
                <Link
                    href="/call-schedule"
                    className="text-gray-300 hover:text-white font-medium transition"
                >
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
                <button
                    title="Logout"
                    onClick={handleLogout}
                    className="hover:text-blue-400 transition"
                >
                    <LogOut size={20} />
                </button>

                {/* Avatar with Logout Dropdown */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsAvatarOpen(true)}
                    onMouseLeave={() => setIsAvatarOpen(false)}
                >





                </div>
            </div>
        </header>
    );
}

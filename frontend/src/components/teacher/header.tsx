"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Search, Settings, ChevronDown, LogOut, Menu, X, MessageSquare } from "lucide-react";
import { teacherAuthApi, teacherCallRequestApi } from "@/services/APIservices/teacherApiService";
import { initSocket } from "@/lib/socket";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";
import { useTeacher } from "@/context/teacherContext";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function Header() {
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { teacher } = useTeacher();
  const router = useRouter();

  // Fetch notifications with proper error handling
  const fetchNotifications = useCallback(async () => {
    if (!teacher?._id) {
      showErrorToast("User not authenticated");
      return;
    }

    try {
      const response = await teacherCallRequestApi.tester(teacher._id);
      
      if (response.ok && Array.isArray(response.data)) {
        setNotifications(response.data);
        setUnreadCount(response.data.filter((n: Notification) => !n.isRead).length);
      } else {
        showErrorToast("Invalid notification data received");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [teacher?._id]);

  // Initialize socket with proper cleanup
  useEffect(() => {
    if (!teacher?._id) return;

    fetchNotifications();

    const socket = initSocket(
      teacher._id,
      (message) => console.log("New message:", message),
      (data: any) => {
        const notification: Notification = {
          ...data,
          _id: Date.now().toString(),
          isRead: false,
          type: data.type || 'default', // Adjust based on actual NotificationData shape
          createdAt: data.createdAt || new Date().toISOString(),
        };
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        showSuccessToast("New notification received!");
      }
    );

    return () => {
      socket?.disconnect();
    };
  }, [teacher?._id, fetchNotifications]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await teacherCallRequestApi.testerMark({ notificationId });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } else {
        showErrorToast("Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  // Handle logout with proper error handling
  const handleLogout = useCallback(async () => {
    try {
      await teacherAuthApi.logout();
      localStorage.clear();
      router.push("/teacher/login");
    } catch (error) {
      console.error("Logout failed:", error);
      showErrorToast("Failed to logout");
    }
  }, [router]);

  return (
    <header className="bg-gray-900 text-white px-4 sm:px-6 py-3 shadow-md flex justify-between items-center">
      <div
        className="text-2xl font-extrabold cursor-pointer tracking-tight hover:text-blue-400 transition"
        onClick={() => router.push("/teacher/home")}
      >
        DevNext
      </div>

      <nav className="hidden md:flex items-center space-x-6 relative">
        <Link href="/teacher/home" className="text-gray-300 hover:text-white font-medium transition">
          Dashboard
        </Link>
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
          Slots
        </Link>
        <Link href="/teacher/courses" className="text-gray-300 hover:text-white font-medium transition">
          My Courses
        </Link>
        <Link href="/teacher/callSchedule" className="text-gray-300 hover:text-white font-medium transition">
          Call Schedule
        </Link>
      </nav>

      <div className="flex items-center space-x-4">
        <button title="Search" className="hover:text-blue-400 transition">
          <Search size={20} />
        </button>
        <Link href="/teacher/chat" className="text-gray-300 hover:text-white font-medium flex items-center gap-1 transition">
          <MessageSquare size={18} />
        </Link>
        <Link href="/teacher/profile" title="Profile" className="hover:text-blue-400 transition">
          <Settings size={20} />
        </Link>
        <div className="relative">
          <button
            title="Notifications"
            className="hover:text-blue-400 transition relative"
            onClick={() => setIsNotificationOpen((prev) => !prev)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {unreadCount}
              </span>
            )}
          </button>
          {isNotificationOpen && (
            <div className="absolute top-full right-0 bg-gray-800 mt-2 rounded shadow-lg z-50 w-80 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-gray-400">No notifications</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 border-b border-gray-700 hover:bg-gray-700 transition ${
                      notification.isRead ? "opacity-80" : ""
                    }`}
                    onClick={() => !notification.isRead && markAsRead(notification._id)}
                  >
                    <h4 className="text-sm font-semibold">{notification.title}</h4>
                    <p className="text-xs text-gray-300">{notification.message}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                    {!notification.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification._id);
                        }}
                        className="text-blue-400 text-xs mt-1"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <button onClick={handleLogout} title="Logout" className="hover:text-blue-400 transition">
          <LogOut size={20} />
        </button>
        <button
          className="md:hidden ml-2"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900 flex flex-col items-start p-4 space-y-2 md:hidden z-50">
          <Link href="/teacher/home" className="w-full text-gray-300 hover:text-white font-medium transition">
            Dashboard
          </Link>
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
          <Link href="/teacher/slots" className="w-full text-gray-300 hover:text-white font-medium transition">
            Slots
          </Link>
          <Link href="/teacher/courses" className="w-full text-gray-300 hover:text-white font-medium transition">
            My Courses
          </Link>
          <Link href="/teacher/callSchedule" className="w-full text-gray-300 hover:text-white font-medium transition">
            Call Schedule
          </Link>
        </div>
      )}
    </header>
  );
}
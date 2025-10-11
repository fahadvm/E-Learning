"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
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
  MessageCircle,
} from "lucide-react";
import { studentAuthApi, } from "@/services/APImethods/studentAPImethods";
import { initSocket } from "@/lib/socket";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";
import { useStudent } from "@/context/studentContext";
import { teacherCallRequestApi } from "@/services/APImethods/teacherAPImethods";

interface Notification {
  id: string;
  message: string;
  time: string;
  type: string;
  isRead: boolean;
}

interface NotificationData {
  id: string;
  message: string;
  type: string;
  createdAt: string;
  isRead: boolean;
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { student } = useStudent();

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!student?._id) {
      showErrorToast("User not authenticated");
      return;
    }

    try {
      const response = await teacherCallRequestApi.tester(student._id);
      if (response.ok && Array.isArray(response.data)) {
        const formattedNotifications = response.data.map((n: any) => ({
          id: n._id,
          message: n.message,
          time: new Date(n.createdAt).toLocaleTimeString(),
          type: n.type || "info",
          isRead: n.isRead || false,
        }));
        setNotifications(formattedNotifications);
        setUnreadCount(formattedNotifications.filter((n: any) => !n.isRead).length);
      } else {
        showErrorToast("Invalid notification data received");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      showErrorToast("Error fetching notifications");
    }
  }, [student?._id]);

  // Initialize WebSocket for real-time notifications
useEffect(() => {
  if (!student?._id) return;

  fetchNotifications();

  const socket = initSocket(
    student._id,
    (message) => console.log("New message:", message),
    (notification: NotificationData) => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        message: notification.message,
        time: new Date(notification.createdAt).toLocaleTimeString(),
        type: notification.type || "info",
        isRead: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      showSuccessToast("New notification received!");
    }
  );

  return () => {
    if (socket) {
      socket.disconnect();
    }
  };
}, [student?._id, fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      const response = await teacherCallRequestApi.testerMark({ notificationId: id });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } else {
        showErrorToast("Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      showErrorToast("Error marking notification as read");
    }
  }, []);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await studentAuthApi.logout();
      localStorage.clear();
      router.push("/student/login");
    } catch (error) {
      console.error("Logout failed:", error);
      showErrorToast("Failed to logout");
    }
  }, [router]);

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
          <Link href="/student/home" className="text-gray-300 hover:text-white font-medium">
            Dashboard
          </Link>
          <Link href="/student/subscription" className="text-gray-300 hover:text-white font-medium">
            Subscription
          </Link>
          <Link href="/student/courses" className="text-gray-300 hover:text-white font-medium">
            Courses
          </Link>
          <Link href="/student/mycourses" className="text-gray-300 hover:text-white font-medium">
            My Courses
          </Link>
          <Link href="/student/call-schedule" className="text-gray-300 hover:text-white font-medium">
            Call Schedule
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4 relative">
          <Link href="/student/wishlist" title="Wishlist" className="hover:text-blue-400 transition">
            <Heart size={20} />
          </Link>
          <Link href="/student/cart" title="Cart" className="hover:text-blue-400 transition">
            <ShoppingCart size={20} />
          </Link>
          <Link href="/student/chat" title="Message" className="hover:text-blue-400 transition">
            <MessageCircle size={20} />
          </Link>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              title="Notifications"
              className="relative hover:text-blue-400 transition"
              onClick={() => setIsNotificationOpen((prev) => !prev)}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white text-gray-800 rounded-lg shadow-lg z-50 animate-fadeIn">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                </div>

                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">No new notifications</div>
                ) : (
                  <ul className="max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className={`px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer border-b border-gray-100 last:border-none ${n.isRead ? "opacity-70" : "font-medium"
                          }`}
                      >
                        <p>{n.message}</p>
                        <span className="text-xs text-gray-500">{n.time}</span>
                        {!n.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(n.id);
                            }}
                            className="text-indigo-600 text-xs mt-1 hover:underline"
                          >
                            Mark as read
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <Link href="/student/profile" title="Profile" className="hover:text-blue-400 transition">
            <User size={20} />
          </Link>
          <button title="Logout" onClick={handleLogout} className="hover:text-blue-400 transition">
            <LogOut size={20} />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden hover:text-blue-400 transition"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
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
          <Link href="/student/subscription" className="text-gray-200 hover:text-white">
            Subscription
          </Link>
          <Link href="/student/courses" className="text-gray-200 hover:text-white">
            Courses
          </Link>
          <Link href="/student/mycourses" className="text-gray-200 hover:text-white">
            My Courses
          </Link>
          <Link href="/student/call-schedule" className="text-gray-200 hover:text-white">
            Call Schedule
          </Link>
        </nav>
      )}
    </header>
  );
}
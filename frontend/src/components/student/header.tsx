"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  LogOut,
  Heart,
  User,
  ShoppingCart,
  Menu,
  X,
  MessageCircle,
  Crown,
} from "lucide-react";
import { studentAuthApi } from "@/services/APIservices/studentApiservice";
import { useStudent } from "@/context/studentContext";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";
import { teacherCallRequestApi } from "@/services/APIservices/teacherApiService";

interface Notification {
  id: string;
  message: string;
  createdAt: string;
  time: string;
  type: string;
  isRead: boolean;
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { student, socket } = useStudent();
  const isPremium = student?.isPremium;

  /* ------------------------------------------------------------------
      Fetch Notifications from Backend
  ------------------------------------------------------------------ */
  const fetchNotifications = useCallback(async () => {
    if (!student?._id) return;

    try {
      setLoading(true);

      const response = await teacherCallRequestApi.tester(student._id);

      if (response.ok && Array.isArray(response.data)) {
        const formatted = response.data.map((n: any) => ({
          id: n._id,
          message: n.message,
          createdAt: n.createdAt,
          time: new Date(n.createdAt).toLocaleTimeString(),
          type: n.type || "info",
          isRead: n.isRead ?? false,
        }));

        setNotifications(formatted);
        setUnreadCount(formatted.filter((n: any) => !n.isRead).length);
      }
    } catch (err) {
      showErrorToast("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [student?._id]);

  /* ------------------------------------------------------------------
      WebSocket Listener (Real-time Notifications)
  ------------------------------------------------------------------ */
  useEffect(() => {
    if (!socket) return;

    socket.on("receive_notification", (data: any) => {
      const newOne: Notification = {
        id: Date.now().toString(),
        message: data.message,
        createdAt: new Date().toISOString(),
        time: new Date().toLocaleTimeString(),
        type: data.type || "info",
        isRead: false,
      };

      setNotifications((prev) => [newOne, ...prev]);
      setUnreadCount((prev) => prev + 1);

    });

    return () => {
      socket.off("receive_notification");
    };
  }, [socket]);

  /* ------------------------------------------------------------------
      Load notifications on mount
  ------------------------------------------------------------------ */
  useEffect(() => {
    if (student?._id) fetchNotifications();
  }, [student?._id, fetchNotifications]);

  /* ------------------------------------------------------------------
      Click Outside Handler for Notification Box
  ------------------------------------------------------------------ */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current &&
          !notificationRef.current.contains(e.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ------------------------------------------------------------------
      Mark Notification As Read
  ------------------------------------------------------------------ */
  const markAsRead = async (id: string) => {
    try {
      const res = await teacherCallRequestApi.testerMark({ notificationId: id });

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          )
        );

        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      showErrorToast("Failed to mark as read");
    }
  };

  /* ------------------------------------------------------------------
      Logout
  ------------------------------------------------------------------ */
  const handleLogout = async () => {
    try {
      await studentAuthApi.logout();
      localStorage.clear();
      router.push("/student/login");
    } catch (err) {
      showErrorToast("Logout failed");
    }
  };

  /* ==================================================================
      RENDER
  ================================================================== */
  return (
    <header className="bg-primary text-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center">

        {/* ------------------------------------------------------------------
            LOGO
        ------------------------------------------------------------------ */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => router.push("/student/home")}
        >
          <h1 className="text-2xl font-extrabold tracking-tight relative">
            <span className="relative inline-block">
              D
              {isPremium && (
                <Crown
                  size={16}
                  className="text-yellow-400 absolute -top-3 left-2 rotate-12"
                />
              )}
            </span>
            <span>evNext</span>
          </h1>

          {isPremium && (
            <span className="bg-yellow-300 text-black text-xs font-bold px-2 py-0.5 rounded-full">
              PRO
            </span>
          )}
        </div>

        {/* ------------------------------------------------------------------
            Desktop Navigation
        ------------------------------------------------------------------ */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/student/home" className="text-gray-300 hover:text-white">
            Dashboard
          </Link>
          <Link href="/student/subscription" className="text-gray-300 hover:text-white">
            Subscription
          </Link>
          <Link href="/student/courses" className="text-gray-300 hover:text-white">
            Courses
          </Link>
          <Link href="/student/mycourses" className="text-gray-300 hover:text-white">
            My Courses
          </Link>
          <Link href="/student/call-schedule" className="text-gray-300 hover:text-white">
            Call Schedule
          </Link>
        </nav>

        {/* ------------------------------------------------------------------
            ICONS RIGHT SIDE
        ------------------------------------------------------------------ */}
        <div className="flex items-center space-x-4 relative">

          <Link href="/student/wishlist"><Heart size={20} /></Link>
          <Link href="/student/cart"><ShoppingCart size={20} /></Link>
          <Link href="/student/chat"><MessageCircle size={20} /></Link>

          {/* ------------------------------------------------------------------
              NOTIFICATION BELL
          ------------------------------------------------------------------ */}
          <div ref={notificationRef} className="relative">
            <button
              className="relative hover:text-blue-400"
              onClick={() => setIsNotificationOpen((p) => !p)}
            >
              <Bell size={20} />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 
                    bg-red-500 text-white rounded-full flex items-center 
                    justify-center text-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white text-gray-900 rounded-lg shadow-lg z-50">
                <div className="px-4 py-3 border-b flex justify-between items-center">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      className="text-xs text-blue-600 hover:underline"
                      onClick={() => {
                        setNotifications([]);
                        setUnreadCount(0);
                      }}
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* LOADING */}
                {loading ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    Loading...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No notifications
                  </div>
                ) : (
                  <ul className="max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className={`px-4 py-2 border-b text-sm cursor-pointer
                          ${n.isRead ? "opacity-60" : "font-semibold"}`}
                      >
                        <p>{n.message}</p>
                        <span className="text-xs text-gray-500">{n.time}</span>

                        {!n.isRead && (
                          <button
                            className="text-indigo-600 text-xs hover:underline block mt-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(n.id);
                            }}
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

          <Link href="/student/profile"><User size={20} /></Link>

          <button onClick={handleLogout}><LogOut size={20} /></button>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen((p) => !p)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          Mobile Menu
      ------------------------------------------------------------------ */}
      {isMobileMenuOpen && (
        <nav className="md:hidden mt-4 bg-indigo-800 p-4 rounded-lg space-y-3">
          <Link href="/student/home" className="text-white">Dashboard</Link>
          <Link href="/student/subscription" className="text-white">Subscription</Link>
          <Link href="/student/courses" className="text-white">Courses</Link>
          <Link href="/student/mycourses" className="text-white">My Courses</Link>
          <Link href="/student/call-schedule" className="text-white">Call Schedule</Link>
        </nav>
      )}
    </header>
  );
}

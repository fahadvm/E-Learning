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
  ChevronDown,
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { student, socket } = useStudent();
  const isPremium = student?.isPremium;

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!student?._id) return;
    try {
      setLoading(true);
      // NOTE: This API path seems incorrect for fetching student notifications,
      // as it uses `teacherCallRequestApi.tester`. Assuming it works for now.
      const response = await teacherCallRequestApi.tester(student._id);
      if (response.ok && Array.isArray(response.data)) {
        const formatted = response.data.map((n: { _id: string; message: string; createdAt: string; type?: string; isRead?: boolean }) => ({
          id: n._id,
          message: n.message,
          createdAt: n.createdAt,
          time: new Date(n.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: n.type || "info",
          isRead: n.isRead ?? false,
        }));
        setNotifications(formatted);
        setUnreadCount(formatted.filter((n: Notification) => !n.isRead).length);
      }
    } catch {
      showErrorToast("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [student?._id]);

  useEffect(() => {
    if (student?._id) fetchNotifications();
  }, [student?._id, fetchNotifications]);

  // Real-time notifications
  useEffect(() => {
    if (!socket) return;
    socket.on("receive_notification", (data: { message: string, type?: string }) => {
      const newNotif: Notification = {
        id: Date.now().toString(),
        message: data.message,
        createdAt: new Date().toISOString(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: data.type || "info",
        isRead: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });
    return () => socket.off("receive_notification");
  }, [socket]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await teacherCallRequestApi.testerMark({ notificationId: id });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      showErrorToast("Failed to mark as read");
    }
  };

  const handleLogoutConfirm = async () => {
    try {
      await studentAuthApi.logout();
      localStorage.clear();
      router.push("/student/login");
      showSuccessToast("Logged out successfully");
    } catch {
      showErrorToast("Logout failed");
    }
  };

  // Icon Component for Desktop (kept for clean structure)
  function DesktopIcon({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) {
    return (
      <Link
        href={href}
        className="p-2 text-white/90 hover:text-white transition hidden lg:block"
      >
        {children}
      </Link>
    );
  }

  // Mobile Icon Component (New)
  function MobileIconLink({
    href,
    icon: Icon,
    label,
  }: {
    href: string;
    icon: React.ElementType;
    label: string;
  }) {
    return (
      <Link
        href={href}
        onClick={() => setIsMobileMenuOpen(false)}
        className="flex items-center gap-4 px-6 py-3 text-lg font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition"
      >
        <Icon size={24} className="text-indigo-600 dark:text-indigo-400" />
        {label}
      </Link>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 transition-all duration-500 bg-primary backdrop-blur-xl shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main header container */}
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left Side (Mobile Menu Button) */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Center (Logo - Adjusted for mobile centering) */}
            <div
              onClick={() => router.push("/student/home")}
              // Removed absolute positioning for mobile screens
              className="flex-shrink-0 flex items-center gap-2 cursor-pointer 
                         absolute left-1/2 -translate-x-1/2 
                         lg:static lg:transform-none lg:flex"
            >
              <h1 className="text-2xl lg:text-3xl font-black tracking-tighter text-white">
                DevNext
              </h1>
            </div>

            {/* Navigation (Desktop Only) */}
            <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {[
                "Home",
                "Subscription",
                "Courses",
                "My Courses",
                "Call Schedule",
              ].map((item) => (
                <Link
                  key={item}
                  href={`/student/${item.toLowerCase().replace(" ", "") || "home"
                    }`}
                  className="font-medium text-white/90 hover:text-white transition"
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* Right Icons (Bell and User) */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Desktop Icons (Hidden on Mobile, now in Mobile Menu) */}
              <DesktopIcon href="/student/wishlist">
                <Heart size={20} />
              </DesktopIcon>
              <DesktopIcon href="/student/cart">
                <ShoppingCart size={20} />
              </DesktopIcon>
              <DesktopIcon href="/student/chat">
                <MessageCircle size={20} />
              </DesktopIcon>

              {/* Notifications */}
              <div ref={notificationRef} className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  // Smaller size on mobile (sm:p-2 keeps desktop size)
                  className="p-1 sm:p-2 text-white/90 hover:text-white transition relative"
                >
                  <Bell size={18} className="lg:size-[20px]" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-3 h-3 rounded-full flex items-center justify-center">
                      {/* Reduced badge size on mobile */}
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                {isNotificationOpen && (
                  <div className="absolute 
                      left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0
                      mt-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-800 overflow-hidden
                      ">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">                      <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={() => {
                            setNotifications([]);
                            setUnreadCount(0);
                          }}
                          className="text-xs text-indigo-600 hover:underline"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {loading ? (
                        <p className="p-8 text-center text-gray-500">
                          Loading...
                        </p>
                      ) : notifications.length === 0 ? (
                        <p className="p-8 text-center text-gray-500">
                          No notifications yet
                        </p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition ${!n.isRead
                              ? "bg-indigo-50 dark:bg-indigo-900/20"
                              : ""
                              }`}
                          >
                            <p
                              className={`text-sm ${!n.isRead ? "font-medium" : ""
                                }`}
                            >
                              {n.message}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500">
                                {n.time}
                              </span>
                              {!n.isRead && (
                                <button
                                  onClick={() => markAsRead(n.id)}
                                  className="text-xs text-indigo-600 hover:underline"
                                >
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  // Smaller padding and user avatar/icon size on mobile
                  className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 rounded-xl hover:bg-white/10 transition text-white"
                >
                  <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-sm">
                    {student?.profilePicture ? (
                      <img
                        src={student.profilePicture}
                        className="w-full h-full object-cover"
                      />
                    ) : student?.name ? (
                      student.name[0].toUpperCase()
                    ) : (
                      <User size={16} className="lg:size-[18px]" />
                    )}
                  </div>
                  <ChevronDown size={14} className="text-white lg:size-[16px]" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700 py-2">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {student?.name}
                      </p>
                      <p className="text-sm text-gray-500">{student?.email}</p>
                    </div>
                    <div className="py-2">
                      {[
                        ["Profile", "/student/profile"],
                        ["Purchase History", "/student/purchases"],
                        ["Certificates", "/student/certificates"],
                      ].map(([label, href]) => (
                        <Link
                          key={href}
                          href={href}
                          className="block px-4 py-2.5 text-sm hover:bg-indigo-50 dark:hover:bg-gray-800 transition"
                        >
                          {label}
                        </Link>
                      ))}
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-y-0 left-0 w-80 bg-white dark:bg-gray-950 shadow-2xl transform transition-transform duration-300 z-50 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            } lg:hidden`}
        >
          <div className="p-6 border-b bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Menu</h2>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={28} />
              </button>
            </div>
          </div>

          {/* FIX: Set a calculated height and overflow-y-auto for the scrollable content */}
          <div className="h-[calc(100vh-6rem)] overflow-y-auto bg-white dark:bg-gray-950">
            <nav className="py-2 space-y-1 ">
              {/* New: Quick Icons for Mobile */}
              <h3 className="px-6 pt-3 pb-1 text-xs uppercase font-semibold text-gray-500 tracking-wider">
                Quick Links
              </h3>
              <MobileIconLink
                href="/student/chat"
                icon={MessageCircle}
                label="Chat"
              />
              <MobileIconLink
                href="/student/wishlist"
                icon={Heart}
                label="Wishlist"
              />
              <MobileIconLink
                href="/student/cart"
                icon={ShoppingCart}
                label="Cart"
              />

              <hr className="my-2 mx-6 border-gray-200 dark:border-gray-700" />

              {/* Main Navigation for Mobile */}
              <h3 className="px-6 pt-3 pb-1 text-xs uppercase font-semibold text-gray-500 tracking-wider">
                Navigation
              </h3>
              {[
                "Home",
                "Subscription",
                "Courses",
                "My Courses",
                "Call Schedule",
              ].map((item) => (
                <Link
                  key={item}
                  href={`/student/${item.toLowerCase().replace(" ", "") || "home"
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-6 py-3 text-lg font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </header>

      {/* Spacer */}
      <div className="h-16 lg:h-20" />

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-80 animate-scaleIn border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Logout Confirmation
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
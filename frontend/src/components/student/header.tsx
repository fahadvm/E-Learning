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
import { studentAuthApi, studentNotificationApi } from "@/services/APIservices/studentApiservice";
import { useStudent } from "@/context/studentContext";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";

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

  const markAsRead = async (id: string) => {
    try {
      await studentNotificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      showErrorToast("Failed to mark as read");
    }
  };

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!student?._id) return;
    try {
      setLoading(true);
      const response = await studentNotificationApi.getNotifications();
      if (response.data && Array.isArray(response.data)) {
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
    socket.on("receive_notification", (data: { message: string, type?: string, id?: string, createdAt?: string }) => {
      const newNotif: Notification = {
        id: data.id || Date.now().toString(),
        message: data.message,
        createdAt: data.createdAt || new Date().toISOString(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: data.type || "info",
        isRead: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
      showSuccessToast(`New notification: ${data.message}`);
    });
    return () => { socket.off("receive_notification") }
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

            {/* LEFT */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-white/10 transition lg:hidden"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* LOGO */}
              <div
                onClick={() => router.push("/student/home")}
                className="cursor-pointer flex items-center"
              >
                <h1 className="text-2xl lg:text-3xl font-black tracking-tighter text-white">
                  DevNext
                </h1>
              </div>
            </div>

            {/* CENTER NAV (Desktop only) */}
            <nav className="hidden lg:flex items-center gap-8">
              {[
                "Home",
                "Subscription",
                "Courses",
                "My Courses",
                "Call Schedule",
              ].map((item) => (
                <Link
                  key={item}
                  href={`/student/${item.toLowerCase().replace(" ", "") || "home"}`}
                  className="font-medium text-white/90 hover:text-white transition"
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* RIGHT ICONS */}
            <div className="flex items-center gap-2 sm:gap-3">
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
                  className="p-2 text-white/90 hover:text-white transition relative hover:bg-white/10 rounded-full"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center ring-2 ring-indigo-600">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden transform origin-top-right transition-all z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-sm flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Notifications</h3>
                        {unreadCount > 0 && <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">{unreadCount} new messages</p>}
                      </div>
                      {notifications.length > 0 && (
                        <button
                          onClick={() => {
                            setNotifications([]);
                            setUnreadCount(0);
                          }}
                          className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                      {loading ? (
                        <div className="p-8 flex flex-col items-center justify-center text-gray-500">
                          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                          <span className="text-xs font-medium">Loading updates...</span>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-10 flex flex-col items-center justify-center text-center">
                          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-3">
                            <Bell className="w-6 h-6 text-indigo-300 dark:text-indigo-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">All caught up!</p>
                          <p className="text-xs text-gray-500 mt-1">No new notifications at the moment</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-50 dark:divide-gray-800">
                          {notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => !n.isRead && markAsRead(n.id)}
                              className={`group p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer flex gap-4 ${!n.isRead ? "bg-indigo-50/30 dark:bg-indigo-900/5" : ""
                                }`}
                            >
                              <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${!n.isRead ? "bg-indigo-500" : "bg-transparent"}`} />
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm leading-snug mb-1 ${!n.isRead ? "font-semibold text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300"}`}>
                                  {n.message}
                                </p>
                                <span className="text-[10px] font-medium text-gray-400">{n.time}</span>
                              </div>
                              {!n.isRead && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(n.id);
                                  }}
                                  title="Mark as read"
                                  className="self-start opacity-0 group-hover:opacity-100 p-1 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded text-indigo-600 transition-all"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
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
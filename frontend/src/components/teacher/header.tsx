"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Bell,
  User,
  LogOut,
  Menu,
  X,
  MessageSquare,
  LayoutDashboard,
  Calendar,
  Users,
  BookOpen,
  Wallet,
} from "lucide-react";

import { teacherAuthApi, teacherCallRequestApi } from "@/services/APIservices/teacherApiService";
import { showErrorToast } from "@/utils/Toast";
import { useTeacher } from "@/context/teacherContext";

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { teacher } = useTeacher();
  const router = useRouter();
  const pathname = usePathname();

  /* -------------------- Scroll Effect -------------------- */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* -------------------- Notifications -------------------- */
  const fetchNotifications = useCallback(async () => {
    if (!teacher?._id) return;
    try {
      const res = await teacherCallRequestApi.tester(teacher._id);
      if (res.ok && Array.isArray(res.data)) {
        setNotifications(res.data.slice(0, 5));
        setUnreadCount(res.data.filter((n: Notification) => !n.isRead).length);
      }
    } catch (err) {
      console.error(err);
    }
  }, [teacher?._id]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    await teacherCallRequestApi.testerMark({ notificationId: id });
    setNotifications((p) => p.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((p) => Math.max(0, p - 1));
  };

  /* -------------------- Logout -------------------- */
  const handleLogout = async () => {
    try {
      await teacherAuthApi.logout();
      localStorage.clear();
      router.push("/teacher/login");
    } catch {
      showErrorToast("Logout failed");
    }
  };

  const navLinks = [
    { name: "Dashboard", href: "/teacher/home", icon: LayoutDashboard },
    { name: "Enrollments", href: "/teacher/enrollments", icon: Users },
    { name: "Slots", href: "/teacher/slots", icon: Calendar },
    { name: "My Courses", href: "/teacher/courses", icon: BookOpen },
    { name: "Earnings", href: "/teacher/earnings", icon: Wallet },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-[100] transition-all ${scrolled
          ? "bg-white/80 backdrop-blur border-b py-3 shadow-sm"
          : "bg-white py-5"
          }`}
      >
        <div className="container mx-auto px-4 md:px-6 max-w-7xl flex items-center justify-between">
          {/* Logo */}
          <Link href="/teacher/home" className="flex items-center gap-2 font-black text-xl">
            <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center">
              D
            </div>
            <span className="hidden sm:block">DevNext</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-1">
            {navLinks.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.name}
                  href={l.href}
                  className={`px-4 py-2 rounded-xl flex gap-2 items-center text-sm font-bold transition ${active ? "bg-black text-white" : "text-zinc-600 hover:bg-zinc-100"
                    }`}
                >
                  <l.icon size={16} />
                  {l.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5 md:gap-3">
            <Link href="/teacher/chat" className="p-2 md:p-2.5 rounded-xl border bg-zinc-50">
              <MessageSquare size={18} className="md:w-5 md:h-5" />
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen((p) => !p)}
                className="p-2 md:p-2.5 rounded-xl border bg-zinc-50 relative"
              >
                <Bell size={18} className="md:w-5 md:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 bg-black text-white text-[10px] md:text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <>
                  {/* Mobile Backdrop */}
                  <div
                    className="fixed inset-0 bg-black/40 z-[105] lg:hidden"
                    onClick={() => setIsNotificationOpen(false)}
                  />

                  <div
                    className="
                      fixed lg:absolute
                      bottom-0 lg:top-full
                      left-0 lg:left-auto
                      right-0
                      mt-0 lg:mt-4
                      w-full lg:w-80
                      max-h-[85vh]
                      bg-white
                      border
                      rounded-t-3xl lg:rounded-2xl
                      shadow-2xl
                      overflow-hidden
                      z-[110]
                    "
                  >
                    <div className="p-4 border-b font-bold flex justify-between">
                      Notifications
                      <button
                        className="lg:hidden"
                        onClick={() => setIsNotificationOpen(false)}
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-6 text-center text-zinc-400 text-sm">
                          No notifications
                        </p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id}
                            onClick={() => !n.isRead && markAsRead(n._id)}
                            className={`p-4 border-b cursor-pointer ${!n.isRead ? "bg-zinc-100" : "opacity-60"
                              }`}
                          >
                            <p className="font-bold text-xs">{n.title}</p>
                            <p className="text-xs text-zinc-600">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <Link
                      href="/teacher/notification"
                      className="block p-3 text-center text-sm font-bold border-t"
                    >
                      View All
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Profile */}
            <Link href="/teacher/profile" className="p-2 md:p-2.5 rounded-xl border bg-zinc-50">
              <User size={18} className="md:w-5 md:h-5" />
            </Link>

            {/* Desktop Logout */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="hidden lg:flex p-2 md:p-2.5 rounded-xl bg-red-50 text-red-600 border"
            >
              <LogOut size={18} className="md:w-5 md:h-5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 md:p-2.5 rounded-xl border bg-zinc-50"
              onClick={() => setIsMobileMenuOpen((p) => !p)}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t p-4 space-y-2">
            {navLinks.map((l) => (
              <Link
                key={l.name}
                href={l.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex gap-3 px-4 py-3 rounded-xl font-bold hover:bg-zinc-100"
              >
                <l.icon size={18} />
                {l.name}
              </Link>
            ))}

            {/* Mobile Logout */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setShowLogoutModal(true);
              }}
              className="flex gap-3 px-4 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50 w-full"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowLogoutModal(false)} />
          <div className="bg-slate-900 p-8 rounded-2xl text-white max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4 text-center">Sign Out?</h3>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 rounded-xl bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 rounded-xl bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-24 lg:h-28" />
    </>
  );
}

"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Bell, Search, User, ChevronDown, LogOut, Menu, X, MessageSquare, LayoutDashboard, Calendar, Users, BookOpen, Wallet } from "lucide-react";
import { teacherAuthApi, teacherCallRequestApi } from "@/services/APIservices/teacherApiService";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);
  const { teacher } = useTeacher();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!teacher?._id) return;

    try {
      const response = await teacherCallRequestApi.tester(teacher._id);
      if (response.ok && Array.isArray(response.data)) {
        setNotifications(response.data.slice(0, 5)); // Keep last 5
        setUnreadCount(response.data.filter((n: Notification) => !n.isRead).length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [teacher?._id]);

  useEffect(() => {
    fetchNotifications();
  }, [teacher?._id, fetchNotifications]);

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
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

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

  const navLinks = [
    { name: "Dashboard", href: "/teacher/home", icon: LayoutDashboard },
    { name: "Enrollments", href: "/teacher/enrollments", icon: Users },
    { name: "Slots", href: "/teacher/slots", icon: Calendar },
    { name: "My Courses", href: "/teacher/courses", icon: BookOpen },
    { name: "Availability", href: "/teacher/callSchedule", icon: Calendar },
    { name: "Earnings", href: "/teacher/earnings", icon: Wallet },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-zinc-200 py-3 shadow-sm"
          : "bg-white py-5 border-b border-transparent"
          }`}
      >
        <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/teacher/home"
            className="group flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-xl">D</span>
            </div>
            <span className="text-2xl font-black text-black tracking-tighter">
              DevNext
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isActive
                    ? "bg-black text-white"
                    : "text-zinc-600 hover:text-black hover:bg-zinc-100"
                    }`}
                >
                  <link.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-400"}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Link
              href="/teacher/chat"
              className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-500 hover:text-black hover:bg-zinc-100 transition-all relative group"
              title="Messages"
            >
              <MessageSquare size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full scale-0 group-hover:scale-100 transition-transform" />
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                className={`p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-500 hover:text-black hover:bg-zinc-100 transition-all relative ${isNotificationOpen ? "bg-zinc-100 text-black" : ""}`}
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                title="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-lg">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute top-full right-0 mt-4 w-80 bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-5 duration-200 z-[110]">
                  <div className="p-4 border-b border-zinc-100 flex justify-between items-center">
                    <h4 className="font-bold text-black text-sm">Notifications</h4>
                    {unreadCount > 0 && <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                  </div>
                  <div className="max-h-80 overflow-y-auto font-medium">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-zinc-400">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">Stay tuned for updates!</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          className={`p-4 border-b border-zinc-50 hover:bg-zinc-50 transition cursor-pointer ${!n.isRead ? "bg-zinc-100/50" : "opacity-60"}`}
                          onClick={() => !n.isRead && markAsRead(n._id)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h5 className="text-xs font-bold text-black">{n.title}</h5>
                            <span className="text-[10px] text-zinc-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-zinc-600 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <Link href="/teacher/notification" className="block p-3 text-center text-xs font-bold text-black border-t border-zinc-100 hover:bg-zinc-50 transition">
                    View All Notifications
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/teacher/profile"
              className={`p-2.5 rounded-xl border transition-all ${pathname === '/teacher/profile' ? 'bg-black text-white border-black' : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-black hover:bg-zinc-100'}`}
              title="Profile Settings"
            >
              <User size={20} />
            </Link>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="p-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white transition-all"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-black hover:bg-zinc-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-zinc-200 p-4 space-y-2 animate-in slide-in-from-top-5 duration-300">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-600 hover:text-black hover:bg-zinc-100 transition-all font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <link.icon size={18} />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)} />
          <div className="relative bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <LogOut className="text-red-500 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Sign Out</h3>
            <p className="text-gray-400 text-center mb-8 text-sm">Are you sure you want to sign out? Your session will be ended.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-all border border-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all shadow-lg shadow-red-600/30"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from jumping behind fixed header */}
      {!scrolled && <div className="h-24 lg:h-28" />}
    </>
  );
}

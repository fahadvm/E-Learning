"use client";

import { Bell, User, Menu, MessageCircle, Flame, LogOut, Building2, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useEmployee } from "@/context/employeeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";
import { showErrorToast, showSuccessToast } from "@/utils/Toast";
import { useRouter } from "next/navigation";

export function TopNav() {
  const router = useRouter();
  const { employee } = useEmployee();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navLinks = [
    { href: "/employee/home", label: "Home" },
    { href: "/employee/learningpath", label: "Learning Path" },
    { href: "/employee/progress", label: "Progress" },
    { href: "/employee/leaderboard", label: "Leaderboard" },
  ];

  // 🔐 Handle Logout
  const handleLogoutConfirm = async () => {
    try {
      await employeeApiMethods.logout();
      localStorage.clear();
      showSuccessToast("Logged out successfully");
      router.push("/employee/login");
    } catch {
      showErrorToast("Logout failed");
    } finally {
      setShowLogoutModal(false);
    }
  };

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="px-6 py-3 flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-10">
          <Link href="/employee/dashboard" className="font-bold text-xl text-primary">
            DevNext
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          <Link href="/employee/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </Button>
          </Link>

          <Link href="/employee/chat">
            <Button variant="ghost" size="icon" className="relative">
              <MessageCircle className="h-5 w-5" />
            </Button>
          </Link>

          <Link href="/employee/streak">
            <Button variant="ghost" size="icon" className="relative">
              <Flame className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                {employee?.streakCount ?? 0}
              </span>
            </Button>
          </Link>

          {/* USER DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/employee/profile" className="flex items-center gap-2 text-sm">
                  <User2 className="h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/employee/company" className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4" /> Company
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-2 text-sm text-red-600 cursor-pointer"
              >
                <LogOut className="h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {!employee?.companyId && (
            <Link href="/employee/company">
              <Button variant="default" className="hidden sm:flex">
                Join
              </Button>
            </Link>
          )}

          {/* Mobile Menu Icon */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-card px-6 py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-80 animate-scaleIn border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3">Logout Confirmation</h3>
            <p className="text-sm mb-6">Are you sure you want to logout?</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-800"
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
    </header>
  );
}

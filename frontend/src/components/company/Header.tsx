"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  Heart,
  ShoppingCart,
  LogOut,
  Trophy,
  BookOpen,
  Users,
  Route,
  Compass,
  User,
  Bell,
  Star,
  Lightbulb,
  Layers,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const router = useRouter();

  const navLinks = [
    { href: "/company/home", label: "Home" },
    { href: "/company/courses", label: "Courses", icon: <BookOpen size={18} /> },
    { href: "/company/employees", label: "Employees", icon: <Users size={18} /> },
    { href: "/company/learningpath", label: "Learning Path", icon: <Route size={18} /> },
    { href: "/company/leaderboard", label: "Leaderboard", icon: <Trophy size={18} /> },
    { href: "/company/tracker", label: "Tracker", icon: <Compass size={18} /> },
  ];

  const handleLogout = async () => {
    try {
      await companyApiMethods.logout();
      localStorage.removeItem("tempSignupEmail");
      router.push("/company/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-white">

        {/* Brand */}
        <Link href="/company/home" className="text-2xl font-bold tracking-tight">
          DevNext <span className="text-primary text-sm font-normal">Enterprise</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition font-medium"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-6">

          {/* Cart */}
          <Link href="/company/cart" className="relative">
            <ShoppingCart size={22} className="text-gray-300 hover:text-white transition" />
          </Link>
          <Link href="/company/notification" className="relative">
            <Bell size={22} className="text-gray-300 hover:text-white transition" />
          </Link>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdown(!userDropdown)}
              className="flex items-center p-2 rounded-full bg-white/5 hover:bg-white/10 transition"
            >
              <User size={22} className="text-gray-300" />
            </button>

            {userDropdown && (
              <div className="absolute right-0 mt-3 w-60 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl py-3 shadow-lg animate-in fade-in slide-in-from-top-2">

                {/* Top User Links */}
                <Link href="/company/profile" className="block px-4 py-2 text-gray-200 hover:bg-white/10 rounded-lg transition">
                  Profile
                </Link>
               
                <Link href="/company/mycourses" className="block px-4 py-2 text-gray-200 hover:bg-white/10 rounded-lg transition">
                  My Courses
                </Link>
                <Link href="/company/purchase-history" className="block px-4 py-2 text-gray-200 hover:bg-white/10 rounded-lg transition">
                  Purchase History
                </Link>

                <Link href="/company/wishlist" className="block px-4 py-2 text-gray-200 hover:bg-white/10 rounded-lg transition">
                  Wishlist
                </Link>

                <hr className="border-white/10 my-2" />

                


                {/* Logout */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition flex items-center gap-2">
                      <LogOut size={18} /> Logout
                    </button>
                  </AlertDialogTrigger>

                  <AlertDialogContent className="bg-slate-900/90 backdrop-blur-xl border border-white/10 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Log out?</AlertDialogTitle>
                      <AlertDialogDescription className="text-white/60">
                        Are you sure you want to log out?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-white/10 hover:bg-white/20 text-white">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Logout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/90 backdrop-blur-xl px-6 py-4 text-white border-t border-white/10 shadow-lg space-y-3">

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-white transition"
            >
              {link.label}
            </Link>
          ))}

          <hr className="border-white/10" />

          {/* Mobile Dropdown Items */}
          <Link href="/company/profile" className="block text-gray-300 hover:text-white transition">
            Profile
          </Link>

          <Link href="/notifications" className="block text-gray-300 hover:text-white transition">
            Notifications
          </Link>

          <Link href="/company/mycourses" className="block text-gray-300 hover:text-white transition">
            My Courses
          </Link>

          <Link href="/company/purchase-history" className="block text-gray-300 hover:text-white transition">
            Purchase History
          </Link>

          <Link href="/company/wishlist" className="block text-gray-300 hover:text-white transition">
            Wishlist
          </Link>

          <hr className="border-white/10" />

          {/* Suggested Items */}
          <div className="text-gray-400 text-sm mt-2">Suggestions</div>
          <Link href="/company/recommended" className="block text-gray-300 hover:text-white transition">
            Recommended for you
          </Link>
          <Link href="/company/learningpath" className="block text-gray-300 hover:text-white transition">
            Learning Path
          </Link>
          <Link href="/company/insights" className="block text-gray-300 hover:text-white transition">
            Insights & Tips
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="block text-red-400 hover:text-red-300 transition flex items-center gap-2">
                <LogOut size={18} /> Logout
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-slate-900/90 backdrop-blur-xl border border-white/10 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Log out?</AlertDialogTitle>
                <AlertDialogDescription className="text-white/60">
                  Are you sure?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white/10 hover:bg-white/20 text-white">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </header>
  );
}

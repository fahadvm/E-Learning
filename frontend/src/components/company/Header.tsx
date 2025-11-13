"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Bell, Heart, ShoppingCart, LogOut, Trophy, BookOpen, Users, Route, Compass, User } from "lucide-react";
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
  const router = useRouter();

  const navLinks = [
    { href: "/company/home", label: "Home" },
    { href: "/company/courses", label: "Courses", icon: <BookOpen size={18} /> },
    { href: "/company/employees", label: "Employees", icon: <Users size={18} /> },
    { href: "/company/learningpath", label: "Learning Path", icon: <Route size={18} /> },
    { href: "/company/mycourses", label: "MyCourses", icon: <BookOpen size={18} /> },
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
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b border-accent/20 bg-black/40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center text-white">
        {/* Brand */}
        <Link
          href="/company/home"
          className="text-2xl font-bold bg-gradient-to-r from-white via-accent to-primary bg-clip-text text-transparent"
        >
          DevNext
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1 text-white/80 hover:text-accent transition"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}

          {/* Icons */}
          <div className="flex items-center gap-5 ml-6">
            <Link href="/notifications" className="relative group">
              <Bell size={18} className="text-white/70 group-hover:text-accent transition" />
              <span className="absolute top-[-6px] right-[-6px] bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">3</span>
            </Link>

            <Link href="/company/wishlist">
              <Heart size={18} className="text-white/70 hover:text-accent transition" />
            </Link>

            <Link href="/company/cart">
              <ShoppingCart size={18} className="text-white/70 hover:text-accent transition" />
            </Link>

            <Link href="/company/profile">
              <User size={18} className="text-white/70 hover:text-accent transition" />
            </Link>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button>
                  <LogOut size={18} className="text-white/70 hover:text-red-400 transition" />
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-black/60 backdrop-blur border border-accent/20 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Log out?</AlertDialogTitle>
                  <AlertDialogDescription className="text-white/60">
                    Are you sure you want to log out?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-white/10 hover:bg-white/20 text-white">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur px-6 py-4 space-y-4 text-white border-t border-accent/20">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white/80 hover:text-accent transition"
            >
              {link.label}
            </Link>
          ))}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-2 text-red-400 hover:text-red-300 transition">
                <LogOut size={18} /> Logout
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-black/60 backdrop-blur border border-accent/20 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Log out?</AlertDialogTitle>
                <AlertDialogDescription className="text-white/60">
                  Are you sure?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white/10 hover:bg-white/20 text-white">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">Logout</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </header>
  );
}

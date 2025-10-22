"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Building, Users, BookOpen, BarChart2, Settings, Package, Bell, GraduationCap, LogOut } from "lucide-react";
import { adminApiMethods } from "@/services/APIservices/adminApiService";

interface SidebarLinkProps { href?: string; onClick?: () => void; icon: React.ReactNode; children: React.ReactNode; }
function SidebarLink({ href, onClick, icon, children }: SidebarLinkProps) {
  return href ? (
    <Link href={href} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">{icon}<span>{children}</span></Link>
  ) : (
    <button onClick={onClick} className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">{icon}<span>{children}</span></button>
  );
}

export default function AdminSidebar() {
  const router = useRouter();
  const handleLogout = async () => { try { await adminApiMethods.logout(); localStorage.removeItem("token"); router.push("/admin/login"); } catch (err) { console.error("Logout failed", err); } };
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white p-6 space-y-4 overflow-hidden z-50">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
      <nav className="space-y-3">
        <SidebarLink href="/admin/dashboard" icon={<LayoutDashboard />}>Dashboard</SidebarLink>
        <SidebarLink href="/admin/companies" icon={<Building />}>Companies</SidebarLink>
        <SidebarLink href="/admin/students" icon={<Users />}>Students</SidebarLink>
        <SidebarLink href="/admin/courses" icon={<BookOpen />}>Courses</SidebarLink>
        <SidebarLink href="/admin/subscriptions" icon={<Package />}>Subscription</SidebarLink>
        <SidebarLink href="/admin/teachers" icon={<GraduationCap />}>Teachers</SidebarLink>
        <SidebarLink href="/admin/orders" icon={<BarChart2 />}>Orders</SidebarLink>
        <SidebarLink href="/admin/notifications" icon={<Bell />}>Notification</SidebarLink>
        <SidebarLink href="/admin/settings" icon={<Settings />}>Settings</SidebarLink>
        <SidebarLink onClick={handleLogout} icon={<LogOut />}>Logout</SidebarLink>
      </nav>
    </aside>
  );
}

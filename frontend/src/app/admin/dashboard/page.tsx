"use client";

import { LayoutDashboard, Building, Users, BookOpen, BarChart2, Settings } from "lucide-react";
import Link from "next/link";
import AdminSidebar from "@/componentssss/admin/sidebar";

export default function StaticAdminDashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100"> {/* Full height and prevent scroll leak */}
      <div className="w-64 h-full flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10"> {/* Scrollable main area */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <DashboardCard title="Total Companies" value="15" />
          <DashboardCard title="Registered Students" value="320" />
          <DashboardCard title="Courses" value="12" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Activity Logs</h2>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li>User John registered.</li>
            <li>Company XYZ created a course.</li>
            <li>Course "JavaScript Basics" updated.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow text-center">
      <h3 className="text-gray-700 text-sm font-medium mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

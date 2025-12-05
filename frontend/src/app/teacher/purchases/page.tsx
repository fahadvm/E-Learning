// app/teacher/purchases/page.tsx
"use client";

import { useState } from "react";
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

type TabType = "all" | "student" | "company";

interface Purchase {
  id: string;
  courseTitle: string;
  buyerName: string;
  buyerType: "student" | "company";
  emailOrCompany: string;
  price: number;
  purchasedAt: string;
  studentsCount?: number;
}

// Sample data
const allPurchases: Purchase[] = [
  { id: "1", courseTitle: "Complete React Mastery 2025", buyerName: "Aarav Sharma", buyerType: "student", emailOrCompany: "aarav@example.com", price: 899, purchasedAt: "2025-12-01" },
  { id: "2", courseTitle: "Complete React Mastery 2025", buyerName: "TechCorp India", buyerType: "company", emailOrCompany: "TechCorp India", price: 49999, purchasedAt: "2025-11-28", studentsCount: 85 },
  { id: "3", courseTitle: "Advanced Node.js & Express", buyerName: "Priya Singh", buyerType: "student", emailOrCompany: "priya@example.com", price: 1199, purchasedAt: "2025-11-25" },
  { id: "4", courseTitle: "TypeScript From Zero to Hero", buyerName: "Global Solutions Ltd", buyerType: "company", emailOrCompany: "Global Solutions Ltd", price: 29999, purchasedAt: "2025-11-20", studentsCount: 42 },
  { id: "5", courseTitle: "Next.js 15 Full Stack", buyerName: "Rahul Verma", buyerType: "student", emailOrCompany: "rahul@gmail.com", price: 1499, purchasedAt: "2025-11-18" },
  // Add more entries for pagination demo...
].concat(Array(20).fill(null).map((_, i) => ({
  id: `extra-${i}`,
  courseTitle: `Sample Course ${i + 1}`,
  buyerName: i % 3 === 0 ? `Company ${i}` : `Student ${i}`,
  buyerType: i % 3 === 0 ? "company" : "student",
  emailOrCompany: i % 3 === 0 ? `Company ${i} Pvt Ltd` : `user${i}@example.com`,
  price: Math.floor(Math.random() * 3000) + 500,
  purchasedAt: "2025-11-10",
  studentsCount: i % 3 === 0 ? Math.floor(Math.random() * 100) + 10 : undefined,
})));

export default function TeacherPurchasesTable() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // Filter by tab
  const filteredData = allPurchases.filter(p =>
    activeTab === "all" || p.buyerType === activeTab
  );

  // Search filter
  const searchedData = filteredData.filter(item =>
    item.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.emailOrCompany.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalItems = searchedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = searchedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const tabs = [
    { id: "all" as const, label: "All Purchases", count: allPurchases.length },
    { id: "student" as const, label: "Students", count: allPurchases.filter(p => p.buyerType === "student").length },
    { id: "company" as const, label: "Companies", count: allPurchases.filter(p => p.buyerType === "company").length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Course Purchases
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View all students and companies who purchased your courses
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.id === "student" && <Users className="w-4 h-4" />}
              {tab.id === "company" && <Building2 className="w-4 h-4" />}
              {tab.id === "all" && <DollarSign className="w-4 h-4" />}
              {tab.label}
              <span className="ml-1 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by course, buyer, email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Buyer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedData.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {purchase.courseTitle}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-gray-900 dark:text-white font-medium">
                        {purchase.buyerName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {purchase.emailOrCompany}
                        {purchase.studentsCount && (
                          <span className="ml-2 text-indigo-600 font-medium">
                            ({purchase.studentsCount} learners)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        purchase.buyerType === "student"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                      }`}>
                        {purchase.buyerType === "student" ? <Users className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                        {purchase.buyerType === "student" ? "Student" : "Company"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-green-600">
                        ₹{purchase.price.toLocaleString("en-IN")}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(purchase.purchasedAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 border disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                          currentPage === page
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="px-2 text-gray-500">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 border disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {searchedData.length === 0 && (
          <div className="text-center py-16">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No purchases found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? "Try adjusting your search" : "Purchases will appear here when students enroll"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";
import React, { useState, useEffect } from "react";
import Loader from "@/componentssss/common/Loader";
import { useRouter, useParams } from "next/navigation";
import { adminApiMethods } from "@/services/APImethods/adminAPImethods";
import { CheckIcon, XMarkIcon, PencilIcon } from "@heroicons/react/24/outline";
import AdminSidebar from "@/componentssss/admin/sidebar";

interface Company {
  _id: string;
  name: string;
  about: string;
  profilePicture: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  isBlocked: boolean;
}

interface Employee {
  _id: string;
  name: string;
  department: string;
  email: string;
  position: string;
  isBlocked: boolean;
}

interface Course {
  _id: string;
  title: string;
  price: string;
  status: string;
}

interface Subscription {
  _id: string;
  plan: string;
  status: string;
  startDate: string;
  endDate: string;
}

export default function CompanyProfile() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs
  const [activeTab, setActiveTab] = useState<"employees" | "courses" | "subscriptions">("employees");

  // Employee table state
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await adminApiMethods.getCompanyById(companyId);
        if (!res.ok) throw new Error("Failed to fetch");
        setCompany(res.data);
        setEmployees(res.data.employees || []);
        setCourses(res.data.courses || []);
        setSubscriptions(res.data.subscriptions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [companyId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader text="Loading..." />
      </div>
    );

  if (!company)
    return <div className="p-8 text-center text-red-500">Company not found</div>;

  // Employee filtering
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDept ? emp.department === filterDept : true;
    return matchesSearch && matchesDept;
  });

  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex h-screen bg-gray-50 mt-5">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800">
        <AdminSidebar />
      </aside>
      <div className="flex-1 p-6 md:p-10 bg-white overflow-auto">
        {/* Company Header */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-center relative">
          <img
            src={company.profilePicture || "/icon/no_image.webp"}
            alt="Company profilePicture"
            className="w-32 h-32 rounded-full mx-auto -mt-16 border-4 border-white shadow-lg object-cover"
          />
          <h2 className="text-3xl font-bold mt-2">{company.name}</h2>
          {/* <p className="text-gray-700">{company.description}</p> */}

          {/* <button
            onClick={() => {
              if (company) setCompany({ ...company, isBlocked: !company.isBlocked });
            }}
            className={`px-4 py-2 rounded mt-4 flex items-center gap-1 mx-auto ${company?.isBlocked ? "bg-green-500 hover:bg-green-600" : "bg-red-600 hover:bg-red-700"
              } text-white`}
          >
            {company?.isBlocked ? "Unblock" : "Block"}
          </button> */}

          <div className="mt-4 text-gray-700 space-y-1">
            <p>📍 {company.about}</p>
            <p>📧 {company.email}</p>
            <p>🔗 {company.website}</p>
            <p>📞 {company.phone}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setActiveTab("employees")}
            className={`px-4 py-2 rounded ${activeTab === "employees" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
          >
            Employees
          </button>
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-4 py-2 rounded ${activeTab === "courses" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
          >
            Courses
          </button>
          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`px-4 py-2 rounded ${activeTab === "subscriptions" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
          >
            Subscriptions
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "employees" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <input
                type="text"
                placeholder="Search employees by name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-1/3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <table className="min-w-full text-sm border">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((emp) => (
                  <tr key={emp._id} className="border-b">
                    <td className="p-2">{emp.name}</td>
                    <td className="p-2">{emp.email}</td>
                    <td className="p-2">{emp.position}</td>
                    <td className="p-2">
                      {emp.isBlocked ? (
                        <span className="px-2 py-1 rounded bg-red-500 text-white text-sm">
                          Blocked
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded bg-green-500 text-white text-sm">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="p-2 flex gap-2">
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        onClick={() => router.push(`/admin/companies/${companyId}/employee/${emp._id}`)}
                      >
                        Details
                      </button>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex justify-between items-center">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Course Management</h3>
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2">Title</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id} className="border-b">
                    <td className="p-2">{course.title}</td>
                    <td className="p-2">{course.price}</td>
                    <td className="p-2">{course.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "subscriptions" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Subscription Management</h3>
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2">Plan</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Start Date</th>
                  <th className="p-2">End Date</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub._id} className="border-b">
                    <td className="p-2">{sub.plan}</td>
                    <td className="p-2">{sub.status}</td>
                    <td className="p-2">{sub.startDate}</td>
                    <td className="p-2">{sub.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Loader from "@/componentssss/common/Loader";
import { useRouter, useParams } from "next/navigation";
import {
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { adminApiMethods } from "@/services/APImethods/adminAPImethods";

interface Company {
  name: string;
  description: string;
  logo: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  isBlocked: boolean;
}

interface Employee {
  id: number;
  name: string;
  role: string;
  email: string;
  joined: string;
}

interface Subscription {
  id: number;
  plan: string;
  status: string;
  startDate: string;
  endDate: string;
  price: string;
}

interface Course {
  id: number;
  title: string;
  purchasedDate: string;
  price: string;
  status: string;
}

export default function CompanyProfile() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(true);

  // Fetch all company data in one call
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const res = await adminApiMethods.getCompanyById(companyId);
        console.log("res in page :", res)
        
        if (!res.ok) throw new Error("Failed to fetch company data");

        setCompany(res.data);
        setFormData(res.data.company);
        setEmployees(res.data.employees || []);
        setSubscriptions(res.data.subscriptions || []);
        setCourses(res.data.courses || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) fetchCompanyData();
  }, [companyId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = () => {
    if (formData) {
      setCompany(formData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(company);
    setIsEditing(false);
  };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">
     <Loader text="Loading, please wait..." color="#0004feff" /> : <div>Content Loaded!</div>
    </div>
  

  if (!company) {
    return <div className="p-8 text-center text-red-500">Company not found</div>;
  }

  const tabs = [
    { id: "details", label: "Profile" },
    { id: "employees", label: "Employees" },
    { id: "subscriptions", label: "Subscriptions" },
    { id: "courses", label: "Courses" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto flex items-center gap-4 mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
        >
          ← Back
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow overflow-hidden">
        {/* Header */}
        <div className="h-48 bg-gradient-to-r from-gray-400 to-gray-500 relative">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <img
              src={company.logo}
              alt="Company Logo"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>
        </div>

        <div className="pt-20 pb-4 text-center">
          <h1 className="text-xl font-bold">{company.name}</h1>
          <p className="text-gray-500">{company.description}</p>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200 flex justify-center space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === tab.id
                  ? "border-b-2 border-purple-500 text-purple-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm h-fit">
            <h2 className="font-semibold text-gray-700 mb-2">Introduction</h2>
            <p className="text-sm text-gray-600">{company.description}</p>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>📍 {company.address}</p>
              <p>📧 {company.email}</p>
              <p>🔗 {company.website}</p>
              <p>📞 {company.phone}</p>
            </div>
          </div>

          {/* Right */}
          <div className="md:col-span-2">
            {activeTab === "details" && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="font-semibold text-gray-700 mb-4">
                  Company Details
                </h2>
                {isEditing && formData ? (
                  <div className="space-y-3">
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border rounded p-2" />
                    <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border rounded p-2" />
                    <input type="url" name="website" value={formData.website} onChange={handleInputChange} className="w-full border rounded p-2" />
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border rounded p-2" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border rounded p-2" />
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full border rounded p-2" />
                    <div className="flex gap-2">
                      <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
                        <CheckIcon className="w-4 h-4 inline mr-1" /> Save
                      </button>
                      <button onClick={handleCancel} className="bg-red-500 text-white px-4 py-2 rounded">
                        <XMarkIcon className="w-4 h-4 inline mr-1" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p><strong>Name:</strong> {company.name}</p>
                    <p><strong>Description:</strong> {company.description}</p>
                    <p><strong>Website:</strong> {company.website}</p>
                    <p><strong>Email:</strong> {company.email}</p>
                    <p><strong>Phone:</strong> {company.phone}</p>
                    <p><strong>Address:</strong> {company.address}</p>
                  </>
                )}
              </div>
            )}

            {activeTab === "employees" && (
              <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-2">Name</th>
                      <th className="p-2">Role</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id} className="border-b">
                        <td className="p-2">{emp.name}</td>
                        <td className="p-2">{emp.role}</td>
                        <td className="p-2">{emp.email}</td>
                        <td className="p-2">{emp.joined}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "subscriptions" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-semibold">{sub.plan}</h3>
                    <p>Status: {sub.status}</p>
                    <p>Start: {sub.startDate}</p>
                    <p>End: {sub.endDate}</p>
                    <p>Price: {sub.price}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "courses" && (
              <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-2">Title</th>
                      <th className="p-2">Purchased Date</th>
                      <th className="p-2">Price</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.id} className="border-b">
                        <td className="p-2">{course.title}</td>
                        <td className="p-2">{course.purchasedDate}</td>
                        <td className="p-2">{course.price}</td>
                        <td className="p-2">{course.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




"use client";

import React, { useState } from "react";
import {
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/outline";

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

const mockEmployees: Employee[] = [
  {
    id: 1,
    name: "John Doe",
    role: "Developer",
    email: "john@example.com",
    joined: "2023-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Designer",
    email: "jane@example.com",
    joined: "2023-03-22",
  },
  {
    id: 3,
    name: "Bob Johnson",
    role: "Manager",
    email: "bob@example.com",
    joined: "2022-11-10",
  },
];

const mockSubscriptions: Subscription[] = [
  {
    id: 1,
    plan: "Premium",
    status: "Active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    price: "$999/year",
  },
  {
    id: 2,
    plan: "Basic",
    status: "Expired",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    price: "$499/year",
  },
];

const mockCourses: Course[] = [
  {
    id: 1,
    title: "Advanced React",
    purchasedDate: "2024-02-15",
    price: "$199",
    status: "Completed",
  },
  {
    id: 2,
    title: "UI/UX Design Principles",
    purchasedDate: "2024-03-20",
    price: "$149",
    status: "In Progress",
  },
  {
    id: 3,
    title: "Project Management",
    purchasedDate: "2024-04-10",
    price: "$99",
    status: "Not Started",
  },
];

const CompanyProfile: React.FC = () => {
  const [company, setCompany] = useState<Company>({
    name: "Example Corp",
    description: "A leading provider of innovative solutions.",
    logo: "https://via.placeholder.com/150",
    website: "https://example.com",
    email: "contact@example.com",
    phone: "+1 (123) 456-7890",
    address: "123 Business St, Suite 100, City, Country",
    isBlocked: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Company>({ ...company });
  const [activeTab, setActiveTab] = useState("details");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setCompany(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(company);
    setIsEditing(false);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlockToggle = () => {
    setCompany((prev) => ({ ...prev, isBlocked: !prev.isBlocked }));
  };

  const tabs = [
    { id: "details", label: "Profile" },
    { id: "employees", label: "Employees" },
    { id: "subscriptions", label: "Subscriptions" },
    { id: "courses", label: "Courses" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow overflow-hidden">
        {/* Cover */}
        <div className="h-48 bg-gradient-to-r from-purple-400 to-indigo-500 relative">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <img
              src={company.logo}
              alt="Company Logo"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Name + Stats */}
        <div className="pt-20 pb-4 text-center">
          <h1 className="text-xl font-bold">{company.name}</h1>
          <p className="text-gray-500">Innovative Solutions Provider</p>
          <div className="flex justify-center gap-10 mt-4">
            <div>
              <p className="font-bold text-gray-800">3545</p>
              <p className="text-gray-500 text-sm">courses</p>
            </div>
            <div>
              <p className="font-bold text-gray-800">3,586</p>
              <p className="text-gray-500 text-sm">streak</p>
            </div>
            <div>
              <p className="font-bold text-gray-800">2,659</p>
              <p className="text-gray-500 text-sm">completed</p>
            </div>
          </div>
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
          {/* Left - Intro */}
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

          {/* Right - Tab Content */}
          <div className="md:col-span-2">
            {activeTab === "details" && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="font-semibold text-gray-700 mb-4">
                  Company Details
                </h2>
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                    />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                    />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                    />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                      >
                        <CheckIcon className="w-4 h-4 inline mr-1" /> Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        <XMarkIcon className="w-4 h-4 inline mr-1" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p>
                      <strong>Name:</strong> {company.name}
                    </p>
                    <p>
                      <strong>Description:</strong> {company.description}
                    </p>
                    <p>
                      <strong>Website:</strong> {company.website}
                    </p>
                    <p>
                      <strong>Email:</strong> {company.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {company.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {company.address}
                    </p>
                  </div>
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
                    {mockEmployees.map((emp) => (
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
                {mockSubscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white p-4 rounded-lg shadow-sm"
                  >
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
                    {mockCourses.map((course) => (
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
};

export default CompanyProfile;

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { adminApiMethods } from "@/services/APIservices/adminApiService";
import { useParams } from "next/navigation";
import AdminSidebar from "@/components/admin/sidebar";
import ConfirmationDialog from '@/reusable/ConfirmationDialog'
import { showSuccessToast } from "@/utils/Toast";


interface Course {
  name: string;
  purchaseDate: string;
  status: "Completed" | "In Progress" | "Expired";
}

interface Plan {
  name: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Expired";
}

interface Student {
  name: string;
  email: string;
  phone: string;
  location: string;
  lastLogin: string;
  profilePicture: string;
  isBlocked: boolean;
  isPremium: boolean;
  stats: { courses: number; streak: number; completed: number };
  personalDetails: Record<string, string>;
  enrollmentDetails: Record<string, string>;
  courses?: Course[];
  plans?: Plan[];
}

const statusColors: Record<string, string> = {
  Completed: "bg-green-100 text-green-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Expired: "bg-red-100 text-red-800",
  Active: "bg-green-100 text-green-800",
};

const TABS = ["Details", "Courses", "Plans"] as const;
type TabType = typeof TABS[number];

const StudentProfileAdmin: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [student, setStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("Details");

  const fetchStudentDetails = async () => {
    try {
      const res = await adminApiMethods.getStudentById(id);
      setStudent(res.data);
    } catch (error) {
      console.error("Error fetching student:", error);
    }
  };

  const handleBlockToggle = async () => {
    try {
      if (!id) return;
      const res = student?.isBlocked
        ? await adminApiMethods.unblockStudent(id)
        : await adminApiMethods.blockStudent(id);
      if (res?.data) {
        showSuccessToast(res.message)
        setStudent(res.data);
      } else {
        setStudent((prev) => prev && { ...prev, isBlocked: !prev.isBlocked });
      }
    } catch (err) {
      console.error("Error updating block status:", err);
    }
  };

  useEffect(() => {
    if (id) fetchStudentDetails();
  }, [id]);

  if (!student) {
    return <div className="p-6 text-gray-500">Loading student profile...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800">
        <AdminSidebar />
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 text-white shadow">
          <h1 className="text-3xl font-semibold">Student Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="max-w-5xl mx-auto px-6 -mt-16 pb-10">
          <div className="bg-white shadow-lg rounded-xl p-6">
            {/* Profile Info */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Image
                src={student.profilePicture ||"/icon/no_image.webp"}
                alt={student.name}
                width={120}
                height={120}
                className="rounded-full border-4 border-white shadow"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {student.name}
                  {student.isPremium && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      PRO
                    </span>
                  )}
                </h2>
                <p className="text-gray-500 text-sm">
                  
                </p>
                <div className="mt-3 flex gap-3">
                  
                  <ConfirmationDialog
                    title={student.isBlocked ? "Unblock Student" : "Block Student"}
                    description={
                      student.isBlocked
                        ? "Are you sure you want to unblock this student?"
                        : "Are you sure you want to block this student?"
                    }
                    confirmText={student.isBlocked ? "Unblock" : "Block"}
                    onConfirm={handleBlockToggle}
                    triggerButton={
                      <button
                        className={`px-4 py-2 rounded-md text-white ${student.isBlocked ? "bg-green-500" : "bg-red-500"
                          }`}
                      >
                        {student.isBlocked ? "Unblock" : "Block"}
                      </button>
                    }
                  />
                  <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200">
                    Send Notification
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              {[
                { label: "Courses", value: student.stats?.courses ?? 0 },
                { label: "Streak", value: student.stats?.streak ?? 0 },
                { label: "Completed", value: student.stats?.completed ?? 0 },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-500">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex border-b mt-8">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 -mb-px border-b-2 transition-colors ${activeTab === tab
                      ? "border-blue-500 text-blue-600 font-medium"
                      : "border-transparent text-gray-500 hover:text-blue-500"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === "Details" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Personal Details
                    </h3>
                    {Object.entries(student.personalDetails || {}).map(
                      ([key, value]) => (
                        <p key={key} className="text-gray-600">
                          <span className="font-medium capitalize">{key}:</span>{" "}
                          {value}
                        </p>
                      )
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Enrollment Details
                    </h3>
                    {Object.entries(student.enrollmentDetails || {}).map(
                      ([key, value]) => (
                        <p key={key} className="text-gray-600">
                          <span className="font-medium capitalize">{key}:</span>{" "}
                          {value}
                        </p>
                      )
                    )}
                  </div>
                </div>
              )}

              {activeTab === "Courses" && (
                <div className="space-y-4">
                  {student.courses?.map((course, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <p className="font-medium text-gray-800">{course.name}</p>
                      <p className="text-sm text-gray-500">
                        Purchase:{" "}
                        {new Date(course.purchaseDate).toLocaleDateString()}
                      </p>
                      <span
                        className={`mt-1 inline-block px-2 py-0.5 text-xs rounded-full ${statusColors[course.status]}`}
                      >
                        {course.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "Plans" && (
                <div className="space-y-4">
                  {student.plans?.map((plan, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <p className="font-medium text-gray-800">{plan.name}</p>
                      <p className="text-sm text-gray-500">
                        Start: {new Date(plan.startDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        End: {new Date(plan.endDate).toLocaleDateString()}
                      </p>
                      <span
                        className={`mt-1 inline-block px-2 py-0.5 text-xs rounded-full ${statusColors[plan.status]}`}
                      >
                        {plan.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileAdmin;

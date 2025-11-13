"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import AdminSidebar from "@/components/admin/sidebar";
import ConfirmationDialog from "@/reusable/ConfirmationDialog";
import { showSuccessToast } from "@/utils/Toast";
import { adminApiMethods } from "@/services/APIservices/adminApiService";

/* ------------------------ Interfaces ------------------------ */

type CourseStatus = "Completed" | "In Progress" | "Not Started";
type TabType = "Details" | "Courses" | "Plan";

interface CourseBackend {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  level?: string;
  category?: string;
  language?: string;
  coverImage?: string;
  price?: number;
  isBlocked?: boolean;
  isVerified?: boolean;
  isPublished?: boolean;
  status?: string;
  teacherId?: string;
  totalDuration?: number;
  modules?: Array<{
    _id: string;
    title: string;
    lessons?: Array<{ _id: string; title: string; duration?: number }>;
  }>;
  createdAt?: string | Date;
}

interface ProgressEntry {
  courseId: string;
  completedLessons: string[];
  completedModules: string[];
  percentage: number;
}

interface Plan {
  name: string;
  startDate?: string;
  endDate?: string;
  status?: "Active" | "Expired";
}

interface StudentBackend {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  lastLogin?: string | Date;
  profilePicture?: string;
  isBlocked?: boolean;
  isPremium?: boolean;
  coursesProgress?: ProgressEntry[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  about?: string;
  isVerified?: boolean;
  social_links?: { linkedin?: string; twitter?: string; instagram?: string };
}

/* -------------------------- Helper styles --------------------------- */
const statusStyles: Record<CourseStatus, string> = {
  Completed: "bg-green-100 text-green-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  "Not Started": "bg-red-100 text-red-800",
};

/* ------------------------ Utility functions ------------------------ */
const determineStatus = (percentage?: number): CourseStatus => {
  const p = percentage ?? 0;
  if (p >= 100) return "Completed";
  if (p > 0) return "In Progress";
  return "Not Started";
};

const safeDate = (d?: string | Date) =>
  d ? new Date(d).toLocaleDateString() : "N/A";

/* -------------------------- Main Component ------------------------- */
export default function StudentProfileAdmin() {
  const params = useParams() as { id?: string };
  const id = params?.id;

  const [student, setStudent] = useState<StudentBackend | null>(null);
  const [courses, setCourses] = useState<CourseBackend[]>([]);
  const [plan, setPlan] = useState<Plan | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>("Details");
  const [expandedCourseIds, setExpandedCourseIds] = useState<
    Record<string, boolean>
  >({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchStudentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const res = await adminApiMethods.getStudentById(id as string);

      setStudent({
        _id: res.data.student._id,
        name: res.data.student.name,
        email: res.data.student.email,
        phone: res.data.student.phone,
        location: res.data.student.location ?? "",
        lastLogin: res.data.student.lastLogin ?? res.data.student.updatedAt,
        profilePicture: res.data.student.profilePicture,
        isBlocked: res.data.student.isBlocked,
        isPremium: res.data.student.isPremium,
        coursesProgress: res.data.student.coursesProgress ?? [],
        createdAt: res.data.student.createdAt,
        updatedAt: res.data.student.updatedAt,
        about: res.data.student.about,
        isVerified: res.data.student.isVerified,
        social_links: res.data.student.social_links ?? {},
      });

      setCourses(res.data.courses ?? []);

      if (res.data.currentPlan) {
        setPlan({
          name: res.data.currentPlan.name,
          startDate: res.data.currentPlan.startDate,
          endDate: res.data.currentPlan.expiresAt,
          status: "Active",
        });
      } else {
        setPlan(null);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching student:", err);
      setLoading(false);
    }
  };

  const handleBlockToggle = async () => {
    try {
      if (!id || !student) return;

      const res = student.isBlocked
        ? await adminApiMethods.unblockStudent(id)
        : await adminApiMethods.blockStudent(id);

      if (res?.data) {
        showSuccessToast(res.message ?? "Updated");

        setStudent((prev) =>
          prev ? { ...prev, isBlocked: !prev.isBlocked } : prev
        );
      }
    } catch (err) {
      console.error("Error updating block status:", err);
    }
  };

  /* ----------------------- Derived Data ---------------------- */
  const coursesWithProgress = useMemo(() => {
    if (!student) return [];

    return courses.map((course) => {
      const progress = student.coursesProgress?.find(
        (p) => p.courseId === String(course._id)
      );

      const percentage = progress?.percentage ?? 0;

      return {
        ...course,
        percentage,
        status: determineStatus(percentage),
        progressEntry: progress,
      };
    });
  }, [courses, student]);

  const toggleCourseExpand = (courseId: string) => {
    setExpandedCourseIds((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  if (loading || !student)
    return (
      <div className="p-6 text-gray-600 text-lg animate-pulse">
        Loading student profile...
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900">
        <AdminSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 text-white shadow">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold">Student Profile</h1>
            <div className="text-sm text-gray-200">ID: {student._id}</div>
          </div>
        </div>

        {/* Profile Box */}
        <div className="max-w-6xl mx-auto px-6 -mt-14 pb-10">
          <div className="bg-white shadow-xl rounded-xl p-6">
            {/* Top Info */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative w-[130px] h-[130px]">
                <Image
                  src={student.profilePicture || "/icon/no_image.webp"}
                  alt={student.name}
                  fill
                  sizes="130px"
                  className="rounded-full shadow-lg ring-4 ring-gray-200 object-cover"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  {student.name}

                  {student.isPremium && (
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-xs text-white px-3 py-1 rounded-full shadow-lg animate-pulse">
                      PREMIUM
                    </span>
                  )}
                </h2>

                <p className="text-gray-600 mt-1">{student.email}</p>

                <div className="mt-3 flex flex-wrap gap-3 items-center">
                  <div className="text-sm text-gray-500">Last Login: {student.lastLogin ? new Date(student.lastLogin).toLocaleString() : "Never"}</div>

                  <div className="flex gap-2 ml-2">
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
                          className={`px-4 py-2 rounded-md text-white ${student.isBlocked ? "bg-green-600" : "bg-red-600"}`}
                        >
                          {student.isBlocked ? "Unblock" : "Block"}
                        </button>
                      }
                    />

                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Send Notification</button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[{ label: "Total Courses", value: coursesWithProgress.length }, { label: "Completed", value: coursesWithProgress.filter((c) => c.status === "Completed").length }, { label: "Progress Avg", value: Math.round((coursesWithProgress.reduce((s, c) => s + (c.percentage ?? 0), 0) || 0) / Math.max(coursesWithProgress.length, 1)) + "%" }].map((s) => (
                    <div key={s.label} className="bg-gray-50 p-4 rounded-lg text-center shadow-sm">
                      <p className="text-gray-500">{s.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b mt-8">
              {["Details", "Courses", "Plan"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t as TabType)}
                  className={`px-5 py-3 -mb-px border-b-2 ${activeTab === t ? "border-blue-600 text-blue-600 font-medium" : "border-transparent text-gray-500 hover:text-blue-600"}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="mt-6">
              {activeTab === "Details" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <details className="border rounded-lg p-4 bg-gray-50">
                    <summary className="cursor-pointer font-medium text-gray-800">Personal Details</summary>
                    <div className="mt-3 space-y-2">
                      <p><span className="font-medium">Email:</span> {student.email}</p>
                      <p><span className="font-medium">Phone:</span> {student.phone ?? 'N/A'}</p>
                      <p><span className="font-medium">Location:</span> {student.location ?? 'N/A'}</p>
                      <p><span className="font-medium">About:</span> {student.about ?? '—'}</p>
                      <p><span className="font-medium">Verified:</span> {student.isVerified ? 'Yes' : 'No'}</p>
                    </div>
                  </details>

                  <details className="border rounded-lg p-4 bg-gray-50">
                    <summary className="cursor-pointer font-medium text-gray-800">Enrollment & Plan</summary>
                    <div className="mt-3 space-y-2">
                      <p><span className="font-medium">Joined:</span> {safeDate(student.createdAt)}</p>
                      <p><span className="font-medium">Last Updated:</span> {safeDate(student.updatedAt)}</p>
                      <p><span className="font-medium">Current Plan:</span> {plan ? plan.name : 'Free'}</p>
                      <p><span className="font-medium">Plan Expires:</span> {plan && plan.endDate ? new Date(plan.endDate).toLocaleDateString() : '—'}</p>
                    </div>
                  </details>
                </div>
              )}

              {activeTab === "Courses" && (
                <div className="space-y-4">
                  {coursesWithProgress.map((c) => (
                    <div key={String(c._id)} className="bg-white shadow p-4 rounded-lg border flex gap-4">
                      {/* Thumbnail */}
                      <div className="w-[140px] h-[80px] relative flex-shrink-0">
                        <Image src={c.coverImage || '/icon/no_image.webp'} alt={c.title} fill sizes="140px" className="rounded-md object-cover" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-gray-900 text-lg">{c.title}</p>
                            <p className="text-sm text-gray-500">{c.subtitle}</p>
                          </div>

                          <div className="text-right">
                            <span className={`px-3 py-1 text-xs rounded-full ${statusStyles[c.status]}`}>{c.status}</span>
                            <div className="text-sm text-gray-500 mt-2">Purchased: {safeDate(c.createdAt)}</div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${c.percentage}%` }}></div>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-500">{c.percentage}% completed</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => toggleCourseExpand(String(c._id))} className="text-sm text-blue-600">{expandedCourseIds[String(c._id)] ? 'Hide Modules' : 'View Modules'}</button>
                          </div>
                        </div>

                        {/* Collapsible modules preview */}
                        {expandedCourseIds[String(c._id)] && (
                          <div className="mt-4 border-t pt-4 space-y-3">
                            <h4 className="font-medium text-gray-800">Modules</h4>

                            {c.modules && c.modules.length > 0 ? (
                              c.modules.map((m) => (
                                <div key={m._id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                  <div>
                                    <p className="font-medium text-gray-800">{m.title}</p>
                                    <p className="text-sm text-gray-500">{m.lessons?.length ?? 0} lessons</p>
                                  </div>

                                  <div className="text-sm text-gray-600">
                                    {c.progressEntry?.completedModules?.includes(m._id) ? (
                                      <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs">Completed</span>
                                    ) : (
                                      <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">Pending</span>
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">No modules available for this course.</p>
                            )}

                            {/* Quick actions */}
                            <div className="flex gap-2">
                              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">Open Course</button>
                              <button className="px-3 py-1 text-sm bg-gray-200 rounded">View Activity</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {coursesWithProgress.length === 0 && (
                    <div className="text-gray-500">No courses found for this student.</div>
                  )}
                </div>
              )}

              {activeTab === "Plan" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <details className="border rounded-lg p-4 bg-gray-50">
                    <summary className="cursor-pointer font-medium text-gray-800">Enrollment & Plan</summary>
                    <div className="mt-3 space-y-2">
                      <p><span className="font-medium">Joined:</span> {safeDate(student.createdAt)}</p>
                      <p><span className="font-medium">Last Updated:</span> {safeDate(student.updatedAt)}</p>
                      <p><span className="font-medium">Current Plan:</span> {plan ? plan.name : 'Free'}</p>
                      <p><span className="font-medium">Plan Expires:</span> {plan && plan.endDate ? new Date(plan.endDate).toLocaleDateString() : '—'}</p>
                    </div>
                  </details>
                </div>
              )}



              <div className="mt-6 text-sm text-gray-500">Updated: {safeDate(student.updatedAt)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

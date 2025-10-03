"use client";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Header from "@/components/company/Header";
import { useRouter, useParams } from "next/navigation";
import { companyApiMethods } from "@/services/APImethods/companyAPImethods";
import { showSuccessToast } from "@/utils/Toast";

interface Employee {
  _id: string;
  name: string;
  email: string;
  position?: string;
  isBlocked?: boolean;
}

interface Course {
  _id: string;
  title: string;
  description?: string;
}

export default function EmployeeDetailsPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [editFormErrors, setEditFormErrors] = useState<{ name?: string; email?: string }>({});
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "courses" | "recent activities">("details");
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchEmployee = async () => {
    try {
      const res = await companyApiMethods.getEmployeeById(id as string)

      setEmployee(res.data);
    } catch (err) {
      const errorMessage = err instanceof AxiosError ? err.response?.data?.message || err.message : "Failed to fetch employee";
      setError(errorMessage);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/company/courses`);
      if (Array.isArray(res.data.data)) {
        // setCourses(res.data.data);
        setCourses([]);
      } else {
        throw new Error("Unexpected API response format for courses");
      }
    } catch (err) {
      const errorMessage = err instanceof AxiosError ? err.response?.data?.message || err.message : "Failed to fetch courses";
      setError(errorMessage);
    }
  };

  const fetchAssignedCourses = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/company/employee/${id}/courses`);
      if (Array.isArray(res.data.data)) {
        setAssignedCourses(res.data.data);
      } else {
        throw new Error("Unexpected API response format for assigned courses");
      }
    } catch (err) {
      const errorMessage = err instanceof AxiosError ? err.response?.data?.message || err.message : "Failed to fetch assigned courses";
      setError(errorMessage);
    }
  };

  const assignCourse = async () => {
    if (!selectedCourseId) {
      setError("Please select a course to assign");
      return;
    }

    setActionLoading(true);
    setError(null);
    try {
      await axios.post(`${API_BASE_URL}/auth/company/employee/${id}/assign-course`, {
        courseId: selectedCourseId,
      });
      setSelectedCourseId("");
      await fetchAssignedCourses();
    } catch (err) {
      const errorMessage = err instanceof AxiosError ? err.response?.data?.message || err.message : "Failed to assign course";
      setError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (!selectedEmployee) return;

    const errors: { name?: string; email?: string } = {};
    if (!editName.trim()) errors.name = "Name is required";
    if (!editEmail.trim()) errors.email = "Email is required";

    if (Object.keys(errors).length > 0) {
      setEditFormErrors(errors);
      return;
    }

    try {
      const res = await companyApiMethods.updateEmployee(selectedEmployee._id, {
        name: editName,
        email: editEmail,
        position: editPosition,
      })
      if(res.ok){
        showSuccessToast(res.message)
      }
      await fetchEmployee(); // refresh data
      setIsEditModalOpen(false);
    } catch (err) {
      const errorMessage = err instanceof AxiosError ? err.response?.data?.message || err.message : "Failed to update employee";
      setError(errorMessage);
    }
  };


  const unassignCourse = async (courseId: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/auth/company/employee/${id}/unassign-course`, {
        data: { courseId },
      });
      await fetchAssignedCourses();
    } catch (err) {
      const errorMessage = err instanceof AxiosError ? err.response?.data?.message || err.message : "Failed to unassign course";
      setError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };
  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditName(employee.name);
    setEditEmail(employee.email);
    setEditPosition(employee.position || "");
    setEditFormErrors({});
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    if (id) {
      fetchEmployee();
      // fetchCourses();
      // fetchAssignedCourses();
    }
  }, [id]);

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 pt-20">
        <Header />
        <div className="max-w-7xl mx-auto">
          <div className="text-gray-600 text-center py-8">Loading employee details...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Employee Details</h2>
              <button
                onClick={() => router.push("/company/employees")}
                className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                aria-label="Back to employees list"
              >
                Back to Employees
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow" role="alert">
                {error}
              </div>
            )}

            <div className="flex border-b mb-4">
              <button
                onClick={() => setActiveTab("details")}
                className={`px-4 py-2 font-semibold ${activeTab === "details" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                aria-label="Employee details tab"
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab("courses")}
                className={`px-4 py-2 font-semibold ${activeTab === "courses" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                aria-label="Courses tab"
              >
                Courses
              </button>
              
            </div>

            {activeTab === "details" && (
              <div className="space-y-3">

                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Employee Details</h3>
                  <button
                    onClick={() => openEditModal(employee)}
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                    aria-label={`Edit ${employee.name}`}
                  >
                    Edit
                  </button>
                  <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                    Edit Employee
                  </span>
                </div>

                <p className="text-gray-700"><strong>Name:</strong> {employee.name}</p>
                <p className="text-gray-700"><strong>Email:</strong> {employee.email}</p>
                <p className="text-gray-700"><strong>Position:</strong> {employee.position || "N/A"}</p>
                <p className="text-gray-700"><strong>Status:</strong> {employee.isBlocked ? "Blocked" : "Active"}</p>
              </div>
            )}
            {activeTab === "courses" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Manage Courses</h3>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-2">Assigned Courses</h4>
                  {assignedCourses.length === 0 ? (
                    <p className="text-gray-600">No courses assigned.</p>
                  ) : (
                    <table className="w-full text-gray-800">
                      <thead>
                        <tr>
                          <th className="text-left p-2 font-semibold">Course ID</th>
                          <th className="text-left p-2 font-semibold">Title</th>
                          <th className="text-left p-2 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignedCourses.map((course) => (
                          <tr key={course._id} className="border-t hover:bg-gray-50">
                            <td className="p-2">{course._id}</td>
                            <td className="p-2">{course.title}</td>
                            <td className="p-2">
                              <button
                                onClick={() => unassignCourse(course._id)}
                                className="bg-red-600 text-white py-1 px-2 rounded-lg hover:bg-red-700 disabled:bg-red-300"
                                disabled={actionLoading}
                                aria-label={`Unassign course ${course.title}`}
                              >
                                Unassign
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-2">Assign New Course</h4>
                  <select
                    className="w-full rounded-md border border-gray-300 p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    aria-label="Select course to assign"
                    disabled={actionLoading || courses.length === 0}
                  >
                    <option value="" disabled>
                      Select a course
                    </option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={assignCourse}
                    className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                    disabled={actionLoading || !selectedCourseId}
                    aria-label="Assign course"
                  >
                    {actionLoading ? "Assigning..." : "Assign Course"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <h3 className="text-xl font-bold mb-4">Edit Employee</h3>

            {/* <div className="mb-4">
              <label className="block font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              {editFormErrors.name && <p className="text-red-500 text-sm mt-1">{editFormErrors.name}</p>}
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
              {editFormErrors.email && <p className="text-red-500 text-sm mt-1">{editFormErrors.email}</p>}
            </div> */}

            <div className="mb-4">
              <label className="block font-medium mb-1">Position</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={editPosition}
                onChange={(e) => setEditPosition(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
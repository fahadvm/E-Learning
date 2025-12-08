"use client";

import { useEffect, useState } from "react";
import Header from "@/components/company/Header";
import {  useParams } from "next/navigation";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { showSuccessToast } from "@/utils/Toast";
import { Trash2 } from "lucide-react";

interface Employee {
  _id: string;
  name: string;
  email: string;
  position?: string;
}

interface LearningPath {
  _id: string;
  title: string;
  category: string;
  difficulty: string;
  icon?: string;
  courses: any[];
}

// Assigned Paths response structure:
interface AssignedPath {
  _id: string;
  title: string;
  difficulty: string;
  icon?: string;
  courses?: any[];
}

export default function EmployeeDetailsPage() {
  const [activeTab, setActiveTab] = useState<"details" | "learningpaths"|"progress">("details");
  const [employee, setEmployee] = useState<Employee | null>(null);

  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [assignedPaths, setAssignedPaths] = useState<AssignedPath[]>([]);
  const [selectedLearningPathId, setSelectedLearningPathId] = useState("");

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { id } = useParams();
  const employeeId = Array.isArray(id) ? id[0] : id || "";

  /* Fetch Employee Details */
  const fetchEmployee = async () => {
    const res = await companyApiMethods.getEmployeeById(employeeId);
    setEmployee(res.data);
  };

  /* Fetch All LPs and Assigned LPs */
  const fetchLearningPaths = async () => {
    const res = await companyApiMethods.getLearningPath();
    const assignedRes = await companyApiMethods.getAssignedLearningPaths(employeeId);
    console.log("assignedPaths raw:", assignedRes.data);
    const assigned = assignedRes.data || [];

    // ✅ Remove already assigned LPs from dropdown list
    const available = (res.data || []).filter(
      (lp: LearningPath) =>
        !assigned.some((a: AssignedPath) => a._id === lp._id)
    );

    setLearningPaths(available);
    console.log("assigned", assigned)
    setAssignedPaths(assigned);
  };

  /* Assign LP */
  const assignLearningPath = async () => {
    if (!selectedLearningPathId) return;

    const res = await companyApiMethods.assignLearningPath({
      employeeId,
      learningPathId: selectedLearningPathId,
    });
    if(res.ok){

      showSuccessToast("Learning Path Assigned Successfully!");
    }

    setSelectedLearningPathId("");
    fetchLearningPaths();
  };

  /* Unassign LP */
  const unassignLearningPath = async () => {
    if (!confirmDeleteId) {
      console.log("deleting id is missing")
      return
    };

    await companyApiMethods.unassignLearningPath({
      employeeId,
      learningPathId: confirmDeleteId,
    });

    showSuccessToast("Learning Path Removed.");

    setConfirmDeleteId(null);
    fetchLearningPaths();
  };

  /* Load Initial */
  useEffect(() => {
    if (employeeId) {
      fetchEmployee();
      fetchLearningPaths();
    }
  }, [employeeId]);

  if (!employee) return <div>Loading...</div>;

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 pt-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Employee Details</h2>

        {/* Tabs */}
        <div className="flex gap-6 border-b pb-2 mb-6">
          <button
            onClick={() => setActiveTab("details")}
            className={activeTab === "details" ? "border-b-2 border-blue-600 font-semibold" : "text-gray-600"}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("learningpaths")}
            className={activeTab === "learningpaths" ? "border-b-2 border-blue-600 font-semibold" : "text-gray-600"}
          >
            Learning Paths
          </button>
          <button
            onClick={() => setActiveTab("progress")}
            className={activeTab === "learningpaths" ? "border-b-2 border-blue-600 font-semibold" : "text-gray-600"}
          >
            Progress
          </button>
        </div>

        {/* -------------------------------- DETAILS TAB -------------------------------- */}
        {activeTab === "details" && (
          <div className="bg-white p-6 rounded-xl shadow space-y-2">
            <p><strong>Name:</strong> {employee.name}</p>
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Position:</strong> {employee.position || "N/A"}</p>
          </div>
        )}

        {/* -------------------------------- LEARNING PATH TAB -------------------------------- */}
        {activeTab === "learningpaths" && (
          <div className="space-y-6">

            {/* Assigned Paths */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">Assigned Learning Paths</h3>

              {assignedPaths.length === 0 ? (
                <p className="text-gray-600">No Learning Paths Assigned.</p>
              ) : (
                assignedPaths.map((lp) => (
                  <div
                    key={lp._id}
                    className="flex justify-between items-center border-b py-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{lp.icon || "📚"}</span>
                      <span className="font-medium">{lp.title}</span>
                    </div>

                    <button
                      onClick={() => setConfirmDeleteId(lp._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Assign New Path */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">Assign New Learning Path</h3>

              <select
                className="w-full p-3 border rounded-lg"
                value={selectedLearningPathId}
                onChange={(e) => setSelectedLearningPathId(e.target.value)}
              >
                <option value="">Select Learning Path</option>
                {learningPaths.map((lp) => (
                  <option key={lp._id} value={lp._id}>
                    {lp.title} ({lp.courses.length} courses)
                  </option>
                ))}
              </select>

              <button
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg"
                disabled={!selectedLearningPathId}
                onClick={assignLearningPath}
              >
                Assign
              </button>
            </div>

          </div>
        )}
        {activeTab === "progress" && (
          <div className="bg-white p-6 rounded-xl shadow space-y-2">
            <p><strong>progress:</strong> {employee.name}</p>
            <p><strong>assigned courses:</strong> {employee.email}</p>
            <p><strong>completed courses:</strong> {employee.position || "N/A"}</p>
          </div>
        )}

      </div>

      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl space-y-4 w-80 text-center">
            <p>Remove this learning path?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>
              <button onClick={unassignLearningPath} className="px-4 py-2 bg-red-600 text-white rounded">
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

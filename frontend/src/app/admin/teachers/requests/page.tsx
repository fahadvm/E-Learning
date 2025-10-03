"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/sidebar";
import DataTable from "@/reusable/DataTable";
import { useRouter } from "next/navigation";
import { adminApiMethods } from "@/services/APImethods/adminAPImethods";

type Teacher = {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
};

export default function UnverifiedTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 5;
  const router = useRouter();

  // Reject modal state
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectTeacherId, setRejectTeacherId] = useState<string | null>(null);
  const [rejectAllMode, setRejectAllMode] = useState(false);

  const fetchTeachers = async () => {
    try {
      const res = await adminApiMethods.getUnverifiedTeachers({
        search: searchTerm,
        page: currentPage,
        limit: rowsPerPage,
      });
      console.log("unverifid teachers",res)


      if (Array.isArray(res.data)) {
        setTeachers(res.data);
        setTotalPages(res.data.totalPages || 1);
      } else {
        console.error("Unexpected response format:", res.data);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [searchTerm, currentPage]);

  const handleAccept = async (id: string) => {
    try {
      await adminApiMethods.verifyTeacher(id);
      fetchTeachers();
    } catch (err) {
      console.error("Error approving teacher:", err);
    }
  };

  const handleReject = async () => {
    if (!rejectTeacherId) return;
    try {
      await adminApiMethods.rejectTeacher(rejectTeacherId, rejectReason);
      closeRejectModal();
      fetchTeachers();
    } catch (err) {
      console.error("Error rejecting teacher:", err);
    }
  };

  const handleAcceptAll = async () => {
    try {
      fetchTeachers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectAll = () => {
    setRejectAllMode(true);
    setRejectModalOpen(true);
  };

  const confirmRejectAll = async () => {
    try {
    //   await adminApiMethods.rejectAllTeachers(rejectReason);
      closeRejectModal();
      fetchTeachers();
    } catch (err) {
      console.error(err);
    }
  };

  const closeRejectModal = () => {
    setRejectModalOpen(false);
    setRejectReason("");
    setRejectTeacherId(null);
    setRejectAllMode(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <aside className="w-64 bg-gray-900 border-r border-gray-700">
        <AdminSidebar />
      </aside>

      <main className="flex-1 p-6 md:p-10 bg-white overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Unverified Teachers</h1>
          {/* <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={handleAcceptAll}
            >
              Accept All
            </button>
            <button
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={handleRejectAll}
            >
              Reject All
            </button>
          </div> */}
        </div>

        <DataTable<Teacher>
          data={teachers}
          searchPlaceholder="Search by name or email"
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            {
              key: "actions",
              label: "Actions",
              render: (t) => (
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => router.push(`/admin/teacher/${t._id}`)}
                  >
                    Details
                  </button>
                  <button
                    className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => handleAccept(t._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => {
                      setRejectTeacherId(t._id);
                      setRejectModalOpen(true);
                    }}
                  >
                    Reject
                  </button>
                </div>
              ),
            },
          ]}
          currentPage={currentPage}
          totalPages={totalPages}
          onSearch={(term) => {
            setSearchTerm(term);
            setCurrentPage(1);
          }}
          onPageChange={(page) => setCurrentPage(page)}
        />

        {/* Reject Modal */}
        {isRejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                {rejectAllMode ? "Reason for Rejecting All" : "Reason for Rejection"}
              </h2>
              <textarea
                className="w-full border p-2 rounded mb-4"
                rows={4}
                placeholder="Enter reason..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={closeRejectModal}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={rejectAllMode ? confirmRejectAll : handleReject}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

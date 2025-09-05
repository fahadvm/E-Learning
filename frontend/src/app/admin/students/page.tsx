"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/componentssss/admin/sidebar";
import DataTable from "@/reusable/DataTable";
import { adminApiMethods } from "@/services/APImethods/adminAPImethods";

type User = {
  _id: string;
  name: string;
  email: string;
  NOcourses?: number;
  subscription?: boolean;
  isBlocked: boolean;
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 5;
  const router = useRouter()

  const fetchUsers = async () => {
    try {
      const res = await adminApiMethods.getStudents({
        search: debouncedSearchTerm,
        page: currentPage,
        limit: rowsPerPage,
      });

      if (Array.isArray(res.data?.students)) {
        setUsers(res.data.students);
        setTotalPages(res.data.totalPages || 1);
      } else {
        console.error("Unexpected response format:", res.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearchTerm, currentPage]);

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <aside className="w-64 bg-gray-900 border-r border-gray-700">
        <AdminSidebar />
      </aside>

      <main className="flex-1 p-6 md:p-10 bg-white overflow-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Students</h1>

        <DataTable<User>
          data={users}
          searchPlaceholder="Search by name"
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            {
              key: "NOcourses",
              label: "Courses",
              render: (u) => u.NOcourses ?? 0,
            },
            {
              key: "subscription",
              label: "Subscription",
              render: (u) => (u.subscription ? "Available" : "No Package"),
            },
            {
              key: "isBlocked",
              label: "Status",
              render: (u) => (
                <span
                  className={`px-2 py-1 rounded text-white text-sm font-medium ${
                    u.isBlocked ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {u.isBlocked ? "Blocked" : "Active"}
                </span>
              ),
            },
          ]}
          onDetailClick={(user) => {
            router.push(`/admin/students/${user._id}`);
          }}
          currentPage={currentPage}
          totalPages={totalPages}
          onSearch={(term) => {
            setSearchTerm(term);
            setCurrentPage(1);
          }}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </main>
    </div>
  );
}

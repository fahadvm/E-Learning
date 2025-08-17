"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "@/componentssss/admin/sidebar";
import DataTable from "@/reusable/DataTable";
import Link from "next/link";

export default function CompanyList() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin/teachers`);
        setTeachers(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
      }
    };
    fetchTeachers();
  }, []);

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "subscription",
      label: "courses",
      render: (item: any) => (item.subscription ? "Available" : "No courses"),
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 flex-shrink-0">
        <AdminSidebar />
      </div>
      <div className="flex-1 overflow-auto bg-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Teachers</h1>
        <Link href="/admin/teachers/requests">
                    <button
                      type="button"
                      className="bg-gray-900 text-white px-5 mb-5 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition align-right+"
                    >
                      + verification requests
                    </button>
                  </Link>
        <DataTable data={teachers} columns={columns} searchPlaceholder="Search teachers..." 
        onDetailClick={(teachers) => {
            alert(`Viewing user: ${teachers.name}`);
          }}/>
      </div>
      
    </div>
  );
}

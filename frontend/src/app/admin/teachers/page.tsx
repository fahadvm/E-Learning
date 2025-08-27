"use client";
import { useEffect, useState } from "react";
import AdminSidebar from "@/componentssss/admin/sidebar";
import DataTable from "@/reusable/DataTable";
import Link from "next/link";
import { adminApiMethods } from "@/services/APImethods/adminAPImethods";
import { useRouter } from "next/navigation";

export default function CompanyList() {
    const [teachers, setTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const rowsPerPage = 5;
    const router = useRouter()

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await adminApiMethods.getTeachers({ search: searchTerm, page: currentPage, limit: rowsPerPage });
                setTeachers(res.data.data || []);
                setTotalPages(res.data.totalPages || 1);
            } catch (err) { console.error("Failed to fetch teachers:", err); }
        };
        fetchTeachers();
    }, [searchTerm, currentPage]);

    const columns = [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "subscription", label: "Courses", render: (item: any) => (item.subscription ? "Available" : "No courses") }
    ];

    return (
        <div className="flex h-screen overflow-hidden">
            <div className="w-64 flex-shrink-0"><AdminSidebar /></div>
            <div className="flex-1 overflow-auto bg-gray-100 p-8">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Teachers</h1>
                <Link href="/admin/teachers/requests"><button type="button" className="bg-gray-900 text-white px-5 mb-5 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition">+ verification requests</button></Link>
                <DataTable
                    data={teachers}
                    columns={columns}
                    searchPlaceholder="Search teachers..."
                    onDetailClick={(teacher) => router.push(`/admin/teachers/${teacher._id}`)}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onSearch={(term) => {
                        setSearchTerm(term);
                        setCurrentPage(1);
                    }}
                    onPageChange={(page) => setCurrentPage(page)}
                />      </div>
        </div>
    );
}

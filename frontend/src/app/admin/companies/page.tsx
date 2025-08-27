"use client";
import { useEffect, useState } from "react";
import AdminSidebar from "@/componentssss/admin/sidebar";
import DataTable from "@/reusable/DataTable";
import { useRouter } from "next/navigation";
import { adminApiMethods } from "@/services/APImethods/adminAPImethods";
import Link from "next/link";
import { Check } from "lucide-react";


type User = {
  _id: string;
  name: string;
  email: string;
  isPremium?: boolean;
  isVerified?: boolean;
  employees?: any[];
};

export default function CompanyList() {
  const [users, setCompanies] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 5;
  const router = useRouter();


  const fetchCompanies = async () => {
    try {
      const res = await adminApiMethods.getCompanies({
        search: searchTerm,
        page: currentPage,
        limit: rowsPerPage,
      });


      if (Array.isArray(res.data?.companies)) {

        setCompanies(res.data.companies);
        setTotalPages(res.data.totalPages || 1);
      } else {
        console.error("Unexpected response format:", res.data);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [searchTerm, currentPage]);

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-700">
        <AdminSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 bg-white overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Companies</h1>
          <Link href="/admin/companies/unverified">
            <button
              type="button"
              className="bg-gray-900 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
            >
              + Verfication Request
            </button>
          </Link>
        </div>

        <DataTable<User>
          data={users}
          searchPlaceholder="Search by name"
          columns={[
            {
              key: "name",
              label: "Name",
              render: (u) => (
                <div className="flex items-center gap-2">
                  <span>{u.name}</span>
                  {u.isVerified && <Check className="text-green-500 w-5 h-5" />}
                </div>
              ),
            },
            { key: "email", label: "Email" },
            {
              key: "employees",
              label: "Employees",
              render: (u) => u.employees?.length ?? 0,
            },
            {
              key: "isPremium",
              label: "Subscription",
              render: (u) => (u.isPremium ? "Available" : "No Package"),
            },
            
          ]}
          onDetailClick={(company) => {
            router.push(`/admin/companies/${company._id}`);
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

'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/sidebar';
import DataTable from '@/reusable/DataTable';
import { useRouter } from 'next/navigation';
import { adminApiMethods } from '@/services/APImethods/adminAPImethods';
import Link from 'next/link';
import { Check, Menu, X } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        console.error('Unexpected response format:', res.data);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [searchTerm, currentPage]);

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden relative">
      {/* Mobile Hamburger */}
      <button
        className="absolute top-4 left-4 z-50 lg:hidden p-2 bg-gray-900 text-white rounded-md"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0">
        <AdminSidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-64 h-full bg-gray-900 text-white p-6 shadow-lg">
            <div className="flex justify-end mb-4">
              <button onClick={() => setSidebarOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <AdminSidebar />
          </div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Companies
          </h1>
          <Link href="/admin/companies/unverified">
            <button
              type="button"
              className="bg-gray-900 text-white px-4 sm:px-5 py-2 rounded-md text-sm sm:text-base font-medium hover:bg-gray-800 transition"
            >
              + Verification Request
            </button>
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
          <DataTable<User>
            data={users}
            searchPlaceholder="Search by name"
            columns={[
              {
                key: 'name',
                label: 'Name',
                render: (u) => (
                  <div className="flex items-center gap-2">
                    <span>{u.name}</span>
                    {u.isVerified && <Check className="text-green-500 w-5 h-5" />}
                  </div>
                ),
              },
              { key: 'email', label: 'Email', className: 'hidden sm:table-cell' },
              {
                key: 'employees',
                label: 'Employees',
                render: (u) => u.employees?.length ?? 0,
                className: 'hidden md:table-cell',
              },
              {
                key: 'isPremium',
                label: 'Subscription',
                render: (u) => (u.isPremium ? 'Available' : 'No Package'),
                className: 'hidden md:table-cell',
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
            className="w-full"
          />
        </div>
      </main>
    </div>
  );
}
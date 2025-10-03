'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/sidebar';
import DataTable from '@/reusable/DataTable';
import Link from 'next/link';
import { adminApiMethods } from '@/services/APImethods/adminAPImethods';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function TeachersList() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const rowsPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await adminApiMethods.getTeachers({
          search: searchTerm,
          page: currentPage,
          limit: rowsPerPage,
        });
        setTeachers(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error('Failed to fetch teachers:', err);
      }
    };
    fetchTeachers();
  }, [searchTerm, currentPage]);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email', className: 'hidden sm:table-cell' },
    {
      key: 'isBlocked',
      label: 'Status',
      render: (item: any) => (
        <span
          className={`px-2 py-1 rounded text-white text-sm font-medium ${
            item.isBlocked ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          {item.isBlocked ? 'Blocked' : 'Active'}
        </span>
      ),
    },
    {
      key: 'subscription',
      label: 'Courses',
      render: (item: any) => (item.subscription ? 'Available' : 'No courses'),
      className: 'hidden md:table-cell',
    },
  ];

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
            Teachers
          </h1>
          <Link href="/admin/teachers/requests">
            <button
              type="button"
              className="bg-gray-900 text-white px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-800 transition"
            >
              + Verification Requests
            </button>
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
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
            className="w-full"
          />
        </div>
      </main>
    </div>
  );
}
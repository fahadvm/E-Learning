'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/sidebar';
import DataTable from '@/reusable/DataTable';
import { adminApiMethods } from '@/services/APImethods/adminAPImethods';
import { Menu, X } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const rowsPerPage = 5;
  const router = useRouter();

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
        console.error('Unexpected response format:', res.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearchTerm, currentPage]);

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
      <div className="hidden lg:block w-64 h-screen sticky top-0">
        <AdminSidebar />
      </div>

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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Students
        </h1>

        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
          <DataTable<User>
            data={users}
            searchPlaceholder="Search by name"
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email', className: 'hidden sm:table-cell' },
              {
                key: 'NOcourses',
                label: 'Courses',
                render: (u) => u.NOcourses ?? 0,
                className: 'hidden md:table-cell',
              },
              {
                key: 'subscription',
                label: 'Subscription',
                render: (u) => (u.subscription ? 'Available' : 'No Package'),
                className: 'hidden md:table-cell',
              },
              {
                key: 'isBlocked',
                label: 'Status',
                render: (u) => (
                  <span
                    className={`px-2 py-1 rounded text-white text-sm font-medium ${
                      u.isBlocked ? 'bg-red-500' : 'bg-green-500'
                    }`}
                  >
                    {u.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                ),
              },
            ]}
            onDetailClick={(user) => router.push(`/admin/students/${user._id}`)}
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
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiMethods } from '@/services/APIservices/adminApiService';
import AdminSidebar from '@/components/admin/sidebar';
import { Menu, X } from 'lucide-react';

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [totalPages, setTotalPages] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500); // 500ms delay

    return () => clearTimeout(handler);
  }, [search]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await adminApiMethods.getCourses({ page, limit, search: debouncedSearch });
      setCourses(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, debouncedSearch]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

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
            Course Management
          </h1>
        </div>

        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2 w-full sm:w-1/2 md:w-1/3 transition-all duration-200 hover:ring-2 hover:ring-blue-500/50">
            <input
              type="text"
              placeholder="Search by course title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm sm:text-base focus:ring-0"
              aria-label="Search courses"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-gray-500 text-center py-8 sm:py-10 text-sm sm:text-base">
            Loading courses...
          </div>
        ) : courses.length === 0 ? (
          <div className="text-gray-500 text-center py-8 sm:py-10 text-sm sm:text-base">
            No courses found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {courses.map((course) => (
              <Link key={course._id} href={`/admin/courses/${course._id}`}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden group border border-gray-100 hover:scale-[1.02] duration-200 flex flex-col h-[450px] sm:h-[480px]">
                  {course.coverImage ? (
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm sm:text-base">
                      No Cover Image
                    </div>
                  )}

                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <div className="flex-1">
                      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition line-clamp-1">
                        {course.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2 sm:mb-3">
                        {course.description}
                      </p>
                      <div className="text-xs sm:text-sm text-gray-700 space-y-1 mb-2 sm:mb-3">
                        <p>
                          <strong>Publisher:</strong> {course.teacherId?.name || 'Unknown'}
                        </p>
                        <p>
                          <strong>Enrolled:</strong> {course.totalStudents || 0} students
                        </p>
                        <p>
                          <strong>Status:</strong>{' '}
                          <span
                            className={`${
                              course.status === 'published' ? 'text-green-600' : 'text-red-600'
                            } font-medium`}
                          >
                            {course.status}
                          </span>
                        </p>
                        <p>
                          <strong>Created:</strong> {formatDate(course.createdAt)}
                        </p>
                        <p>
                          <strong>Updated:</strong> {formatDate(course.updatedAt)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full">
                          Level: {course.level}
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full">
                          {course.category}
                        </span>
                      </div>
                    </div>
                    {course.price && (
                      <div className="mt-auto text-right font-bold text-blue-600 text-base sm:text-lg">
                        ₹{course.price}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center gap-2 sm:gap-4 mt-6 sm:mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 sm:px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-100 transition-all duration-200 text-sm sm:text-base"
            aria-label="Previous page"
          >
            Prev
          </button>
          <span className="px-3 sm:px-4 py-2 text-gray-700 font-medium text-sm sm:text-base">
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 sm:px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-100 transition-all duration-200 text-sm sm:text-base"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
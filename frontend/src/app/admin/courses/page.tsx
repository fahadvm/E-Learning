'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminApiMethods } from '@/services/APImethods/adminAPImethods'
import AdminSidebar from '@/componentssss/admin/sidebar'

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]), [loading, setLoading] = useState(true), [page, setPage] = useState(1), [limit] = useState(6), [search, setSearch] = useState(''), [totalPages, setTotalPages] = useState(1)

  const fetchCourses = async () => { try { setLoading(true); const res = await adminApiMethods.getCourses({ page, limit, search }); setCourses(res.data.data); setTotalPages(res.data.totalPages) } catch (err) { console.error('Failed to fetch courses', err) } finally { setLoading(false) } }

  useEffect(() => { fetchCourses() }, [page, search])

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 h-full bg-white border-r shadow-sm"><AdminSidebar /></div>
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-3"><h1 className="text-3xl md:text-4xl font-bold text-gray-800">Course Management</h1></div>
        <div className="mb-6"><input type="text" placeholder="Search by course title..." value={search} onChange={e => setSearch(e.target.value)} className="border border-gray-300 rounded-lg p-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>

        {loading ? <div className="text-gray-500 text-center py-10">Loading courses...</div> : courses.length === 0 ? <div className="text-gray-500 text-center py-10">No courses found.</div> :
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <Link key={course._id} href={`/admin/courses/${course._id}`}>
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden group border border-gray-100 hover:scale-[1.02] duration-200 flex flex-col h-[480px]">
                  {course.coverImage ? <img src={course.coverImage} alt={course.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">No Cover Image</div>}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-indigo-600 transition line-clamp-1">{course.title}</h2>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{course.description}</p>
                      <div className="text-sm text-gray-700 space-y-1 mb-3">
                        <p><strong>Publisher:</strong> {course.teacherId?.name || 'Unknown'}</p>
                        <p><strong>Enrolled:</strong> {course.totalStudents || 0} students</p>
                        <p><strong>Status:</strong> <span className={`${course.status === 'published' ? 'text-green-600' : 'text-red-600'} font-medium`}>{course.status}</span></p>
                        <p><strong>Created:</strong> {formatDate(course.createdAt)}</p>
                        <p><strong>Updated:</strong> {formatDate(course.updatedAt)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3"><span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Level: {course.level}</span><span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">{course.category}</span></div>
                    </div>
                    {course.price && <div className="mt-auto text-right font-bold text-indigo-600 text-lg">₹{course.price}</div>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        }

        <div className="flex justify-center gap-2 mt-8">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50">Prev</button>
          <span className="px-4 py-2 text-gray-700 font-medium">{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50">Next</button>
        </div>
      </main>
    </div>
  )
}

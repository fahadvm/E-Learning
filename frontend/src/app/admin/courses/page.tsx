'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import AdminSidebar from '@/componentssss/admin/sidebar'

interface ILesson {
  title: string
  content?: string
  videoUrl?: string
}

interface IModule {
  title: string
  description?: string
  lessons: ILesson[]
}

interface ICourse {
  _id: string
  title: string
  description: string
  level: string
  category: string
  price?: string
  coverImage?: string
  modules: IModule[]
  createdAt?: string
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<ICourse[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/admin/courses`,
        { withCredentials: true }
      )
      setCourses(res.data.data)
    } catch (err) {
      console.error('Failed to fetch courses', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-100 h-screen">
      {/* Sidebar - fixed width */}
      <div className="w-64 h-full">
        <AdminSidebar />
      </div>

      {/* Main content - scrollable */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">My Courses</h1>
          <Link href="/admin/courses/create">
            <button
              type="button"
              className="bg-gray-900 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
            >
              + Course Request
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="text-gray-500 text-center py-10">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-gray-500 text-center py-10">
            No courses found. Start by creating a new course.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link key={course._id} href={`/admin/courses/${course._id}`}>
                <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden group hover:scale-[1.02]">
                  {course.coverImage ? (
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                      No Cover Image
                    </div>
                  )}

                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-800 mb-1 group-hover:text-indigo-600 transition">
                      {course.title}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        Level: {course.level}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        {course.category}
                      </span>
                    </div>

                    {course.price && (
                      <div className="text-right font-semibold text-indigo-600 text-base">
                        ₹{course.price}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

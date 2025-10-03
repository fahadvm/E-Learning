'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import Header from "@/components/teacher/header";

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
        `${process.env.NEXT_PUBLIC_API_URL}/auth/teacher/myCourses`,
        {
          withCredentials: true,
        }
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
    <>
      <Header />

      <div className="bg-gray-100 min-h-screen p-6 md:p-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">My Courses</h1>
          <Link href="/teacher/courses/create">
            <button
              type="button"
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-medium shadow-lg transition duration-300 hover:scale-105"
            >
              + Add New Course
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
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link key={course._id} href={`/teacher/courses/${course._id}`}>
                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 overflow-hidden group transform hover:scale-105">
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

                  <div className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 group-hover:text-indigo-600 transition duration-300 mb-2">
                      {course.title}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
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
                      <div className="text-right font-semibold text-indigo-600 text-lg">
                        ₹{course.price}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

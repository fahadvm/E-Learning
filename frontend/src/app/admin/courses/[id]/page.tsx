'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'

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

export default function CourseDetailPage() {
  const { id } = useParams()
  const [course, setCourse] = useState<ICourse | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCourse = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/admin/course/${id}`,
        {
          withCredentials: true,
        }
      )
      setCourse(res.data.data)
    } catch (err) {
      console.error('Failed to fetch course', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchCourse()
  }, [id])

  if (loading) return <div className="p-8">Loading...</div>
  if (!course) return <div className="p-8 text-red-500">Course not found</div>

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.title}</h1>
        <div className="flex gap-4 text-sm text-gray-600">
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
            {course.level}
          </span>
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
            {course.category}
          </span>
          {course.price && (
            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
              ₹{course.price}
            </span>
          )}
        </div>
      </div>

      {course.coverImage && (
        <img
          src={course.coverImage}
          alt={course.title}
          className="rounded-xl shadow-md mb-6 w-full h-64 object-cover"
        />
      )}

      <p className="text-gray-700 mb-6">{course.description}</p>

      <div className="space-y-6">
        {course.modules.map((mod, i) => (
          <div key={i} className="border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-indigo-700 mb-1">
              Module {i + 1}: {mod.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{mod.description}</p>
            {mod.lessons.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-700">
                {mod.lessons.map((lesson, j) => (
                  <li key={j}>
                    <strong>{lesson.title}</strong>
                    {lesson.videoUrl && (
                      <span className="ml-2 text-blue-600">(Video Available)</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">No lessons in this module</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

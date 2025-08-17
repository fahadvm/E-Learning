'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Header from '@/componentssss/teacher/header'

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
  const [openModules, setOpenModules] = useState<boolean[]>([])

  const fetchCourse = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/teacher/course/${id}`,
        {
          withCredentials: true,
        }
      )
      setCourse(res.data.data)
      setOpenModules(new Array(res.data.data.modules.length).fill(false))
    } catch (err) {
      console.error('Failed to fetch course', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchCourse()
  }, [id])

  const toggleModule = (index: number) => {
    setOpenModules(prev => {
      const newOpenModules = [...prev]
      newOpenModules[index] = !newOpenModules[index]
      return newOpenModules
    })
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-xl font-semibold text-gray-600 animate-pulse">Loading...</div>
    </div>
  )
  if (!course) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-xl font-semibold text-red-500">Course not found</div>
    </div>
  )

  return (
    <>
          <Header />
    
    
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title.toUpperCase()}</h1>
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {course.level}
            </span>
            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              {course.category}
            </span>
            {course.price && (
              <span className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                ₹{course.price}
              </span>
            )}
          </div>

          {course.coverImage && (
            <img
              src={course.coverImage}
              alt={course.title}
              className="w-full h-80 object-cover rounded-xl shadow-md mb-6"
            />
          )}

          <p className="text-gray-600 leading-relaxed mb-8">{course.description}</p>
        </div>

        <div className="space-y-4">
          {course.modules.map((mod, i) => (
            <div key={i} className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleModule(i)}
                className="w-full flex justify-between items-center p-4 bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                <h3 className="text-lg font-semibold text-indigo-700">
                  Module {i + 1}: {mod.title}
                </h3>
                <svg
                  className={`w-5 h-5 text-indigo-700 transform transition-transform ${openModules[i] ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openModules[i] && (
                <div className="p-4 space-y-4 animate-slide-down">
                  {mod.description && (
                    <p className="text-sm text-gray-600">{mod.description}</p>
                  )}
                  {mod.lessons.length > 0 ? (
                    <div className="space-y-3">
                      {mod.lessons.map((lesson, j) => (
                        <div key={j} className="border-l-4 border-indigo-200 pl-4">
                          <div className="flex items-center justify-between">
                            <strong className="text-gray-800">{lesson.title}</strong>
                            {lesson.videoUrl && (
                              <span className="text-sm text-blue-600 font-medium">
                                (Video Available)
                              </span>
                            )}
                          </div>
                          {lesson.content && (
                            <p className="text-sm text-gray-600 mt-1">{lesson.content}</p>
                          )}
                          {lesson.videoUrl && (
                            <video
                              controls
                              className="mt-2 w-full max-w-lg rounded-md shadow-sm"
                            >
                              <source src={lesson.videoUrl} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No lessons in this module</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
  )
}
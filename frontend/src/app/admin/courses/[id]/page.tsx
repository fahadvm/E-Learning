'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/componentssss/ui/card'
import { adminApiMethods } from '@/services/APImethods/adminAPImethods'
import ConfirmationDialog from '@/reusable/ConfirmationDialog'


interface ILesson {
  title: string
  content?: string
  thumbnail?: string
  videoFile?: string
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
  isBlocked?: boolean
}

export default function CourseDetailPage() {
  const { id } = useParams()
  const [course, setCourse] = useState<ICourse | null>(null)
  const [loading, setLoading] = useState(true)
  const [openModules, setOpenModules] = useState<boolean[]>([])
  const [playingVideos, setPlayingVideos] = useState<{ [key: string]: boolean }>({})
  const fetchCourse = async () => {
    try {
      const res = await adminApiMethods.getCourseById(id as string)
      setCourse(res.data)
      setOpenModules(new Array(res.data.modules.length).fill(false))
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

  // Toggle play state for a specific video
  const togglePlay = (moduleIndex: number, lessonIndex: number) => {
    const videoKey = `${moduleIndex}_${lessonIndex}`
    setPlayingVideos(prev => ({
      ...prev,
      [videoKey]: !prev[videoKey]
    }))
  }

  const blockCourse = async () => {
    try {
      const res = await adminApiMethods.blockCourse(id as string)

      setCourse(res.data)

    } catch (err) {
      console.error('Failed to block course', err)
    }
  }

  const unblockCourse = async () => {
    try {
      const res = await adminApiMethods.unblockCourse(id as string)
      setCourse(res.data)
    } catch (err) {
      console.error('Failed to unblock course', err)
    }
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
                <span className="inline-flex items-center px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                  ₹{course.price}
                </span>
              )}
              {course.isBlocked && (
                <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  Blocked
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
            <div className="flex gap-4">
              <ConfirmationDialog
                title={course.isBlocked ? 'Unblock Course' : 'Block Course'}
                description={
                  course.isBlocked
                    ? 'Are you sure you want to unblock this course?'
                    : 'Are you sure you want to block this course?'
                }
                confirmText={course.isBlocked ? 'Unblock' : 'Block'}
                onConfirm={course.isBlocked ? unblockCourse : blockCourse}
                triggerButton={
                  <button
                    className={`px-4 py-2 rounded-md text-white ${course.isBlocked ? 'bg-green-500' : 'bg-red-500'
                      }`}
                  >
                    {course.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                }
              />

            </div>
          </div>

          <section>
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat">What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Build responsive websites with HTML, CSS, and JavaScript",
                    "Master React.js and modern frontend development",
                    "Create full-stack applications with Node.js and Express",
                    "Work with databases using MongoDB and SQL",
                    "Deploy applications to production environments",
                    "Implement user authentication and security best practices",
                    "Use Git and GitHub for version control",
                    "Build RESTful APIs and work with third-party APIs",
                  ].map((outcome, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-foreground">{outcome}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="space-y-4 mt-10">
            {course.modules.map((mod, i) => (
              <div key={i} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleModule(i)}
                  className="w-full flex justify-between items-center p-4 bg-cyan-50 hover:bg-cyan-100 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-cyan-700">
                    Module {i + 1}: {mod.title}
                  </h3>
                  <svg
                    className={`w-5 h-5 text-cyan-700 transform transition-transform ${openModules[i] ? 'rotate-180' : ''}`}
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
                        {mod.lessons.map((lesson, j) => {
                          const videoKey = `${i}_${j}` // Unique key for each video
                          const isVideoPlaying = playingVideos[videoKey] || false

                          return (
                            <div key={j} className="border-l-4 border-cyan-200 pl-4">
                              <div className="flex items-center justify-between">
                                <strong className="text-gray-800">{lesson.title}</strong>
                                {lesson.videoFile && (
                                  <span className="text-sm text-blue-600 font-medium">
                                    (Video Available)
                                  </span>
                                )}
                              </div>

                              {lesson.content && (
                                <p className="text-sm text-gray-600 mt-1">{lesson.content}</p>
                              )}

                              {lesson.videoFile && (
                                <div className="relative mt-2 w-full max-w-lg rounded-md shadow-sm cursor-pointer">
                                  {!isVideoPlaying ? (
                                    <>
                                      <img
                                        src={lesson.thumbnail || '/default-thumbnail.jpg'}
                                        alt={lesson.title}
                                        className="w-full rounded-md"
                                        onClick={() => togglePlay(i, j)}
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <button
                                          className="bg-white bg-opacity-75 p-2 rounded-full"
                                          onClick={() => togglePlay(i, j)}
                                        >
                                          ▶
                                        </button>
                                      </div>
                                    </>
                                  ) : (
                                    <video controls autoPlay className="w-full rounded-md">
                                      <source src={lesson.videoFile} type="video/mp4" />
                                      Your browser does not support the video tag.
                                    </video>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
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

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/company/Header'
import { companyApiMethods } from '@/services/APIservices/companyApiService'

interface ILesson {
  title: string
  content?: string
  videoUrl?: string
  duration?: number
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
  language?: string
  modules: IModule[]
  createdAt?: string
}

const ITEMS_PER_PAGE = 8

export default function CoursesPage() {
  const [courses, setCourses] = useState<ICourse[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const [languageFilter, setLanguageFilter] = useState('')
  const [sortField, setSortField] = useState<'createdAt' | 'price'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const res = await companyApiMethods.getAllCourses({
        search,
        category: categoryFilter,
        level: levelFilter,
        language: languageFilter,
        sort: sortField,
        order: sortOrder,
        page,
        limit: ITEMS_PER_PAGE,
      })
      setCourses(res.data.data)
      setTotalPages(res.data.totalPages)
    } catch (err) {
      console.error('Failed to fetch courses', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [search, categoryFilter, levelFilter, languageFilter, sortField, sortOrder, page])

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">

      {/* Background Glows */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-primary/10 to-slate-900" />
      <div className="fixed inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />

        {/* Hero Banner */}
        <section className="relative py-32 px-6 text-center mb-20">
          <h1 className="text-6xl font-bold tracking-tight mb-4">
            Explore Our{" "}
            <span className="bg-gradient-to-r from-white to-primary text-transparent bg-clip-text">
              Premium Courses
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Learn new skills, enhance your career, and grow your team with enterprise-grade content.
          </p>

          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/60 pointer-events-none" />
        </section>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">

            {/* Search */}
            <input
              type="text"
              placeholder="Search for a course..."
              value={search}
              onChange={(e) => {
                setPage(1)
                setSearch(e.target.value)
              }}
              className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {/* Filter Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <select
                value={categoryFilter}
                onChange={(e) => {
                  setPage(1)
                  setCategoryFilter(e.target.value)
                }}
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-primary"
              >
                <option value="">All Categories</option>
                <option value="Development">Development</option>
                <option value="Database">Database</option>
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Tools">Tools</option>
              </select>

              <select
                value={levelFilter}
                onChange={(e) => {
                  setPage(1)
                  setLevelFilter(e.target.value)
                }}
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-primary"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              <select
                value={languageFilter}
                onChange={(e) => {
                  setPage(1)
                  setLanguageFilter(e.target.value)
                }}
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-primary"
              >
                <option value="">All Languages</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Malayalam">Malayalam</option>
              </select>

              <select
                value={`${sortField}-${sortOrder}`}
                onChange={(e) => {
                  setPage(1)
                  const [field, order] = e.target.value.split('-') as any
                  setSortField(field)
                  setSortOrder(order)
                }}
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-primary"
              >
                <option value="createdAt-desc">Newest</option>
                <option value="createdAt-asc">Oldest</option>
                <option value="price-asc">₹ Low → High</option>
                <option value="price-desc">₹ High → Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses */}
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No courses found.</div>
          ) : (
            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {courses.map(course => (
                <div
                  key={course._id}
                  className="group rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl hover:border-primary/40 hover:shadow-primary/20 transition-all overflow-hidden"
                >
                  <Link href={`/company/courses/${course._id}`}>
                    <div className="overflow-hidden h-52">
                      {course.coverImage ? (
                        <img
                          src={course.coverImage}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/10 flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-5">
                    <h2 className="text-xl font-semibold mb-2 line-clamp-2">{course.title}</h2>
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {course.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <span className="px-3 py-1 rounded-full bg-primary/20 text-primary">{course.level}</span>
                      <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300">{course.category}</span>
                      {course.language && (
                        <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-200">
                          {course.language}
                        </span>
                      )}
                      {course.price && (
                        <span className="ml-auto font-semibold text-primary text-sm">
                          ₹{course.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                disabled={page === 1}
                onClick={() => setPage(prev => prev - 1)}
                className="px-5 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 disabled:opacity-40 transition"
              >
                Previous
              </button>

              <span className="text-gray-300">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(prev => prev + 1)}
                className="px-5 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 disabled:opacity-40 transition"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div className="h-20" />
      </div>
    </div>
  )
}

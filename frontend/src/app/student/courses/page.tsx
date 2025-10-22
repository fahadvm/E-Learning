'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from "@/components/student/header";
import { studentCourseApi } from '@/services/APIservices/studentApiservice';
import { useDebounce } from '@/hooks/useDebounce'

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
  const debouncedSearch = useDebounce(search, 500)

  const clearFilters = () => {
    setSearch('')
    setCategoryFilter('')
    setLevelFilter('')
    setLanguageFilter('')
    setSortField('createdAt')
    setSortOrder('desc')
    setPage(1)
  }
  const fetchCourses = async () => {
    try {
      setLoading(true)
      const res = await studentCourseApi.getAllCourses({
        search: debouncedSearch,
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
  }, [debouncedSearch, categoryFilter, levelFilter, languageFilter, sortField, sortOrder, page])


  return (
    <>
      <Header />

      {/* Hero Banner */}
      <section
        className="relative bg-indigo-900 text-white py-30 px-6 mb-10 overflow-hidden"
        style={{
          backgroundImage: "url('/gallery/video-bg.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gray-900/90"></div>
        <div className="relative max-w-6xl mx-auto flex flex-col items-start gap-6 ">
          <h1 className="text-6xl font-bold mb-4">Explore Our Courses</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Learn new skills, enhance your career, and unlock opportunities with our top-rated courses.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {/* Search */}
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => {
              setPage(1) // reset page on filter change
              setSearch(e.target.value)
            }}
            className="flex-1 px-5 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setPage(1)
              setCategoryFilter(e.target.value)
            }}
            className="px-5 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {/* categories now should come from backend */}
            <option value="Development">Web Development</option>
            <option value="Database">Database</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Tools">Tools</option>
          </select>

          {/* Level */}
          <select
            value={levelFilter}
            onChange={(e) => {
              setPage(1)
              setLevelFilter(e.target.value)
            }}
            className="px-5 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* Language */}
          <select
            value={languageFilter}
            onChange={(e) => {
              setPage(1)
              setLanguageFilter(e.target.value)
            }}
            className="px-5 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Languages</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Malayalam">Malayalam</option>
          </select>

          {/* Sort */}
          <select
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              setPage(1)
              const [field, order] = e.target.value.split('-') as ['createdAt' | 'price', 'asc' | 'desc']
              setSortField(field)
              setSortOrder(order)
            }}
            className="px-5 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          <button
            onClick={clearFilters}
            className="px-5 py-3 bg-red-100 text-red-700 border border-red-300 rounded-full shadow-sm hover:bg-red-200 transition"
          >
            Clear Filters
          </button>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No courses found. Try changing your filters.</div>
        ) : (
          <section className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {courses.map(course => (
              <div key={course._id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden group">
                <Link href={`/student/courses/${course._id}`}>
                  {course.coverImage ? (
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-52 bg-gray-200 flex items-center justify-center text-gray-400 font-medium">
                      No Cover Image
                    </div>
                  )}
                </Link>
                <div className="p-5 flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{course.title}</h2>
                  <p className="text-gray-600 text-sm line-clamp-3">{course.description}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">{course.level}</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">{course.category}</span>
                    {course.language && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">{course.language}</span>}
                    {course.price && <span className="ml-auto font-semibold text-indigo-600">₹{course.price}</span>}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage(prev => prev - 1)}
              className="px-5 py-2 bg-white border border-gray-300 rounded-full shadow-sm disabled:opacity-50 hover:bg-gray-100 transition"
            >
              Previous
            </button>

            <span className="text-gray-700 font-medium">Page {page} of {totalPages}</span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(prev => prev + 1)}
              className="px-5 py-2 bg-white border border-gray-300 rounded-full shadow-sm disabled:opacity-50 hover:bg-gray-100 transition"
            >
              Next
            </button>
          </div>
        )}

      </main>
    </>
  )
}

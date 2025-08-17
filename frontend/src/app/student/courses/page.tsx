'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import Header from "@/componentssss/student/header";
import { useSearchParams, useRouter } from 'next/navigation'

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

const ITEMS_PER_PAGE = 9

export default function CoursesPage() {
  const [courses, setCourses] = useState<ICourse[]>([])
  const [filteredCourses, setFilteredCourses] = useState<ICourse[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/student/Courses`,
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

  useEffect(() => {
    let result = [...courses]

    // Search
    if (search.trim()) {
      result = result.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filter by Category
    if (categoryFilter) {
      result = result.filter((c) => c.category === categoryFilter)
    }

    // Sort by Date
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt || '').getTime()
      const dateB = new Date(b.createdAt || '').getTime()
      return sort === 'asc' ? dateA - dateB : dateB - dateA
    })

    setFilteredCourses(result)
    setPage(1) // Reset to first page on change
  }, [search, categoryFilter, sort, courses])

  const paginatedCourses = filteredCourses.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE)

  const categories = [...new Set(courses.map((c) => c.category))]

  return (
    <>
      <Header />
      <main className="bg-gray-100 min-h-screen p-6 md:p-10">
        
        <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
             Courses ({filteredCourses.length})
          </h1>
          
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Categories</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-gray-500 text-center py-10">Loading courses...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-gray-500 text-center py-10">
            No courses found. Try changing your filters or create a new course.
          </div>
        ) : (
          <section className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden group"
              >
                <Link href={`/student/courses/${course._id}`}>
                  {course.coverImage ? (
                    <img
                      src={course.coverImage}
                      alt={`${course.title} Cover`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                      No Cover Image
                    </div>
                  )}
                </Link>

                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-1 text-gray-800">
                    {course.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex gap-2 mt-2 text-xs flex-wrap">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Level: {course.level}
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                      {course.category}
                    </span>
                    {course.price && (
                      <span className="ml-auto font-bold text-indigo-600">
                        ₹{course.price}
                      </span>
                    )}
                  </div>
                  
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-3 py-1 bg-white border border-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-3 py-1 bg-white border border-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </>
  )
}

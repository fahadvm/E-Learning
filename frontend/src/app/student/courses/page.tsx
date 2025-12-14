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
  reviewCount: number
  averageRating: number
  modules: IModule[]
  createdAt?: string
}

const ITEMS_PER_PAGE = 12

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
        <div className="flex gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide pb-2 mb-6">

          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setPage(1)
              setSearch(e.target.value)
            }}
            className="min-w-[220px] px-4 py-3 border rounded-full"
          />

          <select className="min-w-[160px] px-4 py-3 border rounded-full">
            <option>Category</option>
          </select>

          <select className="min-w-[160px] px-4 py-3 border rounded-full">
            <option>Level</option>
          </select>

          <select className="min-w-[160px] px-4 py-3 border rounded-full">
            <option>Language</option>
          </select>

          <select className="min-w-[180px] px-4 py-3 border rounded-full">
            <option>Sort</option>
          </select>

          <button
            onClick={clearFilters}
            className="min-w-[140px] px-4 py-3 bg-red-100 text-red-700 border rounded-full"
          >
            Clear
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
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden group"
              >
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
                  {/* Title */}
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                    {course.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {course.description}
                  </p>


                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                      {course.level}
                    </span>

                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {course.category}
                    </span>

                    {course.language && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        {course.language}
                      </span>
                    )}
                    {/* ⭐ Rating Section */}
                    <div className="mt-3 flex items-center gap-1 text-sm">
                      <span className="font-medium flex items-center gap-1 text-yellow-500">
                        {/* Rating number */}
                        {course.averageRating?.toFixed(1) ?? "0.0"}

                        {/* Star icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 fill-yellow-500"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.197-1.539-1.118l1.287-3.967a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                      </span>

                      {/* Review count */}
                      <span className="text-gray-500">
                        ({course.reviewCount ?? 0} reviews)
                      </span>
                    </div>

                    {course.price && (
                      <span className="ml-auto font-semibold text-indigo-600">
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

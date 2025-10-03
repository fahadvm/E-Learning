'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/teacher/header'
import { useTeacher } from '@/context/teacherContext'
import { teacherCourseApi } from '@/services/APImethods/teacherAPImethods'

import {
  BookOpen,
  MoreHorizontal,
  Users,
  IndianRupee,
  Clock,
  BarChart3,
  Star,
  Edit,
  Eye
} from 'lucide-react'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// === Interfaces ===
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
  lastUpdated?: string
  status?: 'draft' | 'published' | 'archived'
  enrolledStudents?: number
  totalRevenue?: number
  totalDuration?: number
  completionRate?: number
  rating?: number
  reviewCount?: number
  tags?: string[]
  totalLessons?: number
}

// === Helpers ===
const getStatusColor = (status?: string) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-700'
    case 'draft':
      return 'bg-yellow-100 text-yellow-700'
    case 'archived':
      return 'bg-gray-200 text-gray-600'
    default:
      return 'bg-gray-100 text-gray-500'
  }
}

const getStatusIcon = (status?: string) => {
  switch (status) {
    case 'published':
      return <BookOpen className="h-3 w-3 mr-1" />
    case 'draft':
      return <Clock className="h-3 w-3 mr-1" />
    case 'archived':
      return <BarChart3 className="h-3 w-3 mr-1" />
    default:
      return null
  }
}

const formatDate = (date?: string) =>
  date ? new Date(date).toLocaleDateString() : 'N/A'

const formatCurrency = (amount?: number) =>
  typeof amount === 'number'
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(amount)
    : '₹0'

// === Constants ===
const ITEMS_PER_PAGE = 6

// === Page Component ===
export default function MyCoursesPage() {
  const [courses, setCourses] = useState<ICourse[]>([])
  const [filteredCourses, setFilteredCourses] = useState<ICourse[]>([])
  const [loading, setLoading] = useState(true)
  const { teacher } = useTeacher()

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)

  const fetchCourses = async () => {
    try {
      const res = await teacherCourseApi.getMyCourses()
      setCourses(res.data)
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

  if (!teacher) {
    return (
      <div className="text-center mt-10 text-gray-500">Loading profile...</div>
    )
  }

  return (
    <>
      <Header />
      <main className="bg-gray-100 min-h-screen p-6 md:p-10">
        {/* Top Bar */}
        <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            My Courses ({filteredCourses.length})
          </h1>

          {teacher.isVerified ? (
            <Link href="/teacher/courses/create">
              <button className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-lg hover:scale-105 transition">
                + Add New Course
              </button>
            </Link>
          ) : (
            ''
          )}
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
          <div className="text-gray-500 text-center py-10">
            Loading courses...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-gray-500 text-center py-10">
            No courses found. Try changing your filters or create a new course.
          </div>
        ) : (
          <section className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedCourses.map((course) => (
              <Card
                key={course._id}
                className="hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <div className="w-full h-48 bg-white rounded-t-lg flex items-center justify-center">
                    {course.coverImage ? (
                      <img
                        src={course.coverImage}
                        alt={course.title}
                        className="h-full w-full object-cover rounded-t-lg"
                      />
                    ) : (
                      <BookOpen className="h-16 w-16 text-primary opacity-50" />
                    )}
                  </div>

                  {/* Status */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium flex items-center ${getStatusColor(
                        course.status
                      )}`}
                    >
                      {getStatusIcon(course.status)}
                      <span className="ml-1 capitalize">
                        {course.status || 'draft'}
                      </span>
                    </span>
                  </div>

                  {/* Menu */}
                  <div className="absolute top-2 right-2">
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{course.enrolledStudents || 0} students</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <IndianRupee className="h-4 w-4 text-muted-foreground" />
                      <span>{course.price}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{course.totalDuration || 0}h content</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span>{course.completionRate || 0}% completion</span>
                    </div>
                  </div>

                  {/* Rating */}
                  {course.rating && course.rating > 0 && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium">{course.rating}</span>
                      </div>
                      <span className="text-muted-foreground">
                        ({course.reviewCount || 0} reviews)
                      </span>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {course.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Course Details */}
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Created: {formatDate(course.createdAt)}</div>
                    <div>Updated: {formatDate(course.lastUpdated)}</div>
                    <div>
                      {course.totalLessons || course.modules.length} lessons •{' '}
                      {course.level}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-4 border-t">
                   
                    <Button variant="outline" size="sm" className="flex-1">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Analytics
                    </Button>
                    {course.status === 'published' && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/teacher/courses/${course._id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
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

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/teacher/header'
import { useTeacher } from '@/context/teacherContext'
import { teacherCourseApi } from '@/services/APIservices/teacherApiService'
import ReviewListModal from '@/components/student/course/ReviewList'
import { showErrorToast } from '@/utils/Toast'

import {
  BookOpen,
  MoreHorizontal,
  Users,
  IndianRupee,
  Clock,
  BarChart3,
  Star,
  Edit,
  Eye,
  Search,
  Info,
  Upload
} from 'lucide-react'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatMinutesToHours } from '@/utils/timeConverter'

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
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)

  // Review Modal State
  const [reviewsModalOpen, setReviewsModalOpen] = useState(false)
  const [reviewList, setReviewList] = useState<any[]>([])
  const [reviewLoading, setReviewLoading] = useState(false)

  const handleViewReviews = async (courseId: string) => {
    try {
      setReviewLoading(true)
      const res = await teacherCourseApi.getCourseReviews(courseId)
      if (res.ok) {
        setReviewList(res.data)
        setReviewsModalOpen(true)
      } else {
        showErrorToast('Failed to load reviews')
      }
    } catch (err) {
      console.error(err)
      showErrorToast('Something went wrong')
    } finally {
      setReviewLoading(false)
    }
  }

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
      <main className="container mx-auto bg-[#fafafa] min-h-screen p-6 md:p-10 pt-10">
        {/* Top Bar */}
        <div className="flex justify-between items-center flex-wrap gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-black tracking-tight mb-2">
              My Courses
            </h1>
            <p className="text-zinc-500 font-medium">Manage and monitor your educational content</p>
          </div>

          <button
            onClick={() => {
              if (teacher.verificationStatus === "verified") {
                window.location.href = "/teacher/courses/create";
              } else {
                setShowModal(true);
              }
            }}
            className="bg-black text-white px-8 py-3 rounded-xl text-sm font-bold shadow-xl hover:bg-zinc-800 transition-all transform hover:-translate-y-1 active:translate-y-0"
          >
            + Create New Course
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 font-bold text-sm"
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
            className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 font-bold text-sm"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-zinc-500 text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-300">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-bold text-xl text-black">No courses found</p>
            <p className="font-medium">Try changing your filters or create a new course.</p>
          </div>
        ) : (
          <section className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedCourses.map((course) => (
              <Card
                key={course._id}
                className="group border-0 shadow-sm ring-1 ring-zinc-200 hover:ring-black transition-all duration-300 rounded-3xl overflow-hidden bg-white"
              >
                <div className="relative aspect-video overflow-hidden">
                  {course.coverImage ? (
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-zinc-300" />
                    </div>
                  )}

                  {/* Status Overlay */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest flex items-center shadow-sm ${course.status === 'published' ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-900'
                        }`}
                    >
                      {course.status || 'draft'}
                    </span>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <Badge variant="outline" className="text-[10px] font-bold border-zinc-200 rounded-lg uppercase tracking-tight">
                      {course.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-black text-black group-hover:text-zinc-800 transition-colors line-clamp-1">
                    {course.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-zinc-50 rounded-lg">
                        <Users className="h-3.5 w-3.5 text-zinc-600" />
                      </div>
                      <span className="text-xs font-bold text-black">{course.enrolledStudents || 0} Students</span>
                    </div>
                    <div
                      className="flex items-center gap-2 cursor-pointer group"
                      onClick={() => handleViewReviews(course._id)}
                    >
                      <div className="p-1.5 bg-zinc-50 rounded-lg  ">
                        <Star className="h-3.5 w-3.5 text-zinc-600 " />
                      </div>

                      <span
                        className={`text-xs font-bold ${reviewLoading ? 'text-zinc-400 cursor-not-allowed' : 'text-black'
                          }`}
                      >
                        {course.rating
                          ? `${Number(course.rating).toFixed(1)} (${course.reviewCount || 0})`
                          : 'No rating'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-zinc-50 rounded-lg">
                        <Clock className="h-3.5 w-3.5 text-zinc-600" />
                      </div>
                      <span className="text-xs font-bold text-black">{formatMinutesToHours(course.totalDuration || 0)}h Content</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-zinc-50 rounded-lg">
                        <BarChart3 className="h-3.5 w-3.5 text-zinc-600" />
                      </div>
                      <span className="text-xs font-bold text-black">{course.completionRate || 0}% Done</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-4 border-t border-zinc-100">
                    <Button asChild className="flex-1 bg-black text-white hover:bg-zinc-800 rounded-xl font-bold text-xs h-10 shadow-sm">
                      <Link href={`/teacher/courses/${course._id}/analytics`}>
                        <BarChart3 className="w-3.5 h-3.5 mr-2" />
                        Analytics
                      </Link>
                    </Button>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="icon" className="h-10 w-10 text-zinc-900 border-zinc-200 hover:bg-black rounded-xl">
                        <Link href={`/teacher/courses/${course._id}/resources`}>
                          <Upload className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="icon" className="h-10 w-10 text-zinc-900 border-zinc-200 hover:bg-black rounded-xl">
                        <Link href={`/teacher/courses/${course._id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="icon" className="h-10 w-10 text-zinc-900 border-zinc-200 hover:bg-black rounded-xl">
                        <Link href={`/teacher/courses/${course._id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                     
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section >
        )
        }

        {/* Pagination */}
        {
          totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="rounded-xl border-zinc-200 font-bold"
              >
                Previous
              </Button>

              <div className="flex items-center gap-1 mx-4">
                <span className="text-sm font-black">Page {page}</span>
                <span className="text-sm text-zinc-400 font-bold">of {totalPages}</span>
              </div>

              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="rounded-xl border-zinc-200 font-bold"
              >
                Next
              </Button>
            </div>
          )
        }

        {
          showModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
              <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md text-center border border-zinc-100 animate-in fade-in zoom-in duration-200">
                <div className="w-20 h-20 bg-zinc-50 text-black rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Info className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-black mb-4 tracking-tight">
                  Verification Required
                </h2>
                <p className="text-zinc-500 font-medium mb-8 leading-relaxed">
                  Your teacher profile is currently under review or not yet verified. To create and publish courses, please complete your identification.
                </p>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => (window.location.href = "/teacher/profile")}
                    className="w-full bg-black text-white hover:bg-zinc-800 h-14 rounded-2xl font-bold text-lg shadow-xl"
                  >
                    Complete Profile
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowModal(false)}
                    className="w-full text-zinc-500 hover:text-black font-bold h-12 rounded-2xl"
                  >
                    Maybe Later
                  </Button>
                </div>
              </div>
            </div>
          )
        }

        <ReviewListModal
          open={reviewsModalOpen}
          onClose={() => setReviewsModalOpen(false)}
          reviews={reviewList}
        />
      </main >
    </>
  )
}

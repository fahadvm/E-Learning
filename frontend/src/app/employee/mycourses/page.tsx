'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Play,
  Clock,
  Users,
  Star,
  Download,
  BookOpen,
  ArrowLeft,
  TrendingUp,
  Award,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useEmployee } from "@/context/employeeContext"
import { employeeApiMethods } from "@/services/APIservices/employeeApiService"

// ---------------------- Interfaces ----------------------

interface Review {
  rating: number
}

interface Course {
  _id: string
  title: string
  category: string
  coverImage?: string
  totalDuration: number
  teacherId?: string
  totalStudents?: number
  reviews?: Review[]
  createdAt?: string
  progress?: number
}

interface ApiResponse {
  ok: boolean
  message: string
  data:{
    coursesAssigned:Course[]
    coursesProgress:CourseProgress[]
  } 
}

interface CourseProgress {
  courseId: string
  percentage: number
}

export default function EmployeeMyCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const res: ApiResponse = await employeeApiMethods.getMyCourses() 
      console.log("courses are : ", res)

      if (!res.ok) throw new Error(res.message)

      const mergedCourses = res.data.coursesAssigned.map((course) => {
        const progressData = res.data.coursesProgress?.find(
          (p) => p.courseId === course._id
        )
        console.log("progress",progressData)
        return {
          ...course,
          progress: progressData ? progressData.percentage : 0,
        }
      })

      setCourses(mergedCourses)
    } catch (error) {
      console.error("Failed to fetch courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateAverageRating = (reviews?: Review[]) => {
    if (!reviews || reviews.length === 0) return "No rating"
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    return avg.toFixed(1)
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-white"
    if (progress >= 50) return "bg-white"
    return "bg-muted-foreground"
  }

  const getProgressStatus = (progress: number) => {
    if (progress >= 100) return "Completed"
    if (progress >= 80) return "Almost Complete"
    if (progress >= 50) return "In Progress"
    if (progress > 0) return "Started"
    return "Not Started"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/employee/home">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <Badge variant="secondary" className="text-sm font-medium">
              {courses.length} Active Courses
            </Badge>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              My Learning Path
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your company-assigned and personal courses
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Progress</p>
                    <p className="text-2xl font-bold text-foreground">
                      {courses.length > 0
                        ? Math.round(
                            courses.reduce((acc, c) => acc + (c.progress || 0), 0) /
                              courses.length
                          )
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <Clock className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Hours</p>
                    <p className="text-2xl font-bold text-foreground">
                      {Math.round(
                        courses.reduce((acc, c) => acc + c.totalDuration, 0) / 60
                      )}
                      h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-foreground">
                      {courses.filter((c) => (c.progress || 0) >= 100).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Course List Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your courses...</p>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <BookOpen className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                No Assigned Courses Yet
              </h3>
              <p className="text-muted-foreground mb-8">
                Once your company assigns courses, they’ll appear here.
              </p>
              <Link href="/employee/courses">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card
                key={course._id}
                className="group overflow-hidden border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={course.coverImage || "/placeholder.svg?height=200&width=400&query=course"}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4">
                    <Badge className="bg-card/90 text-card-foreground hover:bg-card border-border">
                      {course.category}
                    </Badge>
                  </div>

                  <div className="absolute top-4 right-4">
                    <Link href={`/employee/mycourses/${course._id}`} passHref>
                      <Button asChild size="sm" className="bg-primary hover:bg-primary/90 shadow-lg">
                        <span className="flex items-center">
                          <Play className="w-4 h-4 mr-1" />
                          Continue
                        </span>
                      </Button>
                    </Link>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between text-white text-sm mb-2">
                      <span className="font-medium">
                        {getProgressStatus(course.progress || 0)}
                      </span>
                      <span>{course.progress || 0}%</span>
                    </div>
                    <Progress
                      value={course.progress || 0}
                      className={`h-2 ${getProgressColor(course.progress || 0)}`}
                    />
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {Math.round(course.totalDuration / 60)}h {course.totalDuration % 60}m
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {course.totalStudents?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {calculateAverageRating(course.reviews)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        Started{" "}
                        {course.createdAt
                          ? new Date(course.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="hover:bg-muted bg-transparent">
                        <Download className="w-4 h-4 mr-1" />
                        Resources
                      </Button>
                      <Button variant="outline" size="sm" className="hover:bg-muted bg-transparent">
                        <Award className="w-4 h-4 mr-1" />
                        Certificate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

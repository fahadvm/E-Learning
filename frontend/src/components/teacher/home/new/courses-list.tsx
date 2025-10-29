"use client"

import { Plus, Users, TrendingUp } from "lucide-react"
import Image from "next/image"

const courses = [
  {
    id: 1,
    title: "React Advanced Patterns",
    thumbnail: "/react-course.jpg",
    students: 156,
    progress: 85,
    status: "Active",
  },
  {
    id: 2,
    title: "Next.js Full Stack Development",
    thumbnail: "/nextjs-course.jpg",
    students: 203,
    progress: 72,
    status: "Active",
  },
  {
    id: 3,
    title: "TypeScript Mastery",
    thumbnail: "/typescript-course.jpg",
    students: 89,
    progress: 60,
    status: "Draft",
  },
]

export default function CoursesList() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-foreground">Your Courses</h3>
        <button className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-lg hover:shadow-md transition-shadow font-medium">
          <Plus size={20} />
          Add New Course
        </button>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex gap-4 p-4 border border-border rounded-lg hover:bg-secondary transition-colors cursor-pointer"
          >
            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={course.thumbnail || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-foreground">{course.title}</h4>
                  <span
                    className={`text-xs font-medium mt-1 inline-block px-2 py-1 rounded ${
                      course.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {course.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp size={16} />
                  <span>{course.progress}% complete</span>
                </div>
              </div>

              <div className="mt-3 w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

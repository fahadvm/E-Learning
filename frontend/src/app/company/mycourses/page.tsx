"use client";

import { useState, useEffect } from "react";
import { CourseCard } from "@/components/company/mycourses/CourseCard";
import CourseStats from "@/components/company/mycourses/CourseStats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, BookOpen, TrendingUp } from "lucide-react";
import axios from "axios";
import { companyApiMethods } from "@/services/APIservices/companyApiService";

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
interface Order {
  _id: string
  studentId: string
  courses: Course[]
  razorpayOrderId: string
  amount: number
}

interface ApiResponse {
  ok: boolean
  message: string
  data: Order[]
}


const MyCoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch courses dynamically
  useEffect(() => {
    const fetchCourses  = async () => {
      try {
        const res : ApiResponse = await companyApiMethods.getmycourses()
        console.log("the responce getmycourses is", res)
        const allCourses = res.data.flatMap((order) => order.courses)
        setCourses(allCourses)
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // 🔹 Compute stats dynamically
  const stats = {
    totalCourses: courses.length,
    completedCourses: courses.filter((c) => c.status === "completed").length,
    inProgressCourses: courses.filter((c) => c.status === "in-progress").length,
    totalHoursLearned: courses.reduce(
      (acc, c) => acc + (c.completedLessons || 0) * 0.5, // example: 0.5h/lesson
      0
    ),
    certificatesEarned: courses.filter((c) => c.certificate).length,
  };

  // 🔹 Apply search + filter
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || course.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            My Courses
          </h1>
          <p className="text-xl text-muted-foreground">
            Continue your learning journey and track your progress
          </p>
        </div>

        {/* Stats Section */}
        <CourseStats stats={stats} />

        {/* Search + Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search courses, instructors, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 backdrop-blur-sm border-primary/20"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px] bg-background/50 backdrop-blur-sm border-primary/20">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="default">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-16">Loading courses...</div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No courses found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;

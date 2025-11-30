// app/student/chat/new/page.tsx
'use client';

import { Search, MessageCircle, User, BookOpen, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";

interface Teacher {
  _id: string;
  name: string;
  profilePicture?: string;
  about?: string;
}

interface PurchasedCourse {
  _id: string;
  title: string;
  coverImage?: string;
  teacher: Teacher;
  purchasedAt: string;
  progress?: number;
}

// Realistic mock data
const mockPurchasedCourses: PurchasedCourse[] = [
  {
    _id: "c1",
    title: "Advanced React & Next.js Mastery",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    teacher: {
      _id: "t001",
      name: "Dr. Sarah Chen",
      profilePicture: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      about: "Full-stack JavaScript expert | React, Node.js & TypeScript instructor",
    },
    purchasedAt: "2025-10-15",
    progress: 78,
  },
  {
    _id: "c2",
    title: "Complete Node.js Backend Bootcamp",
    coverImage: "https://images.unsplash.com/photo-1623282073460-8062f8c2d6ef?w=800&h=400&fit=crop",
    teacher: {
      _id: "t001",
      name: "Dr. Sarah Chen",
      profilePicture: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      about: "Full-stack JavaScript expert | React, Node.js & TypeScript instructor",
    },
    purchasedAt: "2025-09-20",
    progress: 100,
  },
  {
    _id: "c3",
    title: "MERN Stack From Zero to Hero",
    coverImage: "https://images.unsplash.com/photo-1517180107641-cdf0c0f1588a?w=800&h=400&fit=crop",
    teacher: {
      _id: "t002",
      name: "Rahul Sharma",
      profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      about: "MERN Stack Specialist | 20k+ students placed",
    },
    purchasedAt: "2025-08-10",
    progress: 45,
  },
  {
    _id: "c4",
    title: "UI/UX Design with Figma 2025",
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
    teacher: {
      _id: "t003",
      name: "Emily Rodriguez",
      profilePicture: "https://images.unsplash.com/photo-1580489940927-4777c8dcef1e?w=400&h=400&fit=crop",
      about: "Ex-Figma designer at Airbnb | Design systems expert",
    },
    purchasedAt: "2025-11-01",
    progress: 30,
  },
  {
    _id: "c5",
    title: "Python for Data Science & ML",
    coverImage: "https://images.unsplash.com/photo-1526379094699-b98f2c15a5b2?w=800&h=400&fit=crop",
    teacher: {
      _id: "t004",
      name: "Alex Kumar",
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      about: "Microsoft AI Engineer | Python & ML mentor",
    },
    purchasedAt: "2025-07-22",
    progress: 92,
  },
];


const truncate = (text: string | undefined | null, maxLength: number): string => {
  const str = text?.trim() || "No bio available";
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "…";
};

// Derive unique teachers with course count
const uniqueTeachers = Array.from(
  new Map(
    mockPurchasedCourses.map((c) => [
      c.teacher._id,
      {
        ...c.teacher,
        courseCount: mockPurchasedCourses.filter((cc) => cc.teacher._id === c.teacher._id).length,
      },
    ])
  ).values()
);

type TabType = "instructors" | "courses";

export default function StartNewChatPage() {
  const [activeTab, setActiveTab] = useState<TabType>("instructors");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeachers = useMemo(() => {
    if (!searchQuery.trim()) return uniqueTeachers;
    return uniqueTeachers.filter((t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return mockPurchasedCourses;
    return mockPurchasedCourses.filter(
      (c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const truncate = (str: string, n: number) =>
    str.length > n ? str.slice(0, n) + "..." : str;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Start New Chat
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Message your instructors from purchased courses
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab === "instructors" ? "instructors" : "courses"}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 text-lg rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            {(["instructors", "courses"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchQuery("");
                }}
                className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 capitalize ${activeTab === tab
                    ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                {tab === "instructors" ? "Instructors" : "My Courses"} (
                {tab === "instructors" ? uniqueTeachers.length : mockPurchasedCourses.length})
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-5">
          {activeTab === "instructors" ? (
            /* Instructors Tab */
            filteredTeachers.length === 0 ? (
              <EmptyState icon={<User className="w-16 h-16" />} title="No instructors found" />
            ) : (
              filteredTeachers.map((teacher) => (
                <InstructorCard key={teacher._id} teacher={teacher} />
              ))
            )
          ) : (
            /* Courses Tab */
            filteredCourses.length === 0 ? (
              <EmptyState icon={<BookOpen className="w-16 h-16" />} title="No courses found" />
            ) : (
              filteredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable Components
function InstructorCard({ teacher }: { teacher: any }) {
  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-6 p-6">
        <ProfileAvatar teacher={teacher} size="lg" />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{teacher.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {truncate(teacher.about || "No bio", 70)}
          </p>
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
            <User className="w-4 h-4" />
            <span>
              {teacher.courseCount} course{teacher.courseCount > 1 ? "s" : ""} purchased
            </span>
          </div>
        </div>
        <Link
          href={`/student/chat/${teacher._id}`}
          className="px-7 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2.5"
        >
          <MessageCircle className="w-5 h-5" />
          Start Chat
        </Link>
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: PurchasedCourse }) {
  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="flex">
        <div className="relative w-48 h-32 flex-shrink-0">
          <Image
            src={course.coverImage || "/placeholder-course.jpg"}
            alt={course.title}
            fill
            className="object-cover"
          />
          {course.progress !== undefined && (
            <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {course.progress}% complete
            </div>
          )}
        </div>
        <div className="flex-1 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {course.title}
            </h3>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <ProfileAvatar teacher={course.teacher} />
              <span>{course.teacher.name}</span>
            </div>
          </div>
          <Link
            href={`/student/chat/${course.teacher._id}`}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Message Instructor
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProfileAvatar({ teacher, size = "sm" }: { teacher: Teacher; size?: "sm" | "lg" }) {
  const sizeClass = size === "lg" ? "w-16 h-16" : "w-10 h-10";
  return (
    <div className="relative">
      {teacher.profilePicture ? (
        <Image
          src={teacher.profilePicture}
          alt={teacher.name}
          width={size === "lg" ? 64 : 40}
          height={size === "lg" ? 64 : 40}
          className={`${sizeClass} rounded-full object-cover border-2 border-white dark:border-gray-900 shadow`}
        />
      ) : (
        <div className={`${sizeClass} bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold`}>
          {teacher.name.charAt(0)}
        </div>
      )}
      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
    </div>
  );
}

function EmptyState({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
      {icon && <div className="mx-auto text-gray-300 dark:text-gray-700 mb-6">{icon}</div>}
      <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        Try adjusting your search or explore more courses
      </p>
    </div>
  );
}
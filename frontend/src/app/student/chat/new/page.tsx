"use client";

import { Search, MessageCircle, User, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { studentChatApi } from "@/services/APIservices/studentApiservice";
import { Input } from "@/components/ui/input";
import Header from "@/components/student/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Teacher {
    _id: string;
    name: string;
    profilePicture?: string;
    about?: string;
    courseCount?: number;
}

interface PurchasedCourse {
    _id: string;
    title: string;
    coverImage?: string;
    teacherId: Teacher;
    purchasedAt: string;
    progress?: number;
}

type TabType = "instructors" | "courses";

export default function StartNewChatPage() {
    const [activeTab, setActiveTab] = useState<TabType>("instructors");
    const [searchQuery, setSearchQuery] = useState("");

    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [courses, setCourses] = useState<PurchasedCourse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await studentChatApi.getTeachersForChat();
                setCourses(res.data.courses);
                setTeachers(res.data.teachers);
            } catch (err) {
                console.log("Error fetching chat data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredTeachers = useMemo(() => {
        if (!searchQuery.trim()) return teachers;
        return teachers.filter((t) =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, teachers]);

    const filteredCourses = useMemo(() => {
        if (!searchQuery.trim()) return courses;
        return courses.filter(
            (c) =>
                c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.teacherId.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, courses]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="h-screen bg-background flex flex-col">
            <Header />

            {/* Header */}
            <div className="border-b border-border bg-card p-4">
                <div className="flex items-center gap-3 mb-4">
                    <Link
                        href="/student/chat"
                        className="p-2 rounded-md hover:bg-muted transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-foreground"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </Link>

                    <h1 className="text-2xl font-bold text-foreground">Start New Chat</h1>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder={`Search ${activeTab === "instructors" ? "instructors" : "courses"
                            }...`}
                        className="pl-10 bg-input border-border"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mt-4">
                    {(["instructors", "courses"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                setSearchQuery("");
                            }}
                            className={`px-4 py-2 text-sm rounded-md transition border ${activeTab === tab
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-muted text-muted-foreground border-border hover:bg-muted/70"
                                }`}
                        >
                            {tab === "instructors" ? "Instructors" : "Courses"} (
                            {tab === "instructors" ? teachers.length : courses.length})
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto divide-y divide-border bg-background">
                {activeTab === "instructors" ? (
                    <InstructorList teachers={filteredTeachers} />
                ) : (
                    <CourseList courses={filteredCourses} />
                )}
            </div>
        </div>
    );
}

/* -------------------- Instructor List -------------------- */

function InstructorList({ teachers }: { teachers: Teacher[] }) {
    if (teachers.length === 0) {
        return <EmptyState title="No instructors found" icon={<User />} />;
    }

    return (
        <div className="divide-y divide-border">
            {teachers.map((teacher) => (
                <Link
                    key={teacher._id}
                    href={`/student/chat/${teacher._id}`}
                    className="block hover:bg-muted/50 transition-colors"
                >
                    <div className="p-4 flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                            <AvatarImage src={teacher.profilePicture} alt={teacher.name} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                {teacher.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">
                                {teacher.name}
                            </h3>
                            <p className="text-sm text-muted-foreground truncate">
                                {teacher.about || "No bio available"}
                            </p>
                        </div>

                        <MessageCircle className="w-5 h-5 text-muted-foreground" />
                    </div>
                </Link>
            ))}
        </div>
    );
}

/* -------------------- Course List -------------------- */

function CourseList({ courses }: { courses: PurchasedCourse[] }) {
    if (courses.length === 0) {
        return <EmptyState title="No courses found" icon={<BookOpen />} />;
    }

    return (
        <div className="divide-y divide-border">
            {courses.map((course) => (
                <Link
                    key={course._id}
                    href={`/student/chat/${course.teacherId._id}`}
                    className="block hover:bg-muted/50 transition-colors"
                >
                    <div className="p-4 flex items-center space-x-3">
                        {/* Course Thumbnail */}
                        <div className="relative w-28 h-14 rounded-md overflow-hidden bg-muted">
                            <Image
                                src={course.coverImage || "/placeholder-course.jpg"}
                                alt={course.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">
                                {course.title}
                            </h3>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Avatar className="w-6 h-6">
                                    <AvatarImage
                                        src={course.teacherId.profilePicture}
                                        alt={course.teacherId.name}
                                    />
                                    <AvatarFallback>
                                        {course.teacherId.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="truncate">{course.teacherId.name}</span>
                            </div>
                        </div>

                        <MessageCircle className="w-5 h-5 text-muted-foreground" />
                    </div>
                </Link>
            ))}
        </div>
    );
}

/* -------------------- Empty State -------------------- */

function EmptyState({
    title,
    icon,
}: {
    title: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="mb-2">{icon}</div>
            <p>{title}</p>
        </div>
    );
}

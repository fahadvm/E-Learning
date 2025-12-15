'use client';

import Image from "next/image";
import Link from "next/link";
import { Clock, Users, PlayCircle } from "lucide-react";
import { ICourse } from "@/types/student/studentTypes";

export default function RecommendedCourses({ courses }: { courses: ICourse[] }) {
    if (!courses || courses.length === 0) return null;

    // Format duration
    const formatDuration = (minutes?: number) => {
        if (!minutes) return "—";
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hrs > 0 ? `${hrs}h ${mins > 0 ? `${mins}m` : ""}` : `${mins}m`;
    };

    // Format price
    const formatPrice = (price?: number) => {
        if (price === undefined || price === 0) return "Free";
        return `₹${price}`;
    };

    return (
        <div className="mt-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Recommended For You
                </h2>
                <Link
                    href="/student/courses"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                    View all →
                </Link>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {courses.map((course) => {
                    const totalLessons = course.modules?.reduce(
                        (acc, mod) => acc + mod.lessons.length,
                        0
                    ) || 0;

                    return (
                        <Link
                            key={course._id}
                            href={`/student/courses/${course._id}`}
                            className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 overflow-hidden"
                        >
                            {/* Image */}
                            <div className="relative h-40 sm:h-44 bg-gray-100 overflow-hidden">
                                <Image
                                    src={course.coverImage || "/placeholder-course.jpg"}
                                    alt={course.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                                {/* Play Icon */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PlayCircle className="w-14 h-14 text-white drop-shadow-lg" />
                                </div>

                                {/* Duration */}
                                {course.totalDuration && (
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDuration(course.totalDuration)}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4 flex flex-col">
                                {/* Category */}
                                <div className="flex items-center justify-between text-xs mb-2">
                                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                                        {course.category}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {course.level}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="font-semibold text-base text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {course.title}
                                </h3>

                                {/* Instructor (optional, compact) */}
                                {course.teacherName && (
                                    <p className="text-xs text-gray-500 mt-1 truncate">
                                        {course.teacherName}
                                    </p>
                                )}

                                {/* Stats */}
                                <div className="mt-3 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3.5 h-3.5" />
                                            {course.totalStudents?.toLocaleString() || 0}
                                        </span>
                                        {totalLessons > 0 && (
                                            <span className="flex items-center gap-1">
                                                <PlayCircle className="w-3.5 h-3.5" />
                                                {totalLessons} lessons
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800 flex justify-end">
                                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                                        {formatPrice(course.price)}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

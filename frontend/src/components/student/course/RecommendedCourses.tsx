'use client';

import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Users, PlayCircle } from "lucide-react";
import { ICourse } from "@/types/student/studentTypes";



export default function RecommendedCourses({ courses }: { courses: ICourse[] }) {
    if (!courses || courses.length === 0) return null;

    // Helper to format duration
    const formatDuration = (minutes?: number) => {
        if (!minutes) return "—";
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hrs > 0 ? `${hrs}h ${mins > 0 ? `${mins}m` : ""}` : `${mins}m`;
    };

    // Helper to format price
    const formatPrice = (price?: number) => {
        if (price === undefined || price === 0) return "Free";
        return `₹${price}`;
    };

    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Recommended For You
                </h2>
                <Link
                    href="/student/courses"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 transition-colors"
                >
                    View all <span aria-hidden="true">→</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {courses.map((course) => {
                    const totalLessons = course.modules.reduce(
                        (acc, mod) => acc + mod.lessons.length,
                        0
                    );

                    return (
                        <Link
                            key={course._id}
                            href={`/student/courses/${course._id}`}
                            className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 overflow-hidden"
                        >
                            {/* Cover Image */}
                            <div className="relative aspect-video overflow-hidden bg-gray-100">
                                <Image
                                    src={course.coverImage || "/placeholder-course.jpg"}
                                    alt={course.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                                {/* Play icon overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <PlayCircle className="w-16 h-16 text-white drop-shadow-lg" />
                                </div>

                                {/* Duration badge */}
                                {course.totalDuration ? (
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur">
                                        <Clock className="w-3 h-3" />
                                        {formatDuration(course.totalDuration)}
                                    </div>
                                ) : null}
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-grow">
                                {/* Category & Level */}
                                <div className="flex items-center justify-between text-xs mb-3">
                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                                        {course.category}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {course.level}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {course.title}
                                </h3>

                                {/* Subtitle */}
                                {course.subtitle && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                        {course.subtitle}
                                    </p>
                                )}

                                {/* Instructor */}
                                {course.teacherName && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 border-2 border-dashed border-gray-400 dark:border-gray-600" />
                                        <span>{course.teacherName}</span>
                                    </p>
                                )}

                                {/* Stats Row */}
                                <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {course.totalStudents?.toLocaleString() || 0}
                                        </span>
                                        {totalLessons > 0 && (
                                            <span className="flex items-center gap-1">
                                                <PlayCircle className="w-4 h-4" />
                                                {totalLessons} lessons
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Footer: Rating + Price */}
                                <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                                    {/* <div className="flex items-center gap-2">
                                        {course.averageRating ? (
                                            <>
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < Math.floor(course.averageRating!)
                                                                    ? "fill-yellow-400 text-yellow-400"
                                                                    : "text-gray-300 dark:text-gray-700"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {course.averageRating.toFixed(1)}
                                                </span>
                                                {course.reviewCount ? (
                                                    <span className="text-xs text-gray-500">
                                                        ({course.reviewCount})
                                                    </span>
                                                ) : null}
                                            </>
                                        ) : (
                                            <span className="text-xs text-gray-500">No ratings yet</span>
                                        )}
                                    </div> */}

                                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                                        {formatPrice(course.price)}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}         
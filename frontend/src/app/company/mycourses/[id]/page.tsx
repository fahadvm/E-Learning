"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock2, Download, Play, FileText, Video, Image, Code, File } from "lucide-react";
import { showErrorToast } from "@/utils/Toast";
import { companyApiMethods } from "@/services/APIservices/companyApiService";

interface Lesson {
    _id: string;
    title: string;
    duration: number;
    videoFile?: string;
}

interface Module {
    _id: string;
    title: string;
    description: string;
    lessons: Lesson[];
}

interface Resource {
    _id: string;
    title: string;
    fileUrl: string;
    fileType: string;
}

interface Course {
    _id: string;
    title: string;
    category: string;
    coverImage?: string;
    totalDuration: number;
    teacherId?: {
        _id: string;
        name: string;
        about: string;
        profilePicture: string;
    };
    description?: string;
    modules?: Module[];
}

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
    const [courseId, setCourseId] = useState<string>("");
    const [course, setCourse] = useState<Course | null>(null);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [resources, setResources] = useState<Resource[]>([]);
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

    useEffect(() => {
        const resolveParams = async () => {
            const resolved = await params;
            setCourseId(resolved.id);
        };
        resolveParams();
    }, [params]);

    useEffect(() => {
        if (!courseId) return;
        fetchCourse();
        fetchResources();
    }, [courseId]);

    const fetchCourse = async () => {
        try {
            setLoading(true);
            const res = await companyApiMethods.getCourseById(courseId);
            if (res.ok) {
                const courseData: Course = res.data;
                setCourse(courseData);
                const firstLesson = courseData.modules?.[0]?.lessons?.[0] || null;
                setCurrentLesson(firstLesson);
                if (firstLesson) setExpandedModules(new Set([courseData.modules?.[0]._id || ""]));
            } else {
                showErrorToast(res.message);
            }
        } catch {
            showErrorToast("Failed to fetch course");
        } finally {
            setLoading(false);
        }
    };

    const fetchResources = async () => {
        try {
            const res = await companyApiMethods.getCourseResources(courseId);
            if (res.ok) setResources(res.data);
        } catch {
            showErrorToast("Failed to load resources");
        }
    };

    const downloadResource = async (fileUrl: string, title: string) => {
        try {
            const res = await fetch(fileUrl);
            const blob = await res.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = title;
            link.click();
        } catch {
            showErrorToast("Download failed");
        }
    };

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev => {
            const next = new Set(prev);
            if (next.has(moduleId)) next.delete(moduleId);
            else next.add(moduleId);
            return next;
        });
    };

    const getFileIcon = (type: string) => {
        if (type.includes("pdf")) return <FileText className="w-5 h-5" />;
        if (type.includes("image")) return <Image className="w-5 h-5" />;
        if (type.includes("video")) return <Video className="w-5 h-5" />;
        if (type.includes("code") || type.includes("zip")) return <Code className="w-5 h-5" />;
        return <File className="w-5 h-5" />;
    };

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="text-indigo-600 font-semibold text-lg animate-pulse">Loading your course...</div>
            </div>
        );

    if (!course)
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
                <div className="text-red-600 font-semibold text-lg">Course not found</div>
            </div>
        );

    return (
        <>
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800&display=swap');

        body { font-family: 'Inter', sans-serif; }
        h1, h2, h3, h4, .font-montserrat { font-family: 'Montserrat', sans-serif; }

        .glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .video-container {
          position: relative;
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(79, 70, 229, 0.2);
        }

        .video-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(124, 58, 237, 0.1));
          z-index: 1;
          pointer-events: none;
        }

        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .lesson-btn {
          transition: all 0.3s ease;
        }
        .lesson-btn:hover {
          transform: translateX(4px);
          background: rgba(79, 70, 229, 0.15);
        }
        .lesson-btn.active {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          font-weight: 600;
        }

        .resource-card {
          transition: all 0.3s ease;
        }
        .resource-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(79, 70, 229, 0.15);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>

            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">

                {/* Header */}
                <header className="glass shadow-lg sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                        <Link href="/company/mycourses">
                            <button className="flex items-center gap-2 hover:bg-white/20 px-5 py-2.5 rounded-full transition backdrop-blur-sm">
                                <ArrowLeft className="w-5 h-5 text-indigo-700" />
                                <span className="font-medium text-indigo-700">Back to Courses</span>
                            </button>
                        </Link>
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-md">
                            {course.category.toUpperCase()}
                        </span>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-8">

                    {/* Left: Video + Overview */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Video Player */}
                        <div className="video-container animate-fade-in-up">
                            {currentLesson?.videoFile ? (
                                <video controls className="w-full aspect-video" src={currentLesson.videoFile} />
                            ) : (
                                <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col items-center justify-center text-indigo-600">
                                    <Play className="w-16 h-16 mb-4 opacity-50" />
                                    <p className="text-lg font-medium">Select a lesson to begin</p>
                                </div>
                            )}
                        </div>

                        {/* Course Overview */}
                        <div className="glass p-8 rounded-3xl shadow-xl space-y-8 animate-fade-in-up">
                            {/* Instructor */}
                            <div>
                                <h3 className="text-xl font-bold mb-2">Instructor</h3>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={course.teacherId?.profilePicture || "/gallery/avatar.jpg"}
                                        className="w-14 h-14 rounded-full border-2 border-blue-500"
                                    />
                                    <div>
                                        <p className="font-medium">{course.teacherId?.name}</p>
                                        <p className="text-sm text-black">
                                            {course.teacherId?.about || "No instructor details available"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                                    <BookOpen className="w-6 h-6" /> Course Overview
                                </h3>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {course.description || "Dive deep into this comprehensive course and gain practical skills."}
                                </p>
                                <p className="mt-5 flex items-center gap-2 text-indigo-600 font-medium">
                                    <Clock2 className="w-5 h-5" />
                                    Total Duration: {Math.floor(course.totalDuration / 60)}h {course.totalDuration % 60}m
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Lessons + Resources */}
                    <div className="space-y-8">

                        {/* Lessons */}
                        <div className="glass p-6 rounded-3xl shadow-xl max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300">
                            <h3 className="text-2xl font-bold text-indigo-800 mb-5">Course Content</h3>

                            {course.modules?.map((module) => (
                                <div key={module._id} className="mb-4">
                                    <button
                                        onClick={() => toggleModule(module._id)}
                                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl hover:from-indigo-200 hover:to-purple-200 transition-all font-semibold text-indigo-800"
                                    >
                                        <span>{module.title}</span>
                                        <span className="text-sm">
                                            {expandedModules.has(module._id) ? "−" : "+"}
                                        </span>
                                    </button>

                                    {expandedModules.has(module._id) && (
                                        <div className="mt-3 space-y-2 pl-2 border-l-4 border-indigo-300">
                                            {module.lessons.map((lesson) => (
                                                <button
                                                    key={lesson._id}
                                                    onClick={() => setCurrentLesson(lesson)}
                                                    className={`lesson-btn w-full flex justify-between items-center p-3 rounded-lg text-left text-sm font-medium transition-all ${currentLesson?._id === lesson._id ? "active text-white" : "text-gray-700 hover:bg-indigo-50"
                                                        }`}
                                                >
                                                    <span className="flex items-center gap-2 truncate">
                                                        {currentLesson?._id === lesson._id ? (
                                                            <Play className="w-4 h-4" />
                                                        ) : (
                                                            <div className="w-4 h-4 rounded-full border-2 border-indigo-400"></div>
                                                        )}
                                                        <span className="truncate">{lesson.title}</span>
                                                    </span>
                                                    <span className="text-xs opacity-75">{lesson.duration}m</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Resources */}
                        <div className="glass p-6 rounded-3xl shadow-xl">
                            <h3 className="text-2xl font-bold text-indigo-800 mb-5 flex items-center gap-2">
                                <Download className="w-6 h-6" /> Downloadable Resources
                            </h3>

                            {resources.length === 0 ? (
                                <p className="text-gray-500 italic text-center py-4">No resources available yet</p>
                            ) : (
                                <div className="space-y-3">
                                    {resources.map((resource) => (
                                        <button
                                            key={resource._id}
                                            onClick={() => downloadResource(resource.fileUrl, resource.title)}
                                            className="resource-card w-full flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
                                                    {getFileIcon(resource.fileType)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 truncate max-w-[180px]">{resource.title}</p>
                                                    <p className="text-xs text-gray-500">{resource.fileType}</p>
                                                </div>
                                            </div>
                                            <Download className="w-5 h-5 text-indigo-600" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock2 } from "lucide-react";
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
      if (res.ok) {
        setResources(res.data);
      }
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-blue-300">
        Loading course...
      </div>
    );

  if (!course)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-400">
        Course not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-200 text-white">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/company/mycourses">
            <button className="flex items-center gap-2 hover:bg-blue-700 px-4 py-2 rounded-full transition">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </Link>

          <span className="bg-blue-600 px-4 py-1 rounded-full text-sm font-semibold">
            {course.category}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">

        {/* Left Section: Video & Overview */}
        <div className="lg:col-span-2 space-y-6">

          <div className="overflow-hidden rounded-3xl shadow-2xl">
            {currentLesson?.videoFile ? (
              <video className="w-full aspect-video" controls src={currentLesson.videoFile} />
            ) : (
              <div className="aspect-video bg-blue-800 flex justify-center items-center text-blue-300">
                Select a lesson to start
              </div>
            )}
          </div>

          <div className="bg-blue-800 p-6 rounded-3xl shadow-2xl space-y-6">

            <div>
              <h3 className="text-xl font-bold mb-2">Instructor</h3>
              <div className="flex items-center gap-4">
                <img
                  src={course.teacherId?.profilePicture || "/gallery/avatar.jpg"}
                  className="w-14 h-14 rounded-full border-2 border-blue-500"
                />
                <div>
                  <p className="font-medium">{course.teacherId?.name}</p>
                  <p className="text-sm text-blue-300">
                    {course.teacherId?.about || "No instructor details available"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-xl font-bold mb-2">
                <BookOpen className="w-5 h-5" /> Course Description
              </h3>
              <p className="text-blue-300">{course.description}</p>
              <p className="mt-3 flex items-center gap-2 text-sm text-blue-300">
                <Clock2 className="w-5 h-5" />
                Duration: {Math.floor(course.totalDuration / 60)}h {course.totalDuration % 60}m
              </p>
            </div>

          </div>
        </div>

        {/* Right Section: Lessons + Resources */}
        <div className="space-y-6">

          {/* Lessons */}
          <div className="bg-blue-800 p-6 rounded-3xl shadow-2xl space-y-4 max-h-[60vh] overflow-y-auto">
            <h3 className="text-xl font-bold">Course Content</h3>

            {course.modules?.map((module) => (
              <div key={module._id} className="bg-blue-800 p-4 rounded-xl space-y-2">
                <h4 className="font-semibold">{module.title}</h4>

                {module.lessons.map((lesson) => (
                  <button
                    key={lesson._id}
                    onClick={() => setCurrentLesson(lesson)}
                    className={`w-full flex justify-between items-center p-3 rounded-lg hover:bg-blue-700 transition ${
                      currentLesson?._id === lesson._id ? "bg-blue-600" : ""
                    }`}
                  >
                    <span>{lesson.title}</span>
                    <span className="text-xs text-blue-300">{lesson.duration} min</span>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Resources */}
          <div className="bg-blue-800 p-6 rounded-3xl shadow-2xl space-y-4">
            <h3 className="text-xl font-bold">Resources</h3>

            {resources.length === 0 && (
              <p className="text-blue-300 text-sm">No resources available</p>
            )}

            <div className="space-y-3">
              {resources.map((resource) => (
                <button
                  key={resource._id}
                  onClick={() => downloadResource(resource.fileUrl, resource.title)}
                  className="w-full flex justify-between items-center bg-blue-800 hover:bg-blue-700 p-3 rounded-lg transition text-left"
                >
                  <span>{resource.title}</span>
                  <span className="text-xs text-blue-300">{resource.fileType}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

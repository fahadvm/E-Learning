"use client";

import { useEffect, useState } from "react";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";
import { ArrowLeft, Lock, CheckCircle2, Play } from "lucide-react";
import Link from "next/link";

/* ---------- Types ---------- */
interface Course {
  _id: string;
  courseId: string;
  title: string;
  description?: string;
  duration?: string;
  difficulty: string;
  icon?: string;
  order: number;
}

interface LearningPathProgress {
  currentCourse: {
    index: number;
    courseId: string;
    percentage: number;
  };
  completedCourses: string[];
  percentage: number; // overall %
  status: "active" | "paused" | "completed" | string;
}

interface LearningPathDetail {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  courses: Course[];
  progress: LearningPathProgress;
}

export default function EmployeeLearningPathsPage() {
  const [view, setView] = useState<"list" | "detail">("list");
  const [paths, setPaths] = useState<any[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPathDetail | null>(null);

  useEffect(() => {
    fetchAssignedPaths();
  }, []);

  const fetchAssignedPaths = async () => {
    const res = await employeeApiMethods.getAssignedLearningPaths();
    // API returns array where progress fields are at ROOT of each item
    // e.g. { learningPathId: {...}, percentage, currentCourse, completedCourses, status, ... }
    setPaths(res?.data || []);
  };

  /* ---------- Open Learning Path Detail ---------- */
  const openDetail = async (lp: any) => {
    // lp.learningPathId is the Object with the LP meta
    const lpDetail = await employeeApiMethods.getLearningPathById(lp.learningPathId._id);

    // Build a normalized progress object from ROOT-level fields on lp
    const progress: LearningPathProgress = {
      currentCourse: {
        index: lp?.currentCourse?.index ?? 0,
        courseId: lp?.currentCourse?.courseId ?? "",
        percentage: lp?.currentCourse?.percentage ?? 0,
      },
      completedCourses: lp?.completedCourses ?? [],
      percentage: lp?.percentage ?? 0,
      status: lp?.status ?? "active",
    };

    const learningPath: LearningPathDetail = {
      _id: lpDetail?.data?._id,
      title: lpDetail?.data?.title ?? "",
      description: lpDetail?.data?.description ?? "",
      difficulty: lpDetail?.data?.difficulty ?? "Beginner",
      courses: Array.isArray(lpDetail?.data?.courses) ? lpDetail.data.courses : [],
      progress,
    };

    setSelectedPath(learningPath);
    setView("detail");
  };

  const backToList = () => {
    setSelectedPath(null);
    setView("list");
  };

  /* ---------- UI Helpers ---------- */
  const getCourseProgress = (course: Course, progress: LearningPathProgress) => {
    if (!progress) return 0;

    // Completed
    if (progress.completedCourses?.includes(course.courseId)) return 100;

    // Current course
    if (progress.currentCourse?.courseId === course.courseId) {
      return progress.currentCourse?.percentage ?? 0;
    }

    // Not started
    return 0;
  };

  const isCourseLocked = (index: number, progress: LearningPathProgress) => {
    const currentIdx = progress?.currentCourse?.index ?? 0;
    // lock any course strictly after the current index
    return index > currentIdx;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 max-w-6xl mx-auto">

      {/* ---------- LIST VIEW ---------- */}
      {view === "list" && (
        <>
          <h2 className="text-3xl font-bold mb-6">My Learning Paths</h2>

          {paths.length === 0 ? (
            <p className="text-center text-gray-600 py-20">No Learning Paths Assigned.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paths.map((p) => (
                <div
                  key={p._id}
                  onClick={() => openDetail(p)}
                  className="cursor-pointer p-6 bg-white rounded-xl border hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold">{p?.learningPathId?.title}</h3>
                  <p className="text-sm text-gray-600">{p?.learningPathId?.category}</p>
                  {/* percentage is at ROOT (p.percentage), not p.progress.percentage */}
                  <div className="text-sm mt-2 text-purple-600 font-medium">
                    {(typeof p?.percentage === "number" ? p.percentage : 0)}% Completed
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ---------- DETAIL VIEW ---------- */}
      {view === "detail" && selectedPath && (
        <>
          <button
            onClick={backToList}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <ArrowLeft size={18} /> Back
          </button>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-purple-700 mb-2">
              {selectedPath.title}
            </h1>
            <p className="text-gray-600">{selectedPath.description}</p>
          </div>

          {/* Overall Progress */}
          <div className="mb-14 bg-white rounded-2xl p-6 shadow border">
            <div className="flex justify-between mb-2 text-gray-700 font-medium">
              <span>Progress</span>
              <span>{selectedPath.progress?.percentage ?? 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all"
                style={{ width: `${selectedPath.progress?.percentage ?? 0}%` }}
              />
            </div>
          </div>

          {/* Course Roadmap */}
          <h3 className="text-2xl font-semibold mb-6 text-purple-800">Course Roadmap</h3>

          <div className="space-y-6">
            {selectedPath.courses
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((course, index) => {
                const progress = selectedPath.progress;
                const isCompleted = progress?.completedCourses?.includes(course.courseId);
                const locked = isCourseLocked(index, progress);
                const isCurrent = progress?.currentCourse?.index === index;
                const courseProgress = getCourseProgress(course, progress);

                return (
                  <div
                    key={course._id ?? `${course.courseId}-${index}`}
                    className={`p-6 rounded-2xl border bg-white shadow-sm ${locked ? "opacity-60" : ""}`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-lg">{course.title}</h4>

                      {isCompleted && (
                        <span className="text-green-600 flex items-center gap-1 font-medium">
                          <CheckCircle2 size={18} /> Completed
                        </span>
                      )}

                      {locked && <Lock className="text-gray-500" />}
                    </div>

                    <p className="text-gray-600 mb-4">
                      {course.duration || "Duration not specified"}
                    </p>

                    {!locked && (
                      <>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                          <div
                            className="bg-purple-500 h-full"
                            style={{ width: `${courseProgress}%` }}
                          />
                        </div>

                        <Link href={`/employee/mycourses/${course.courseId}`}>
                          <button className="flex items-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 w-full justify-center">
                            <Play size={18} />
                            {isCompleted ? "Review" : isCurrent ? "Continue" : "Start"}
                          </button>
                        </Link>
                      </>
                    )}
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";
import {
  ArrowLeft,
  Lock,
  CheckCircle2,
  Play,
  Users,
  Building2,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Target,
  Sparkles,
  Clock,
  Award,
  ChevronRight,
  GraduationCap,
  BarChart3,
} from "lucide-react";
import { useEmployee } from "@/context/employeeContext";
import { useRouter } from "next/navigation";

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
  percentage: number;
  status: "active" | "paused" | "completed" | string;
}

interface LearningPathDetail {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  category?: string;
  icon?: string;
  courses: Course[];
  progress: LearningPathProgress;
}

export default function EmployeeLearningPathsPage() {
  const [view, setView] = useState<"list" | "detail">("list");
  const [paths, setPaths] = useState<any[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPathDetail | null>(
    null
  );
  const { employee } = useEmployee();
  const router = useRouter();

  useEffect(() => {
    fetchAssignedPaths();
  }, []);

  const fetchAssignedPaths = async () => {
    const res = await employeeApiMethods.getAssignedLearningPaths();
    setPaths(res?.data || []);
  };

  const openDetail = async (lp: any) => {
    const lpDetail = await employeeApiMethods.getLearningPathById(
      lp.learningPathId._id
    );

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
      category: lpDetail?.data?.category,
      icon: lpDetail?.data?.icon,
      courses: Array.isArray(lpDetail?.data?.courses)
        ? lpDetail.data.courses
        : [],
      progress,
    };

    setSelectedPath(learningPath);
    setView("detail");
  };

  const backToList = () => {
    setSelectedPath(null);
    setView("list");
  };

  const getCourseProgress = (
    course: Course,
    progress: LearningPathProgress
  ) => {
    if (!progress) return 0;
    if (progress.completedCourses?.includes(course.courseId)) return 100;
    if (progress.currentCourse?.courseId === course.courseId) {
      return progress.currentCourse?.percentage ?? 0;
    }
    return 0;
  };

  const isCourseLocked = (index: number, progress: LearningPathProgress) => {
    const currentIdx = progress?.currentCourse?.index ?? 0;
    return index > currentIdx;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-700 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (!employee?.companyId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-6">
        <div className="text-center max-w-2xl bg-white p-16 rounded-3xl shadow-xl">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-8">
            <Users className="w-16 h-16 text-blue-600" />
          </div>

          <h3 className="text-4xl font-bold text-gray-900 mb-4">
            Join Your Organization
          </h3>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Connect with your company to unlock learning paths, team
            leaderboards, and collaborative growth opportunities.
          </p>

          <button
            onClick={() => router.push("/employee/company")}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Building2 className="w-5 h-5" />
            Join a Company
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {view === "list" && (
          <ListView
            paths={paths}
            onOpenDetail={openDetail}
            getDifficultyColor={getDifficultyColor}
          />
        )}

        {view === "detail" && selectedPath && (
          <DetailView
            path={selectedPath}
            onBack={backToList}
            getCourseProgress={getCourseProgress}
            isCourseLocked={isCourseLocked}
            getDifficultyColor={getDifficultyColor}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- LIST VIEW ---------- */
interface ListViewProps {
  paths: any[];
  onOpenDetail: (path: any) => void;
  getDifficultyColor: (difficulty: string) => string;
}

function ListView({ paths, onOpenDetail, getDifficultyColor }: ListViewProps) {
  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-3">
          My Learning Paths
        </h1>
        <p className="text-xl text-gray-600">
          Continue your structured learning journey
        </p>
      </div>

      {/* Stats Overview */}
      {paths.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Paths</p>
                <p className="text-3xl font-bold text-gray-900">{paths.length}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {paths.filter((p) => p.percentage === 100).length}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">
                  {
                    paths.filter((p) => p.percentage > 0 && p.percentage < 100)
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg. Progress</p>
                <p className="text-3xl font-bold text-gray-900">
                  {paths.length > 0
                    ? Math.round(
                      paths.reduce((acc, p) => acc + (p.percentage || 0), 0) /
                      paths.length
                    )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Learning Paths Grid */}
      {paths.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((p, index) => (
            <div
              key={p._id}
              onClick={() => onOpenDetail(p)}
              className="group cursor-pointer p-6 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {/* Icon & Status */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-4xl">
                  {p?.learningPathId?.icon || "📚"}
                </div>
                {p.percentage === 100 && (
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold border border-green-200 flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    Completed
                  </div>
                )}
              </div>

              {/* Title & Category */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {p?.learningPathId?.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {p?.learningPathId?.category || "Learning Path"}
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Progress</span>
                  <span className="font-bold text-blue-600">
                    {typeof p?.percentage === "number" ? p.percentage : 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${typeof p?.percentage === "number" ? p.percentage : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                  <BookOpen size={16} />
                  <span>View Details</span>
                </div>
                <ChevronRight
                  size={20}
                  className="text-blue-600 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- DETAIL VIEW ---------- */
interface DetailViewProps {
  path: LearningPathDetail;
  onBack: () => void;
  getCourseProgress: (course: Course, progress: LearningPathProgress) => number;
  isCourseLocked: (index: number, progress: LearningPathProgress) => boolean;
  getDifficultyColor: (difficulty: string) => string;
}

function DetailView({
  path,
  onBack,
  getCourseProgress,
  isCourseLocked,
  getDifficultyColor,
}: DetailViewProps) {
  const router = useRouter();
  const totalCourses = path.courses.length;
  const completedCourses = path.progress?.completedCourses?.length || 0;

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 px-5 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all font-medium border border-gray-200"
      >
        <ArrowLeft size={20} /> Back to Paths
      </button>

      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6 flex-1">
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-6xl">
              {path.icon || "📚"}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-3">{path.title}</h1>
              <p className="text-blue-100 text-lg mb-4 leading-relaxed">
                {path.description || "No description available"}
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/20 text-white border border-white/30">
                  {path.difficulty}
                </span>
                {path.category && (
                  <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/20 text-white border border-white/30">
                    {path.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress Card */}
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={24} />
            Overall Progress
          </h3>
          <span className="text-4xl font-bold text-blue-600">
            {path.progress?.percentage ?? 0}%
          </span>
        </div>

        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${path.progress?.percentage ?? 0}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-600 text-sm mb-1 font-medium">Total Courses</p>
            <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-gray-600 text-sm mb-1 font-medium">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {completedCourses}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-gray-600 text-sm mb-1 font-medium">Remaining</p>
            <p className="text-2xl font-bold text-yellow-600">
              {totalCourses - completedCourses}
            </p>
          </div>
        </div>
      </div>

      {/* Course Roadmap */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <GraduationCap className="text-blue-600" size={28} />
          Course Roadmap
        </h3>

        <div className="space-y-4">
          {path.courses
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((course, index) => {
              const progress = path.progress;
              const isCompleted =
                progress?.completedCourses?.includes(course.courseId);
              const locked = isCourseLocked(index, progress);
              const isCurrent = progress?.currentCourse?.index === index;
              const courseProgress = getCourseProgress(course, progress);

              return (
                <div
                  key={course._id ?? `${course.courseId}-${index}`}
                  className={`p-6 rounded-2xl border bg-white shadow-lg transition-all ${locked
                      ? "opacity-60"
                      : "hover:shadow-xl hover:scale-[1.02]"
                    }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Course Number */}
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg flex-shrink-0 ${isCompleted
                          ? "bg-green-100 text-green-600"
                          : isCurrent
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={24} />
                      ) : locked ? (
                        <Lock size={24} />
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-1">
                            {course.title}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {course.description || course.duration || "No description"}
                          </p>
                        </div>

                        {isCompleted && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold border border-green-200">
                            <CheckCircle2 size={14} />
                            Completed
                          </div>
                        )}

                        {locked && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-semibold border border-red-200">
                            <Lock size={14} />
                            Locked
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {!locked && (
                        <>
                          <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all duration-500"
                              style={{ width: `${courseProgress}%` }}
                            />
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={() =>
                              router.push(`/employee/learningpath/${course.courseId}`)
                            }
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all w-full justify-center shadow-lg hover:shadow-xl"
                          >
                            <Play size={18} />
                            {isCompleted
                              ? "Review Course"
                              : isCurrent
                                ? "Continue Learning"
                                : "Start Course"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

/* ---------- EMPTY STATE ---------- */
function EmptyState() {
  return (
    <div className="text-center py-32 bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-6">
        <Sparkles className="w-12 h-12 text-blue-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-3">No Learning Paths Assigned</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Your company hasn't assigned any learning paths yet. Check back soon or
        contact your administrator.
      </p>
    </div>
  );
}

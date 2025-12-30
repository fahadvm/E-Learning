"use client";

import { useEffect, useState } from "react";
import Header from "@/components/company/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ArrowLeft,
  BookOpen,
  Sparkles,
  X,
  Pencil,
  Trash2,
  Save,
  Eye,
  Clock,
  Users,
  TrendingUp,
  CheckCircle2,
  Lock,
  Unlock,
  GraduationCap,
  Target,
  BarChart3,
} from "lucide-react";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { showErrorToast, showSuccessToast } from "@/utils/Toast";

/* ------------------------- Types ------------------------- */
type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface CourseOption {
  _id: string;
  courseId: string;
  title: string;
  description?: string;
  totalDuration?: number;
  difficulty: Difficulty;
  icon?: string;
}

interface CourseInPath {
  title: string;
  courseId: string;
  description?: string;
  duration?: number;
  difficulty: Difficulty;
  icon?: string;
  order: number;
  locked?: boolean;
}

interface LearningPath {
  _id: string;
  title: string;
  description?: string;
  category: string;
  difficulty: Difficulty;
  icon?: string;
  courses: CourseInPath[];
}

/* ------------------------- Main ------------------------- */
export default function LearningPathsPage() {
  const [activeTab, setActiveTab] = useState<
    "list" | "create" | "detail" | "edit"
  >("list");
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string | null;
  }>({
    open: false,
    id: null,
  });

  const loadPaths = async () => {
    const res = await companyApiMethods.getLearningPath();
    setPaths(res.data || []);
    setTotalPages(res.data?.totalPages || 1);
  };

  useEffect(() => {
    loadPaths();
  }, [page]);

  const deletePath = async () => {
    if (!deleteConfirm.id) return;
    await companyApiMethods.deleteLearningPath(deleteConfirm.id);
    setDeleteConfirm({ open: false, id: null });
    showSuccessToast("Learning path deleted successfully");
    loadPaths();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-primary/5 to-slate-900" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-24 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />

        <AnimatePresence mode="wait">
          {activeTab === "list" && (
            <ListView
              paths={paths}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onCreate={() => setActiveTab("create")}
              onEdit={(p) => {
                setSelectedPath(p);
                setActiveTab("edit");
              }}
              onDelete={(id) => setDeleteConfirm({ open: true, id })}
              onViewDetail={(p) => {
                setSelectedPath(p);
                setActiveTab("detail");
              }}
            />
          )}

          {(activeTab === "create" || activeTab === "edit") && (
            <CreateOrEditView
              isEdit={activeTab === "edit"}
              existing={selectedPath}
              onBack={() => setActiveTab("list")}
              onSaved={() => {
                loadPaths();
                setActiveTab("list");
              }}
            />
          )}

          {activeTab === "detail" && selectedPath && (
            <DetailView
              path={selectedPath}
              onBack={() => setActiveTab("list")}
              onEdit={() => setActiveTab("edit")}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200]"
            onClick={() => setDeleteConfirm({ open: false, id: null })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold">Delete Learning Path?</h3>
              </div>
              <p className="text-gray-300 mb-8 leading-relaxed">
                This action cannot be undone. This will permanently delete the
                learning path and remove all associated data.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm({ open: false, id: null })}
                  className="px-6 py-3 border border-white/20 rounded-xl hover:bg-white/10 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={deletePath}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all font-medium shadow-lg shadow-red-600/20"
                >
                  Delete Path
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------- List View ------------------------- */
interface ListViewProps {
  paths: LearningPath[];
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onCreate: () => void;
  onViewDetail: (p: LearningPath) => void;
  onEdit: (p: LearningPath) => void;
  onDelete: (id: string) => void;
}

function ListView({
  paths,
  page,
  totalPages,
  onPageChange,
  onCreate,
  onViewDetail,
  onEdit,
  onDelete,
}: ListViewProps) {
  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/20 text-green-300 border-green-400/30";
      case "Intermediate":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
      case "Advanced":
        return "bg-red-500/20 text-red-300 border-red-400/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-400/30";
    }
  };

  return (
    <motion.div
      key="list"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-6 py-24"
    >
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
              Learning Paths
            </h1>
            <p className="text-gray-400 text-lg">
              Create structured learning journeys for your team
            </p>
          </div>
          <button
            onClick={onCreate}
            className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl flex items-center gap-2 font-semibold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-105"
          >
            <Plus size={20} /> Create New Path
          </button>
        </div>

        {/* Stats Cards */}
        {paths.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Paths</p>
                  <p className="text-2xl font-bold">{paths.length}</p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Courses</p>
                  <p className="text-2xl font-bold">
                    {paths.reduce((acc, p) => acc + p.courses.length, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Avg. Courses/Path</p>
                  <p className="text-2xl font-bold">
                    {paths.length > 0
                      ? Math.round(
                        paths.reduce((acc, p) => acc + p.courses.length, 0) /
                        paths.length
                      )
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {paths.length === 0 ? (
        <EmptyState onCreate={onCreate} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((p: LearningPath, index) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 backdrop-blur-xl cursor-pointer"
              onClick={() => onViewDetail(p)}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                  {p.icon || "📚"}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(p);
                    }}
                    className="p-2 rounded-lg bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 transition-all"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(p._id);
                    }}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {p.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                {p.description || "No description available"}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(
                    p.difficulty
                  )}`}
                >
                  {p.difficulty}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                  {p.category}
                </span>
              </div>

              {/* Footer Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <BookOpen size={16} />
                  <span className="font-medium">
                    {p.courses.length} course{p.courses.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details
                  <Eye size={16} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-12">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Previous
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${p === page
                    ? "bg-primary text-white"
                    : "bg-white/5 hover:bg-white/10"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------- Create / Edit View ------------------------- */
interface PurchasedCourse {
  courseId: {
    _id: string;
    title: string;
    subtitle?: string;
    description?: string;
    totalDuration?: number;
    difficulty?: Difficulty;
  };
}

interface CompanyOrder {
  purchasedCourses?: PurchasedCourse[];
}
interface CreateOrEditViewProps {
  isEdit: boolean;
  existing: LearningPath | null;
  onBack: () => void;
  onSaved: () => void;
}

interface CompanyCourseOrder {
  _id: string;
  companyId: string;
  courseId: {
    _id: string;
    title: string;
    subtitle?: string;
    description: string;
    totalDuration: number;
    level?: string;
  };
  seatsPurchased: number;
  seatsUsed: number;
}

function CreateOrEditView({
  isEdit,
  existing,
  onBack,
  onSaved,
}: CreateOrEditViewProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    title: existing?.title || "",
    description: existing?.description || "",
    category: existing?.category || "",
    difficulty: (existing?.difficulty as Difficulty) || "Beginner",
    icon: existing?.icon || "📚",
  });

  const [companyCourses, setCompanyCourses] = useState<CourseOption[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<CourseInPath[]>(
    existing?.courses || []
  );

  const uniqueByCourseId = (courses: CourseOption[]) => {
    return courses.filter(
      (c, index, self) =>
        index === self.findIndex((x) => x.courseId === c.courseId)
    );
  };

  const loadCourses = async () => {
    try {
      const res = await companyApiMethods.getmycourses();

      const allCourses: CourseOption[] = res.data.map(
        (order: CompanyCourseOrder) => ({
          _id: order.courseId._id,
          courseId: order.courseId._id,
          title: order.courseId.title,
          description: order.courseId.subtitle || order.courseId.description,
          totalDuration: order.courseId.totalDuration,
          difficulty: (order.courseId.level || "Beginner") as Difficulty,
          icon: "📚",
        })
      );

      const uniqueCourses = uniqueByCourseId(allCourses);
      const filtered = uniqueCourses.filter(
        (course) => !selectedCourses.some((c) => c.courseId === course._id)
      );

      setCompanyCourses(filtered);
    } catch (error) {
      console.error("Failed to load courses:", error);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [selectedCourses]);

  const addCourse = (course: CourseOption) => {
    const newCourse: CourseInPath = {
      title: course.title,
      courseId: course._id,
      description: course.description || "",
      duration: course.totalDuration || 0,
      difficulty: course.difficulty || "Beginner",
      icon: course.icon || "📚",
      order: selectedCourses.length,
      locked: selectedCourses.length !== 0,
    };

    setSelectedCourses((prev) => [...prev, newCourse]);
    setCompanyCourses((prev) => prev.filter((c) => c._id !== course._id));
  };

  const removeCourse = (index: number) => {
    const removed = selectedCourses[index];
    setCompanyCourses((prev) => [
      ...prev,
      {
        _id: removed.courseId,
        courseId: removed.courseId,
        title: removed.title,
        description: removed.description,
        totalDuration: removed.duration,
        difficulty: removed.difficulty,
        icon: removed.icon,
      },
    ]);
    setSelectedCourses((prev) =>
      prev.filter((_, i) => i !== index).map((c, idx) => ({ ...c, order: idx }))
    );
  };

  const toggleLock = (index: number) => {
    setSelectedCourses((prev) =>
      prev.map((c, i) => (i === index ? { ...c, locked: !c.locked } : c))
    );
  };

  const save = async () => {
    try {
      const payload = { ...form, courses: selectedCourses };
      if (isEdit) {
        if (!existing?._id) return;
        await companyApiMethods.updateLearningPath(existing._id, payload);
        showSuccessToast("Learning path updated successfully!");
      } else {
        await companyApiMethods.addLearningPaths(payload);
        showSuccessToast("Learning path created successfully!");
      }
      onSaved();
    } catch (error) {
      console.error("Failed to save learning path:", error);
      showErrorToast("Failed to save learning path");
    }
  };

  const steps = [
    { number: 1, title: "Basic Info", icon: Target },
    { number: 2, title: "Add Courses", icon: BookOpen },
    { number: 3, title: "Review", icon: CheckCircle2 },
  ];

  return (
    <motion.div
      key="create"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto px-6 py-24"
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-300 hover:text-white mb-8 bg-white/5 border border-white/10 px-5 py-3 rounded-xl hover:bg-white/10 transition-all font-medium"
      >
        <ArrowLeft size={20} /> Back to Paths
      </button>

      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-bold mb-2">
          {isEdit ? "Edit Learning Path" : "Create Learning Path"}
        </h2>
        <p className="text-gray-400">
          {isEdit
            ? "Update your learning path details"
            : "Build a structured learning journey for your team"}
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-white/10">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <div
                key={step.number}
                className="flex flex-col items-center relative z-10"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${isActive
                      ? "bg-primary text-white scale-110 shadow-lg shadow-primary/50"
                      : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-white/10 text-gray-400"
                    }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <Icon size={24} />
                  )}
                </div>
                <p
                  className={`mt-2 text-sm font-medium ${isActive ? "text-white" : "text-gray-400"
                    }`}
                >
                  {step.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Path Title *
              </label>
              <input
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="e.g., Full Stack Development Journey"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Category *
              </label>
              <input
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="e.g., Software Development, Data Science"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                placeholder="Describe the learning path and what learners will achieve..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Difficulty Level *
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(["Beginner", "Intermediate", "Advanced"] as Difficulty[]).map(
                  (level) => (
                    <button
                      key={level}
                      onClick={() => setForm({ ...form, difficulty: level })}
                      className={`p-4 rounded-xl border-2 font-medium transition-all ${form.difficulty === level
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-white/5 border-white/20 hover:border-white/40"
                        }`}
                    >
                      {level}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Choose an Icon
              </label>
              <div className="flex gap-3 flex-wrap">
                {[
                  "📚",
                  "🎯",
                  "🚀",
                  "🧠",
                  "🎨",
                  "🌐",
                  "⚡",
                  "💻",
                  "🔬",
                  "📊",
                  "🎓",
                  "🏆",
                ].map((ico) => (
                  <button
                    key={ico}
                    onClick={() => setForm({ ...form, icon: ico })}
                    className={`text-3xl p-4 rounded-xl border-2 transition-all hover:scale-110 ${form.icon === ico
                        ? "bg-primary/30 border-primary shadow-lg shadow-primary/20"
                        : "bg-white/10 border-white/20 hover:border-white/40"
                      }`}
                  >
                    {ico}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Add Courses */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <BookOpen size={24} className="text-primary" />
                Available Courses
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Select courses from your purchased library
              </p>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-h-80 overflow-y-auto space-y-2">
                {companyCourses.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>All available courses have been added</p>
                  </div>
                ) : (
                  companyCourses.map((c) => (
                    <div
                      key={c._id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-white/10"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">{c.title}</h4>
                        <p className="text-sm text-gray-400 line-clamp-1">
                          {c.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                            {c.difficulty}
                          </span>
                          {c.totalDuration && (
                            <span className="text-xs px-2 py-1 bg-white/10 text-gray-300 rounded flex items-center gap-1">
                              <Clock size={12} />
                              {c.totalDuration}h
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => addCourse(c)}
                        className="ml-4 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-medium transition-all"
                      >
                        Add
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <GraduationCap size={24} className="text-green-400" />
                Selected Courses ({selectedCourses.length})
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Drag to reorder • Click lock icon to set prerequisites
              </p>

              {selectedCourses.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-400">
                    No courses selected yet. Add courses from above.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedCourses.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl hover:border-primary/40 transition-all"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 text-primary font-bold">
                        {i + 1}
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold">{c.title}</h4>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                            {c.difficulty}
                          </span>
                          {c.duration && (
                            <span className="text-xs px-2 py-1 bg-white/10 text-gray-300 rounded flex items-center gap-1">
                              <Clock size={12} />
                              {c.duration}h
                            </span>
                          )}
                          {c.locked && (
                            <span className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded flex items-center gap-1">
                              <Lock size={12} />
                              Locked
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleLock(i)}
                          className={`p-2 rounded-lg transition-all ${c.locked
                              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                              : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            }`}
                          title={c.locked ? "Unlock course" : "Lock course"}
                        >
                          {c.locked ? <Lock size={18} /> : <Unlock size={18} />}
                        </button>
                        <button
                          onClick={() => removeCourse(i)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Review Your Learning Path</h3>
              <p className="text-gray-400">
                Make sure everything looks good before saving
              </p>
            </div>

            {/* Path Overview */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-5xl">
                  {form.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold mb-2">{form.title}</h4>
                  <p className="text-gray-400 mb-4">{form.description}</p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm font-medium border border-primary/30">
                      {form.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm font-medium border border-green-400/30">
                      {form.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course List */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BookOpen className="text-primary" />
                Course Curriculum ({selectedCourses.length} courses)
              </h4>
              <div className="space-y-3">
                {selectedCourses.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-bold text-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold">{c.title}</h5>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                          {c.difficulty}
                        </span>
                        {c.duration && (
                          <span className="text-xs px-2 py-1 bg-white/10 text-gray-300 rounded">
                            {c.duration}h
                          </span>
                        )}
                        {c.locked && (
                          <span className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded flex items-center gap-1">
                            <Lock size={12} />
                            Locked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{selectedCourses.length}</p>
                <p className="text-sm text-gray-400">Total Courses</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <p className="text-2xl font-bold">
                  {selectedCourses.reduce((acc, c) => acc + (Number(c.duration) || 0), 0)}h
                </p>
                <p className="text-sm text-gray-400">Total Duration</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <Lock className="w-8 h-8 mx-auto mb-2 text-red-400" />
                <p className="text-2xl font-bold">
                  {selectedCourses.filter((c) => c.locked).length}
                </p>
                <p className="text-sm text-gray-400">Locked Courses</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="px-6 py-3 border border-white/20 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Previous
        </button>

        <div className="flex gap-3">
          {currentStep < 3 ? (
            <button
              onClick={() => {
                if (currentStep === 1 && (!form.title || !form.category)) {
                  showErrorToast("Please fill in all required fields");
                  return;
                }
                if (currentStep === 2 && selectedCourses.length === 0) {
                  showErrorToast("Please add at least one course");
                  return;
                }
                setCurrentStep((prev) => Math.min(3, prev + 1));
              }}
              className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl transition-all font-medium shadow-lg shadow-primary/20"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={save}
              disabled={!form.title || !form.category || selectedCourses.length === 0}
              className="px-8 py-3 bg-primary hover:bg-primary/90 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Save size={20} />
              {isEdit ? "Save Changes" : "Create Path"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------- Detail View ------------------------- */
function DetailView({
  path,
  onBack,
  onEdit,
}: {
  path: LearningPath;
  onBack: () => void;
  onEdit: () => void;
}) {
  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/20 text-green-300 border-green-400/30";
      case "Intermediate":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
      case "Advanced":
        return "bg-red-500/20 text-red-300 border-red-400/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-400/30";
    }
  };

  const totalDuration = path.courses.reduce(
    (acc, c) => acc + (Number(c.duration) || 0),
    0
  );
  const lockedCourses = path.courses.filter((c) => c.locked).length;

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto px-6 py-24"
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-300 hover:text-white mb-8 bg-white/5 border border-white/10 px-5 py-3 rounded-xl hover:bg-white/10 transition-all font-medium"
      >
        <ArrowLeft size={20} /> Back to Paths
      </button>

      {/* Header Card */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/10 rounded-2xl p-8 mb-8 backdrop-blur-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6 flex-1">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-6xl">
              {path.icon || "📚"}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3">{path.title}</h1>
              <p className="text-gray-300 text-lg mb-4 leading-relaxed">
                {path.description || "No description available"}
              </p>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-medium border ${getDifficultyColor(
                    path.difficulty
                  )}`}
                >
                  {path.difficulty}
                </span>
                <span className="px-4 py-2 rounded-lg text-sm font-medium bg-primary/20 text-primary border border-primary/30">
                  {path.category}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onEdit}
            className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg shadow-primary/20"
          >
            <Pencil size={18} />
            Edit Path
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Courses</p>
              <p className="text-3xl font-bold">{path.courses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Duration</p>
              <p className="text-3xl font-bold">{totalDuration}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Lock className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Locked Courses</p>
              <p className="text-3xl font-bold">{lockedCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Completion Rate</p>
              <p className="text-3xl font-bold">0%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Curriculum */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <GraduationCap className="text-primary" size={28} />
          Course Curriculum
        </h3>

        <div className="space-y-4">
          {path.courses.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-primary/40 transition-all group"
            >
              <div className="flex items-start gap-4">
                {/* Course Number */}
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary font-bold text-lg flex-shrink-0">
                  {i + 1}
                </div>

                {/* Course Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {c.title}
                    </h4>
                    {c.locked && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm font-medium border border-red-400/30">
                        <Lock size={14} />
                        Locked
                      </div>
                    )}
                  </div>

                  <p className="text-gray-400 mb-3 leading-relaxed">
                    {c.description || "No description available."}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(
                        c.difficulty
                      )}`}
                    >
                      {c.difficulty}
                    </span>
                    {c.duration && (
                      <span className="px-3 py-1 bg-white/10 text-gray-300 rounded-lg text-xs font-medium flex items-center gap-1">
                        <Clock size={12} />
                        {c.duration} hours
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar (placeholder) */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Progress</span>
                  <span className="text-sm font-medium">0%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "0%" }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Spacing */}
      <div className="h-20" />
    </motion.div>
  );
}

/* ------------------------- Empty State ------------------------- */
function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-32 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl"
    >
      <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
        <Sparkles className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-3xl font-bold mb-3">No Learning Paths Yet</h2>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        Create your first learning path to start building structured learning
        journeys for your team
      </p>
      <button
        onClick={onCreate}
        className="bg-primary hover:bg-primary/90 px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-105 inline-flex items-center gap-2"
      >
        <Plus size={20} />
        Create Your First Path
      </button>
    </motion.div>
  );
}

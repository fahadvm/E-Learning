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
} from "lucide-react";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { showErrorToast } from "@/utils/Toast";

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
    loadPaths();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-primary/5 to-slate-900" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-24 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
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
            />
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200]">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Delete This Path?</h3>
            <p className="text-sm text-gray-300 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm({ open: false, id: null })}
                className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={deletePath}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
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

  return (
    <motion.div
      key="list"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-6 py-20"
    >
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Learning Paths</h1>
        <button
          onClick={onCreate}
          className="px-5 py-2 bg-primary hover:bg-primary/80 rounded-xl flex items-center gap-2"
        >
          <Plus size={18} /> New Path
        </button>
      </div>

      {paths.length === 0 ? (
        <EmptyState onCreate={onCreate} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paths.map((p: LearningPath) => (
            <div
              key={p._id}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 hover:shadow-primary/20 shadow-lg transition backdrop-blur-xl"
            >
              <div className="flex justify-between">
                <span className="text-4xl">{p.icon || "📚"}</span>

                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="text-blue-300 hover:text-blue-400"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(p._id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div
                onClick={() => onViewDetail(p)}
                className="cursor-pointer mt-4"
              >
                <h3 className="text-xl font-semibold">{p.title}</h3>
                <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                  {p.description}
                </p>
                <div className="flex items-center gap-2 text-gray-400 text-sm mt-3">
                  <BookOpen size={16} /> {p.courses.length} courses
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
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

function CreateOrEditView({ isEdit, existing, onBack, onSaved }: CreateOrEditViewProps) {
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
        index === self.findIndex(x => x.courseId === c.courseId)
    );
  };

  const loadCourses = async () => {
    try {
      const res = await companyApiMethods.getmycourses();
      console.log("My courses response:", res.data);

      // Extract courses from orders
      const allCourses: CourseOption[] = [];

      if (res.data && Array.isArray(res.data)) {
       (res.data as CompanyOrder[]).forEach((order) => {
          if (order.purchasedCourses && Array.isArray(order.purchasedCourses)) {
            order.purchasedCourses.forEach((pc) => {
              if (pc.courseId) {
                allCourses.push({
                  _id: pc.courseId._id,
                  courseId: pc.courseId._id,
                  title: pc.courseId.title,
                  description: pc.courseId.subtitle || pc.courseId.description,
                  totalDuration: pc.courseId.totalDuration,
                  difficulty: (pc.courseId.difficulty || "Beginner") as Difficulty,
                  icon: "📚",
                });
              }
            });
          }
        });
      }

      // Filter out already selected courses
      const uniqueCourses = uniqueByCourseId(allCourses);

      // Filter out already selected courses
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

  const save = async () => {
    try {
      const payload = { ...form, courses: selectedCourses };
      if (isEdit) {
        if (!existing?._id) return;
        await companyApiMethods.updateLearningPath(existing._id, payload);
        alert("Learning path updated successfully!");
      } else {
        await companyApiMethods.addLearningPaths(payload);
        alert("Learning path created successfully!");
      }
      onSaved();
    } catch (error) {
      console.error("Failed to save learning path:", error);
      showErrorToast("Failed to save learning path");
    }
  };

  return (
    <motion.div
      key="create"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-6 py-20"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 bg-white/5 border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h2 className="text-3xl font-bold mb-6">
        {isEdit ? "Edit Learning Path" : "Create Learning Path"}
      </h2>

      <div className="space-y-4 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
        <input
          className="w-full p-3 bg-white/10 border border-white/20 rounded-xl placeholder-gray-300"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          className="w-full p-3 bg-white/10 border border-white/20 rounded-xl placeholder-gray-300"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <textarea
          className="w-full p-3 bg-white/10 border border-white/20 rounded-xl placeholder-gray-300"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <select
          className="w-full bg-white/10 border border-white/20 rounded-xl p-3"
          value={form.difficulty}
          onChange={(e) =>
            setForm({ ...form, difficulty: e.target.value as Difficulty })
          }
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <div className="flex gap-2 flex-wrap">
          {["📚", "🎯", "🚀", "🧠", "🎨", "🌐", "⚡"].map((ico) => (
            <button
              key={ico}
              onClick={() => setForm({ ...form, icon: ico })}
              className={`text-2xl p-2 rounded-lg border ${form.icon === ico
                ? "bg-primary/30 border-primary/80"
                : "bg-white/10 border-white/20"
                }`}
            >
              {ico}
            </button>
          ))}
        </div>
      </div>

      <h3 className="font-bold mt-8 mb-3 text-xl">Add Courses</h3>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-h-64 overflow-y-auto backdrop-blur-xl">
        {companyCourses.map((c) => (
          <div
            key={c._id}
            className="flex justify-between py-2 border-b border-white/10 text-gray-200"
          >
            <span>{c.title}</span>
            <button
              onClick={() => addCourse(c)}
              className="text-primary hover:text-primary/70 text-sm"
            >
              Add
            </button>
          </div>
        ))}
      </div>

      <h3 className="font-bold mt-8 mb-3 text-xl">Selected Courses</h3>
      {selectedCourses.map((c, i) => (
        <div
          key={i}
          className="flex justify-between bg-white/5 border border-white/10 p-3 rounded-xl mb-2 backdrop-blur-xl"
        >
          <span>
            {i + 1}. {c.title}
          </span>
          <button className="text-red-400" onClick={() => removeCourse(i)}>
            <X size={16} />
          </button>
        </div>
      ))}

      <div className="mt-8 flex justify-end">
        <button
          className="bg-primary px-6 py-2 rounded-xl disabled:opacity-50"
          disabled={!form.title || !form.category || selectedCourses.length === 0}
          onClick={save}
        >
          {isEdit ? "Save Changes" : "Create Path"}
        </button>
      </div>
    </motion.div>
  );
}

/* ------------------------- Detail View ------------------------- */
function DetailView({ path, onBack }: { path: LearningPath; onBack: () => void }) {
  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-6 py-20"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-300 hover:text-white mb-8 bg-white/5 border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Title + Icon */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">{path.title}</h1>
          <p className="text-gray-400 max-w-2xl">{path.description}</p>

          <div className="mt-4 flex gap-3 text-sm">
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-lg border border-primary/40">
              {path.difficulty}
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg border border-green-400/30">
              {path.category}
            </span>
          </div>
        </div>

        <div className="text-6xl">{path.icon || "📚"}</div>
      </div>

      {/* Divider */}
      <div className="border-b border-white/10 my-10" />

      {/* Course Structure */}
      <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <BookOpen size={22} /> Courses Included
      </h3>

      <div className="space-y-4">
        {path.courses.map((c, i) => (
          <div
            key={i}
            className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md hover:border-primary/40 transition"
          >
            <div className="flex justify-between">
              <div>
                <h4 className="text-lg font-semibold">
                  {i + 1}. {c.title}
                </h4>
                <p className="text-gray-400 text-sm mt-1">
                  {c.description || "No description available."}
                </p>
                <div className="flex gap-3 mt-2 text-sm">
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-lg border border-primary/30">
                    {c.difficulty}
                  </span>
                  {c.locked && (
                    <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg border border-red-400/30">
                      Locked
                    </span>
                  )}
                </div>
              </div>

              <div className="text-gray-300 text-sm mt-1">
                <span className="font-semibold">Duration:</span>{" "}
                {c.duration || "N/A"} hrs
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Spacing */}
      <div className="h-20" />
    </motion.div>
  );
}

/* ------------------------- Empty State ------------------------- */
function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="text-center py-28">
      <Sparkles className="mx-auto w-14 h-14 text-primary mb-4" />
      <h2 className="text-xl font-semibold mb-2">No Learning Paths Yet</h2>
      <button
        onClick={onCreate}
        className="mt-4 bg-primary/80 hover:bg-primary px-5 py-2 rounded-xl"
      >
        Create One
      </button>
    </div>
  );
}

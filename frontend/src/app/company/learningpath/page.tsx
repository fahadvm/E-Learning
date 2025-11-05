"use client";

import { useEffect, useState } from "react";
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

/* ------------------------- Types ------------------------- */
type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface CourseOption {
  _id: string;
  title: string;
  description?: string;
  totalDuration?: number;
  difficulty: Difficulty;
  icon?: string;
}

interface CourseInPath {
  title: string;
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
  const [activeTab, setActiveTab] = useState<"list" | "create" | "detail" | "edit">("list");
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  const loadPaths = async () => {
    const res = await companyApiMethods.getLearningPath();
    console.log("paths :",res.data)
    setPaths(res.data || []);
    setTotalPages(res.data?.totalPages || 1);
  };

  useEffect(() => {
    loadPaths();
  }, [page]);

  const deletePath = async () => {
    if (!deleteConfirm.id) return
    await companyApiMethods.deleteLearningPath(deleteConfirm.id);
    setDeleteConfirm({ open: false, id: null });
    loadPaths();
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
            <p className="text-sm text-slate-600 mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm({ open: false, id: null })}
                className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={deletePath} className="px-4 py-2 bg-red-600 text-white rounded-lg">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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
          <DetailView path={selectedPath} onBack={() => setActiveTab("list")} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------- List View ------------------------- */
function ListView({
  paths,
  page,
  totalPages,
  onPageChange,
  onCreate,
  onViewDetail,
  onEdit,
  onDelete,
}: {
  paths: LearningPath[];
  page: number;
  totalPages: number;
  onPageChange: (v: number) => void;
  onCreate: () => void;
  onViewDetail: (p: LearningPath) => void;
  onEdit: (p: LearningPath) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-6 py-10 max-w-7xl">

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Learning Paths</h1>
        <button
          onClick={onCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={18} /> New
        </button>
      </div>

      {paths.length === 0 ? (
        <EmptyState onCreate={onCreate} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((p) => (
            <div key={p._id} className="p-6 bg-white rounded-2xl border hover:shadow-lg transition">

              <div className="flex justify-between">
                <span className="text-3xl">{p.icon || "📚"}</span>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(p)} className="text-blue-600 hover:text-blue-800">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => onDelete(p._id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div onClick={() => onViewDetail(p)} className="cursor-pointer">
                <h3 className="font-semibold text-lg mt-3">{p.title}</h3>
                <p className="text-slate-600 text-sm mb-3 line-clamp-2">{p.description}</p>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <BookOpen size={16} /> {p.courses.length} courses
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-2">
          <button disabled={page === 1} onClick={() => onPageChange(page - 1)}
            className="px-4 py-2 bg-white border rounded-lg">Prev</button>

          <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)}
            className="px-4 py-2 bg-white border rounded-lg">Next</button>
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------- Create / Edit View ------------------------- */
function CreateOrEditView({
  isEdit,
  existing,
  onBack,
  onSaved,
}: {
  isEdit: boolean;
  existing: LearningPath | null;
  onBack: () => void;
  onSaved: () => void;
}) {
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

  /* Load courses & remove ones already selected */
  const loadCourses = async () => {
    const res = await companyApiMethods.getmycourses();
    const raw = res.data?.flatMap((x: any) => x.courses) || [];

    // Remove courses already selected → ✅ No duplicates
    const filtered = raw.filter(
      (course: CourseOption) =>
        !selectedCourses.some((c) => c.title === course.title)
    );
    setCompanyCourses(filtered);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const addCourse = (course: CourseOption) => {
    const newCourse: CourseInPath = {
      title: course.title,
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

    // Return course back to available list
    setCompanyCourses((prev) => [
      ...prev,
      {
        _id: Date.now().toString(),
        title: removed.title,
        description: removed.description,
        difficulty: removed.difficulty,
        icon: removed.icon,
      },
    ]);

    setSelectedCourses((prev) =>
      prev.filter((_, i) => i !== index).map((c, idx) => ({ ...c, order: idx }))
    );
  };

  const save = async () => {
    const payload = { ...form, courses: selectedCourses };
    if (isEdit) {
      if (!existing?._id) return
      await companyApiMethods.updateLearningPath(existing?._id, payload);
    }
    else {
      await companyApiMethods.addLearningPaths(payload);
    }

    onSaved();
  };

  return (
    <motion.div key="create" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="container mx-auto px-6 py-8 max-w-3xl">

      <button onClick={onBack} className="flex items-center gap-2 text-slate-600 mb-6">
        <ArrowLeft size={18} /> Back
      </button>

      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit Learning Path" : "Create Learning Path"}
      </h2>

      <div className="space-y-4 bg-white p-6 rounded-2xl border">
        <input className="form-input" placeholder="Title" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} />

        <input className="form-input" placeholder="Category" value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })} />

        <textarea className="form-textarea" placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <select
          className="w-full border rounded-lg p-2"
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
            <button key={ico} onClick={() => setForm({ ...form, icon: ico })}
              className={`text-2xl p-2 rounded-lg border ${form.icon === ico ? "bg-indigo-100 border-indigo-500" : "bg-white"
                }`}>
              {ico}
            </button>
          ))}
        </div>
      </div>

      <h3 className="font-bold mt-8 mb-3">Add Courses</h3>
      <div className="bg-white rounded-2xl border p-6 max-h-64 overflow-y-auto">
        {companyCourses.map((c) => (
          <div key={c._id} className="flex justify-between py-2 border-b">
            <span>{c.title}</span>
            <button onClick={() => addCourse(c)} className="text-indigo-600 text-sm">
              Add
            </button>
          </div>
        ))}
      </div>

      <h3 className="font-bold mt-8 mb-3">Selected Courses (Order)</h3>
      {selectedCourses.map((c, i) => (
        <div key={i} className="flex justify-between bg-white border p-3 rounded-lg mb-2">
          <span>{i + 1}. {c.title}</span>
          <button className="text-red-600" onClick={() => removeCourse(i)}>
            <X size={16} />
          </button>
        </div>
      ))}

      <div className="mt-8 flex justify-end">
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl disabled:opacity-50"
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
    <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="container mx-auto px-6 py-8 max-w-4xl">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-600 mb-6">
        <ArrowLeft size={18} /> Back
      </button>

      <h1 className="text-3xl font-bold mb-2">{path.title}</h1>
      <p className="text-slate-600 mb-6">{path.description}</p>

      <h3 className="font-semibold mb-4 text-lg">Course Structure</h3>
      {path.courses.map((c, i) => (
        <div key={i} className="p-4 bg-white rounded-xl border mb-2">
          <h4 className="font-semibold">{i + 1}. {c.title}</h4>
          <p className="text-sm text-slate-600">{c.duration || "No duration"}</p>
          {c.locked && <span className="text-xs text-red-500">Locked</span>}
        </div>
      ))}
    </motion.div>
  );
}

/* ------------------------- Empty State ------------------------- */
function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="text-center py-28">
      <Sparkles className="mx-auto w-14 h-14 text-indigo-400 mb-4" />
      <h2 className="text-xl font-semibold mb-2">No Learning Paths Yet</h2>
      <button onClick={onCreate} className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-xl">
        Create One
      </button>
    </div>
  );
}

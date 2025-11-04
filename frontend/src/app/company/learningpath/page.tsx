"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Star,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  Lock,
  Trash2,
  Edit,
  Clock,
  Target,
  MapPin,
} from "lucide-react";
import Header from "@/components/company/Header";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";
import { companyApiMethods } from "@/services/APIservices/companyApiService";

interface Course {
  title: string;
  description?: string;
  duration?: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  icon?: string;
  locked?: boolean;
}

interface LearningPath {
  _id: string;
  title: string;
  description?: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  icon: string;
  courses: Course[];
}

export default function LearningPathsPage() {
  const [activeTab, setActiveTab] = useState<"list" | "create" | "view">("list");
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);

  // Form States
  const [newPath, setNewPath] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    icon: "🎯",
  });

  const [newCourses, setNewCourses] = useState<Course[]>([
    { title: "", duration: "1 week", difficulty: "Beginner", icon: "📚" },
  ]);

  const icons = ["🎨", "🚀", "⚡", "🧙", "🥷", "🦸", "🎯", "🌟", "🛠️", "💻", "🎮", "📱"];

  // Fetch Learning Paths
  useEffect(() => {
    fetchPaths();
  }, []);

  const fetchPaths = async () => {
    const res = await companyApiMethods.getLearingPaths()
    console.log("consolled fetchpaths" , res)
    setPaths(res.data);
  };

  const createPath = async () => {
    const payload = { ...newPath, courses: newCourses.filter((c) => c.title !== "") };
    await companyApiMethods.addLearingPaths(payload)
    fetchPaths();
    setActiveTab("list");
  };

  const deletePath = async (id: string) => {
    await companyApiMethods.deleteLearingPaths(id)
    fetchPaths();
    setSelectedPath(null);
    setActiveTab("list");
  };

  const addCourse = () => {
    setNewCourses([...newCourses, { title: "", difficulty: "Beginner", duration: "1 week", icon: "📚" }]);
  };

  const updateCourse = (index: number, field: keyof Course, value: string) => {
    const updated = [...newCourses];
    // @ts-ignore
    updated[index][field] = value;
    setNewCourses(updated);
  };

  const removeCourse = (index: number) => {
    setNewCourses(newCourses.filter((_, i) => i !== index));
  };

  const getDifficultyColor = (d: string) => {
    const colors: Record<string, string> = {
      Beginner: "bg-emerald-100 text-emerald-700 border-emerald-300",
      Intermediate: "bg-amber-100 text-amber-700 border-amber-300",
      Advanced: "bg-rose-100 text-rose-700 border-rose-300",
    };
    return colors[d] || "";
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pt-20">
        <div className="max-w-7xl mx-auto px-4">

          {/* Title */}
          <div className="text-center py-12">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 flex items-center justify-center gap-3">
              Learning Quest Hub
              <Sparkles className="w-10 h-10 text-amber-400" />
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-6 py-3 rounded-xl font-semibold transition ${activeTab === "list"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-700 shadow"
                }`}
            >
              <Star className="w-5 h-5 inline-block mr-2" /> All Paths
            </button>

            <button
              onClick={() => setActiveTab("create")}
              className={`px-6 py-3 rounded-xl font-semibold transition ${activeTab === "create"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                  : "bg-white text-gray-700 shadow"
                }`}
            >
              <Plus className="w-5 h-5 inline-block mr-2" /> Create Path
            </button>
          </div>

          {/* LIST */}
          {activeTab === "list" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paths.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <MapPin className="w-24 h-24 mx-auto text-gray-300" />
                  <p className="text-lg text-gray-500 mt-4">No learning paths yet.</p>
                </div>
              )}

              {paths.map((path) => (
                <div
                  key={path._id}
                  onClick={() => {
                    setSelectedPath(path);
                    setActiveTab("view");
                  }}
                  className="group bg-white p-6 rounded-2xl shadow hover:shadow-xl cursor-pointer transition"
                >
                  <div className="flex justify-between mb-4">
                    <div className="text-5xl">{path.icon}</div>
                    <span className={`px-3 py-1 text-xs rounded-full border ${getDifficultyColor(path.difficulty)}`}>
                      {path.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{path.title}</h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{path.description}</p>
                  <button className="mt-4 w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg flex justify-center gap-2">
                    View <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* CREATE */}
          {activeTab === "create" && (
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow">
              <h2 className="text-3xl font-bold text-center text-emerald-700 mb-6">Create Learning Path</h2>

              {/* Path Form */}
              <div className="grid md:grid-cols-2 gap-6">
                <input className="form-input" placeholder="Title" value={newPath.title} onChange={(e) => setNewPath({ ...newPath, title: e.target.value })} />
                <input className="form-input" placeholder="Category" value={newPath.category} onChange={(e) => setNewPath({ ...newPath, category: e.target.value })} />
              </div>
              <textarea className="form-input mt-4 h-24" placeholder="Description" value={newPath.description} onChange={(e) => setNewPath({ ...newPath, description: e.target.value })} />

              <button className="action-btn mt-6" onClick={createPath}>
                <Sparkles className="mr-2" /> Create
              </button>
            </div>
          )}

          {/* VIEW */}
          {activeTab === "view" && selectedPath && (
            <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow">
              <button onClick={() => setActiveTab("list")} className="flex items-center gap-2 text-indigo-600 mb-6">
                <ArrowLeft /> Back
              </button>

              <h1 className="text-3xl font-bold flex items-center gap-3">{selectedPath.icon} {selectedPath.title}</h1>

              <button onClick={() => deletePath(selectedPath._id)} className="p-2 bg-red-500 text-white rounded-lg mt-4">
                <Trash2 />
              </button>

              <h3 className="text-2xl font-bold mt-8 flex items-center gap-2">
                <Target /> Course Journey
              </h3>

              <div className="mt-6 space-y-6">
                {selectedPath.courses.map((c, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${c.locked ? "opacity-60" : ""}`}>
                    <div className="flex justify-between">
                      <span className="text-3xl">{c.icon}</span>
                      {c.locked ? <Lock /> : <CheckCircle className="text-emerald-500" />}
                    </div>
                    <h4 className="text-lg font-bold">{c.title}</h4>
                    <p className="text-sm text-gray-600">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

'use client';

import { useState } from 'react';
import {
  Plus, Edit, Trash2, Lock, CheckCircle, Clock, Star, ChevronRight,
  Sparkles, ArrowLeft, Trophy, MapPin, Target
} from 'lucide-react';
import Header from '@/components/company/Header';

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: string;
  completed?: boolean;
  locked?: boolean;
}

interface LearningPath {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: string;
  courses: Course[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'view'>('list');
  const [paths, setPaths] = useState<LearningPath[]>([
    {
      id: 1,
      title: 'Frontend Wizardry',
      description: 'Master the art of beautiful web interfaces!',
      category: 'Web Development',
      difficulty: 'Intermediate',
      icon: '🎨',
      courses: [
        { id: 1, title: 'HTML Magic', description: 'Build with blocks!', duration: '1 week', difficulty: 'Beginner', icon: '🏗️', completed: true },
        { id: 2, title: 'CSS Rainbows', description: 'Paint the web!', duration: '2 weeks', difficulty: 'Beginner', icon: '🌈', completed: true },
        { id: 3, title: 'JS Adventures', description: 'Make it interactive!', duration: '3 weeks', difficulty: 'Intermediate', icon: '⚡', completed: true },
        { id: 4, title: 'React Rocket', description: 'Launch components!', duration: '4 weeks', difficulty: 'Intermediate', icon: '🚀', completed: false },
        { id: 5, title: 'Next.js Ninja', description: 'Server-side sorcery!', duration: '5 weeks', difficulty: 'Advanced', icon: '🥷', completed: false, locked: true },
      ],
    },
    {
      id: 2,
      title: 'Backend Quest',
      description: 'Build powerful servers and APIs!',
      category: 'Backend',
      difficulty: 'Intermediate',
      icon: '🛠️',
      courses: [
        { id: 1, title: 'Node.js Basics', description: 'Hello Server!', duration: '2 weeks', difficulty: 'Beginner', icon: '🖥️', completed: true },
        { id: 2, title: 'Express Routes', description: 'Build API paths!', duration: '2 weeks', difficulty: 'Intermediate', icon: '🛤️', completed: false },
        { id: 3, title: 'Database Magic', description: 'Store treasures!', duration: '3 weeks', difficulty: 'Intermediate', icon: '💎', completed: false, locked: true },
        { id: 4, title: 'Auth Fortress', description: 'Secure your kingdom!', duration: '3 weeks', difficulty: 'Advanced', icon: '🔐', completed: false, locked: true },
      ],
    },
  ]);

  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);

  // Create Form State
  const [newPath, setNewPath] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    icon: '🎯',
  });

  const [newCourses, setNewCourses] = useState<Course[]>([
    { id: 1, title: '', description: '', duration: '1 week', difficulty: 'Beginner', icon: '📚' },
  ]);

  const icons = ['🎨', '🚀', '⚡', '🧙', '🥷', '🦸', '🎯', '🌟', '🛠️', '💻', '🎮', '📱'];

  const addCourse = () => {
    setNewCourses([...newCourses, {
      id: newCourses.length + 1,
      title: '',
      description: '',
      duration: '1 week',
      difficulty: 'Beginner',
      icon: '📚',
    }]);
  };

  const removeCourse = (index: number) => {
    setNewCourses(newCourses.filter((_, i) => i !== index));
  };

  const updateCourse = (index: number, field: keyof Course, value: string) => {
    const updated = [...newCourses];
    // @ts-ignore
    updated[index][field] = value;
    setNewCourses(updated);
  };

  const createPath = () => {
    if (!newPath.title || !newPath.category || !newCourses.some(c => c.title)) return;

    const validCourses = newCourses.filter(c => c.title);
    const path: LearningPath = {
      id: paths.length + 1,
      ...newPath,
      courses: validCourses.map((c, i) => ({
        ...c,
        id: i + 1,
        completed: false,
        locked: i > 0,
      })),
    };

    setPaths([...paths, path]);
    setActiveTab('list');
    resetCreateForm();
  };

  const resetCreateForm = () => {
    setNewPath({ title: '', description: '', category: '', difficulty: 'Beginner', icon: '🎯' });
    setNewCourses([{ id: 1, title: '', description: '', duration: '1 week', difficulty: 'Beginner', icon: '📚' }]);
  };

  const deletePath = (id: number) => {
    setPaths(paths.filter(p => p.id !== id));
    if (selectedPath?.id === id) {
      setSelectedPath(null);
      setActiveTab('list');
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'Intermediate': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Advanced': return 'bg-rose-100 text-rose-700 border-rose-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };



  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Header */}
          <div className="text-center py-12">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 flex items-center justify-center gap-3">
              Learning Quest Hub
              <Sparkles className="w-10 h-10 text-amber-400" />
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-gray-700">Choose your path. Master your craft. Level up.</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                activeTab === 'list'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 shadow-md hover:shadow-lg'
              }`}
            >
              <Star className="w-5 h-5" /> All Paths
            </button>
            <button
              onClick={() => { setActiveTab('create'); resetCreateForm(); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 shadow-md hover:shadow-lg'
              }`}
            >
              <Plus className="w-5 h-5" /> Create Path
            </button>
          </div>

          {/* TAB 1: LIST OF PATHS */}
          {activeTab === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paths.map((path) => (
                <div
                  key={path.id}
                  onClick={() => { setSelectedPath(path); setActiveTab('view'); }}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-200 p-6 cursor-pointer transition-all hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{path.icon}</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(path.difficulty)}`}>
                      {path.difficulty}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2">{path.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{path.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{path.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> 5 courses
                    </span>
                  </div>

                

                  <button className="mt-4 w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:shadow-md transition-all">
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {paths.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <MapPin className="w-24 h-24 mx-auto text-gray-300 mb-6" />
                  <p className="text-xl text-gray-500 mb-6">No learning paths yet.</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Create Your First Path
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CREATE PATH */}
          {activeTab === 'create' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-3xl font-bold text-center text-emerald-700 mb-8">Create a New Learning Path</h2>

                <div className="space-y-6">
                  {/* Path Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Path Title *</label>
                      <input
                        type="text"
                        placeholder="e.g., Full-Stack Mastery"
                        value={newPath.title}
                        onChange={(e) => setNewPath({ ...newPath, title: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                      <input
                        type="text"
                        placeholder="e.g., Web, AI, Design"
                        value={newPath.category}
                        onChange={(e) => setNewPath({ ...newPath, category: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      placeholder="What will learners achieve?"
                      value={newPath.description}
                      onChange={(e) => setNewPath({ ...newPath, description: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition h-24 resize-none"
                    />
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                      <select
                        value={newPath.difficulty}
                        onChange={(e) => setNewPath({ ...newPath, difficulty: e.target.value as any })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Icon</label>
                      <div className="flex gap-2 flex-wrap">
                        {icons.map((icon) => (
                          <button
                            key={icon}
                            onClick={() => setNewPath({ ...newPath, icon })}
                            className={`text-2xl p-2 rounded-lg transition-all ${
                              newPath.icon === icon
                                ? 'bg-emerald-500 text-white shadow-md scale-110'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Courses */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800">Courses</h3>
                      <button
                        onClick={addCourse}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                      >
                        <Plus className="w-4 h-4" /> Add Course
                      </button>
                    </div>

                    <div className="space-y-5">
                      {newCourses.map((course, index) => (
                        <div key={index} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-200">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold text-indigo-700">Course #{index + 1}</span>
                            {newCourses.length > 1 && (
                              <button
                                onClick={() => removeCourse(index)}
                                className="text-red-500 hover:text-red-700 transition"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Course Title"
                              value={course.title}
                              onChange={(e) => updateCourse(index, 'title', e.target.value)}
                              className="px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none"
                            />
                            <input
                              type="text"
                              placeholder="Duration (e.g., 2 weeks)"
                              value={course.duration}
                              onChange={(e) => updateCourse(index, 'duration', e.target.value)}
                              className="px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none"
                            />
                          </div>

                          <textarea
                            placeholder="What will students learn?"
                            value={course.description}
                            onChange={(e) => updateCourse(index, 'description', e.target.value)}
                            className="w-full mt-3 px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none h-20 resize-none"
                          />

                          <div className="flex gap-3 mt-3">
                            <select
                              value={course.difficulty}
                              onChange={(e) => updateCourse(index, 'difficulty', e.target.value)}
                              className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
                            >
                              <option>Beginner</option>
                              <option>Intermediate</option>
                              <option>Advanced</option>
                            </select>
                            <div className="flex gap-1">
                              {icons.slice(0, 6).map((icon) => (
                                <button
                                  key={icon}
                                  onClick={() => updateCourse(index, 'icon', icon)}
                                  className={`text-xl p-1.5 rounded-lg transition ${
                                    course.icon === icon ? 'bg-indigo-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                                  }`}
                                >
                                  {icon}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center pt-6">
                    <button
                      onClick={createPath}
                      disabled={!newPath.title || !newPath.category || !newCourses.some(c => c.title)}
                      className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                    >
                      <Sparkles className="w-5 h-5" /> Launch Path
                    </button>
                    <button
                      onClick={() => setActiveTab('list')}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VIEW PATH DETAILS */}
          {activeTab === 'view' && selectedPath && (
            <div className="max-w-5xl mx-auto">
              <button
                onClick={() => setActiveTab('list')}
                className="mb-6 flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800 transition"
              >
                <ArrowLeft className="w-5 h-5" /> Back to Paths
              </button>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="text-6xl">{selectedPath.icon}</div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-800">{selectedPath.title}</h1>
                      <p className="text-lg text-indigo-600 font-medium">{selectedPath.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deletePath(selectedPath.id)}
                      className="p-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 mb-8">{selectedPath.description}</p>

                

                <h3 className="text-2xl font-bold text-center text-indigo-700 mb-8 flex items-center justify-center gap-2">
                  <Target className="w-7 h-7" /> Course Journey
                </h3>

                {/* Timeline */}
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-300 to-purple-300 hidden md:block" />

                  <div className="space-y-10">
                    {selectedPath.courses.map((course, index) => (
                      <div
                        key={course.id}
                        className="relative flex items-center"
                      >
                        <div className="absolute left-8 w-4 h-4 bg-white rounded-full border-4 border-indigo-500 shadow z-10 hidden md:block -translate-x-1/2" />

                        <div className="ml-16 w-full">
                          <div className={`bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl border ${course.locked ? 'opacity-60' : ''}`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-4xl">{course.icon}</div>
                              {course.completed ? (
                                <span className="flex items-center gap-1 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                                  <CheckCircle className="w-4 h-4" /> Completed
                                </span>
                              ) : course.locked ? (
                                <div className="p-2 bg-gray-400 text-white rounded-full">
                                  <Lock className="w-4 h-4" />
                                </div>
                              ) : (
                                <button className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium text-sm hover:shadow transition">
                                  Start →
                                </button>
                              )}
                            </div>

                            <h4 className="text-lg font-bold text-gray-800 mb-1">{course.title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{course.description}</p>

                            <div className="flex gap-3 text-xs">
                              <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
                                {course.duration}
                              </span>
                              <span className={`px-3 py-1 rounded-full font-medium border ${getDifficultyColor(course.difficulty)}`}>
                                {course.difficulty}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
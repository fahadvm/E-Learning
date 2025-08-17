'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Header from "@/componentssss/company/Header";

interface ILesson {
  title: string;
  content?: string;
  videoUrl?: string;
  duration?: string;
  isLocked?: boolean;
}

interface IModule {
  title: string;
  description?: string;
  lessons: ILesson[];
}

interface ICourse {
  _id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  price?: string;
  coverImage?: string;
  modules: IModule[];
  createdAt?: string;
  rating?: number;
  enrolledCount?: number;
  duration?: string;
  whatYouWillLearn?: string[];
  teacher?: {
    name: string;
    profileImage?: string;
  };
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [openModule, setOpenModule] = useState<number | null>(0);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/company/course/${id}`,
        { withCredentials: true }
      );
      setCourse(res.data.data);
    } catch (err) {
      console.error('Failed to fetch course', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCourse();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-xl font-semibold text-gray-600 animate-pulse">Loading...</div>
    </div>
  );
  if (!course) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-xl font-semibold text-red-500">Course not found.</div>
    </div>
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-12 px-4 mt-10 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <h2 className="text-4xl font-bold text-gray-900 mb-3">{course.title.toUpperCase()}</h2>
                <p className="text-gray-600 leading-relaxed mb-4">{course.description}</p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                  <span>Created by <strong>{course.teacher?.name ?? 'Instructor'}</strong></span>
                  <span>·</span>
                  <span>{course.duration ?? 'N/A'} to complete</span>
                  <span>·</span>
                  <span>{course.modules.length} Modules</span>
                  <span>·</span>
                  <span className="text-yellow-500">⭐ {course.rating ?? 4.8}</span>
                </div>
                <div className="flex gap-3 mt-4">
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {course.level}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {course.category}
                  </span>
                </div>
              </div>
              <div className="lg:w-1/3 bg-gray-50 rounded-xl p-6 flex flex-col gap-4">
                <img
                  src={course.coverImage ?? '/placeholder-course.jpg'}
                  alt={course.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="text-2xl font-bold text-gray-900">₹{course.price ?? 'Free'}</div>
                <button className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium">
                  Buy Course Now
                </button>
                <button className="w-full border border-gray-300 text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Add to Cart
                </button>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>👥 {course.enrolledCount ?? 0} Enrolled</p>
                  <p>📚 {course.modules.length} Lessons</p>
                  <p>⚡ Level: {course.level}</p>
                </div>
              </div>
            </div>
          

          {/* What You'll Learn */}
          {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">What You'll Learn</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {course.whatYouWillLearn.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✔️</span>
                    <p className="text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modules and Lessons */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Course Content</h3>
            <div className="space-y-4">
              {course.modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenModule(openModule === moduleIndex ? null : moduleIndex)}
                    className="w-full flex justify-between items-center p-4 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <span className="text-lg font-semibold text-gray-900">{module.title}</span>
                    <svg
                      className={`w-5 h-5 text-gray-600 transform transition-transform ${openModule === moduleIndex ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openModule === moduleIndex && (
                    <div className="p-4 space-y-3 animate-slide-down">
                      {module.description && (
                        <p className="text-gray-600 text-sm">{module.description}</p>
                      )}
                      <ul className="space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <li key={lessonIndex} className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">{lesson.isLocked ? '🔒' : '🔒'}</span>
                                <span className="text-gray-800">{lesson.title}</span>
                              </div>
                              <span className="text-sm text-gray-500">{lesson.duration ?? ''}</span>
                            </div>
                            {lesson.content && (
                              <p className="text-sm text-gray-600 ml-6">{lesson.content}</p>
                            )}
                            
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
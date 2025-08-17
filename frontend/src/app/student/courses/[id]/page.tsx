'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Header from '@/componentssss/student/header'


// Interfaces
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
        `${process.env.NEXT_PUBLIC_API_URL}/auth/student/course/${id}`,
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

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!course) return <div className="p-10 text-center">Course not found.</div>;

  return (
        <>
          <Header />
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold mb-2">{course.title.toUpperCase()}</h2>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <p className="text-sm text-gray-500">
            Created by <strong>{course.teacher?.name ?? 'Instructor'}</strong> · {course.duration ?? 'N/A'} to complete ·{' '}
            {course.modules.length} Modules ·{' '}
            <span className="text-yellow-500">⭐ {course.rating ?? 4.8}</span>
          </p>
        </div>
        <div className="md:w-1/3 border p-4 rounded shadow-md">
          <img
            src={course.coverImage ?? '/placeholder-course.jpg'}
            alt={course.title}
            width={400}
            height={250}
            className="w-full h-auto rounded"
          />
          <div className="text-xl font-bold mt-4">₹{course.price ?? 0}</div>
          <button className="bg-indigo-600 w-full text-white px-4 py-2 mt-3 rounded hover:bg-indigo-700 transition">
            Buy Course Now
          </button>
          <button className="border w-full border-gray-400 px-4 py-2 mt-2 rounded hover:bg-gray-100 transition">
            Add to Cart
          </button>
          <div className="text-sm text-gray-600 mt-4">
            <p>👥 {course.enrolledCount ?? 0} Enrolled</p>
            <p>📚 {course.modules.length} Lessons</p>
            <p>⚡ Level: {course.level}</p>
          </div>
        </div>
      </div>

      {/* What You'll Learn */}
      {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-4">What You'll Learn</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {course.whatYouWillLearn.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-indigo-600">✔️</span>
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modules and Lessons */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-6">Course Content</h3>
        {course.modules.map((module, moduleIndex) => (
          <div key={moduleIndex} className="border rounded mb-4">
            <div
              className="cursor-pointer px-4 py-3 font-medium bg-gray-100 flex justify-between"
              onClick={() => setOpenModule(openModule === moduleIndex ? null : moduleIndex)}
            >
              <span>{module.title}</span>
              <span>{openModule === moduleIndex ? '▲' : '▼'}</span>
            </div>
            {openModule === moduleIndex && (
              <ul className="px-4 py-2">
                {module.lessons.map((lesson, lessonIndex) => (
                  <li key={lessonIndex} className="flex items-center gap-2 py-1">
                    {lesson.isLocked ? '🔒' : '🔒'} {lesson.title}{' '}
                    <span className="ml-auto text-sm text-gray-500">{lesson.duration ?? ''}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
            </>

  );
}

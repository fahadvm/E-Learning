'use client';

import { useRouter } from 'next/navigation';
import { useCourse } from '@/context/CourseContext';
import { useState } from 'react';
import axios from 'axios';

interface Lesson {
  title: string;
  content: string;
  videoFile?: File | null;
}

interface Module {
  title: string;
  description?: string;
  lessons: Lesson[];
}

const AddModulesPage = () => {
  const router = useRouter();
  const { courseInfo } = useCourse();
  const [modules, setModules] = useState<Module[]>([
    { title: '', description: '', lessons: [{ title: '', content: '', videoFile: null }] },
  ]);

 const handleModuleChange = (index: number, field: keyof Module, value: string) => {
  const updated = [...modules];

  if (field === 'title' || field === 'description') {
    updated[index][field] = value;
    setModules(updated);
  }
};


  const handleLessonChange = (
    moduleIndex: number,
    lessonIndex: number,
    field: keyof Lesson,
    value: string | File | null
  ) => {
    const updated = [...modules];
    (updated[moduleIndex].lessons[lessonIndex] as any)[field] = value;
    setModules(updated);
  };

  const addModule = () => {
    setModules([...modules, { title: '', description: '', lessons: [{ title: '', content: '', videoFile: null }] }]);
  };

  const addLesson = (moduleIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons.push({ title: '', content: '', videoFile: null });
    setModules(updated);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', courseInfo.courseName);
    formData.append('description', courseInfo.courseDescription);
    formData.append('level', courseInfo.courseLevel);
    formData.append('category', courseInfo.courseCategory);
    formData.append('price', courseInfo.price);
    if (courseInfo.coverImage) formData.append('coverImage', courseInfo.coverImage);

    // Prepare structured JSON for modules and lessons
    const modulesData = modules.map((module, moduleIndex) => ({
      title: module.title,
      description: module.description,
      lessons: module.lessons.map((lesson, lessonIndex) => ({
        title: lesson.title,
        content: lesson.content,
        videoKey: `video-${moduleIndex}-${lessonIndex}`,
      })),
    }));

    formData.append('modules', JSON.stringify(modulesData));

    // Append video files
    modules.forEach((module, moduleIndex) => {
      module.lessons.forEach((lesson, lessonIndex) => {
        if (lesson.videoFile) {
          formData.append(`video-${moduleIndex}-${lessonIndex}`, lesson.videoFile);
        }
      });
    });

    try {
      await axios.post( `${process.env.NEXT_PUBLIC_API_URL}/auth/teacher/add-course`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true, 
      });
      router.push('/teacher/courses');
    } catch (error: any) {
      console.error('Course creation failed:', error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-4xl  mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add Modules and Lessons (2/2)</h1>

      {modules.map((module, moduleIndex) => (
        <div key={moduleIndex} className="mb-6 p-4 border border-gray-300 rounded-md shadow">
          <h2 className="text-lg font-semibold mb-2">Module {moduleIndex + 1}</h2>
          <input
            type="text"
            placeholder="Module Title"
            value={module.title}
            onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
            className="block w-full border p-2 rounded mb-2"
          />
          <textarea
            placeholder="Module Description"
            value={module.description}
            onChange={(e) => handleModuleChange(moduleIndex, 'description', e.target.value)}
            className="block w-full border p-2 rounded mb-4"
          />

          <div className="ml-4">
            {module.lessons.map((lesson, lessonIndex) => (
              <div key={lessonIndex} className="mb-4 p-3 border rounded ">
                <h3 className="font-semibold mb-1">Lesson {lessonIndex + 1}</h3>
                <input
                  type="text"
                  placeholder="Lesson Title"
                  value={lesson.title}
                  onChange={(e) =>
                    handleLessonChange(moduleIndex, lessonIndex, 'title', e.target.value)
                  }
                  className="block w-full border p-2 rounded mb-1"
                />
                <textarea
                  placeholder="Lesson Content"
                  value={lesson.content}
                  onChange={(e) =>
                    handleLessonChange(moduleIndex, lessonIndex, 'content', e.target.value)
                  }
                  className="block w-full border p-2 rounded mb-2"
                />
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    handleLessonChange(
                      moduleIndex,
                      lessonIndex,
                      'videoFile',
                      e.target.files?.[0] || null
                    )
                  }
                  className="block w-full border p-2 rounded"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => addLesson(moduleIndex)}
              className="mt-2 text-blue-600 hover:underline"
            >
              + Add Lesson
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addModule}
        className="bg-gray-100 border border-gray-400 text-gray-800 font-semibold px-4 py-2 rounded hover:bg-gray-200 mb-6"
      >
        + Add Module
      </button>

      <button
        onClick={handleSubmit}
        className="block w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700"
      >
        Submit Course
      </button>
    </div>
  );
};

export default AddModulesPage;

'use client';

import { useState } from 'react';
import { useCourse } from '@/context/CourseContext';
import { useRouter } from 'next/navigation';

const CreateCourse = () => {
  const { courseInfo, setCourseInfo } = useCourse();
  const router = useRouter();

  const [localInfo, setLocalInfo] = useState(courseInfo);

  const handleChange = (e: any) => {
    setLocalInfo({ ...localInfo, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: any) => {
    setLocalInfo({ ...localInfo, coverImage: e.target.files[0] });
  };

  const handleContinue = () => {
    setCourseInfo(localInfo);
    router.push('/teacher/courses/create/add-modules');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Course (1/2)</h1>
      <form className="space-y-4">
        <input name="courseName" value={localInfo.courseName} onChange={handleChange} required className="block w-full border p-2" placeholder="Course Name" />
        <textarea name="courseDescription" value={localInfo.courseDescription} onChange={handleChange} required className="block w-full border p-2" placeholder="Description" />
        
        <select name="courseLevel" value={localInfo.courseLevel} onChange={handleChange} className="block w-full border p-2">
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <select name="courseCategory" value={localInfo.courseCategory} onChange={handleChange} className="block w-full border p-2">
          <option value="Design">Design</option>
          <option value="Development">Development</option>
          <option value="Marketing">Marketing</option>
        </select>

        <input name="price" type="number" value={localInfo.price} onChange={handleChange} className="block w-full border p-2" placeholder="Price" />

        <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full border p-2" />

        <button
          type="button"
          onClick={handleContinue}
          className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700"
        >
          Continue to Modules →
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;

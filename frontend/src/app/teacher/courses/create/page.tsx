'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/teacher/header';
import ProgressSteps from '@/components/teacher/course/addCourse/ProgressSteps';
import BasicInformation from '@/components/teacher/course/addCourse/BasicInformation';
import Curriculum from '@/components/teacher/course/addCourse/Curriculum';
import PricingSettings from '@/components/teacher/course/addCourse/PricingSettings';
import ReviewPublish from '@/components/teacher/course/addCourse/ReviewPublish';
import Navigation from '@/components/teacher/course/addCourse/Navigation';
import { Button } from '@/components/ui/button';
import { showErrorToast, showSuccessToast } from '@/utils/Toast';
import { ArrowLeft } from 'lucide-react';
import { teacherCourseApi } from '@/services/APIservices/teacherApiService';

interface CourseLesson {
  id: string;
  title: string;
  description: string;
  type: 'video';
  duration: number;
  isFree: boolean;
  videoFile: File | null;
  thumbnail: File | null;
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: CourseLesson[];
}

interface CourseData {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: string;
  language: string;
  price: number;
  currency: string;
  coverImage: File | null;
  tags: string[];
  learningOutcomes: string[];
  requirements: string[];
  isPublished: boolean;
  allowDiscounts: boolean;
  totalDuration: number;
}

const steps = [
  { number: 1, title: 'Basic Information', description: 'Course details and metadata' },
  { number: 2, title: 'Curriculum', description: 'Structure your course content' },
  { number: 3, title: 'Pricing & Settings', description: 'Set price and publish options' },
  { number: 4, title: 'Review & Publish', description: 'Review and publish your course' },
];

export default function CreateCoursePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState<CourseData>({
    title: '',
    subtitle: '',
    description: '',
    category: '',
    level: 'Beginner',
    language: 'English',
    price: 0,
    currency: 'INR',
    coverImage: null,
    tags: [],
    learningOutcomes: [''],
    requirements: [''],
    isPublished: false,
    allowDiscounts: true,
    totalDuration: 0,
  });

  const [modules, setModules] = useState<CourseModule[]>([]); // Empty initial state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTotalDuration = () => {
    return modules.reduce(
      (total, module) =>
        total + module.lessons.reduce((moduleTotal, lesson) => moduleTotal + lesson.duration, 0),
      0
    );
  };

  const getTotalLessons = () => {
    return modules.reduce((total, module) => total + module.lessons.length, 0);
  };

  const canProceed = () => {
    console.log('canProceed called, currentStep:', currentStep);
    console.log('Modules state:', modules);

    switch (currentStep) {
      case 1:
        return courseData.title && courseData.description && courseData.category && courseData.coverImage;
      case 2: {
        if (modules.length !== 7) {
          console.log('Validation failed: modules.length !== 7', modules.length);
          // showErrorToast('You must have exactly 7 days in the curriculum.');
          return false;
        }
        const emptyModules = modules.filter(module => module.lessons.length === 0);
        if (emptyModules.length > 0) {
          console.log('Validation failed: empty modules', emptyModules);
          // showErrorToast('Each day must have at least one lesson.');
          return false;
        }
        const lessonsWithoutVideo = modules
          .flatMap(module => module.lessons)
          .filter(lesson => !lesson.videoFile);
        if (lessonsWithoutVideo.length > 0) {
          console.log('Validation failed: lessons without video', lessonsWithoutVideo);
          // showErrorToast('All lessons must have a video file uploaded.');
          return false;
        }
        return true;
      }
      case 3:
        return courseData.price >= 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) {
      console.log('handleSubmit: canProceed returned false');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('subtitle', courseData.subtitle || '');
      formData.append('description', courseData.description);
      formData.append('category', courseData.category);
      formData.append('level', courseData.level);
      formData.append('totalDuration', getTotalDuration().toString());
      formData.append('language', courseData.language);
      formData.append('price', courseData.price.toString());
      formData.append('currency', courseData.currency);
      formData.append('isPublished', courseData.isPublished.toString());
      formData.append('allowDiscounts', courseData.allowDiscounts.toString());
      formData.append('tags', JSON.stringify(courseData.tags));
      formData.append('learningOutcomes', JSON.stringify(courseData.learningOutcomes.filter(outcome => outcome.trim())));
      formData.append('requirements', JSON.stringify(courseData.requirements.filter(req => req.trim())));

      // Append modules as JSON string
      formData.append('modules', JSON.stringify(modules));

      // Append files
      if (courseData.coverImage) {
        formData.append('coverImage', courseData.coverImage);
      }
      modules.forEach((module, moduleIndex) => {
        module.lessons.forEach((lesson, lessonIndex) => {
          if (lesson.videoFile) {
            formData.append(`modules[${moduleIndex}][lessons][${lessonIndex}][videoFile]`, lesson.videoFile);
          }
          if (lesson.thumbnail) {
            formData.append(`modules[${moduleIndex}][lessons][${lessonIndex}][thumbnail]`, lesson.thumbnail);
          }
        });
      });

      const res = await teacherCourseApi.addCourse(formData);

      if (res.ok) {
        showSuccessToast('Course created successfully!');
        router.push('/teacher/courses');
      } else {
        showErrorToast(res.data?.message || 'Failed to create course');
      }
    } catch (error: any) {
      console.error('Error creating course:', error);
      showErrorToast(error.response?.data?.message || 'Failed to create course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => router.back()} data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold" data-testid="text-page-title">
                Create New Course
              </h1>
              <p className="text-muted-foreground">
                Step {currentStep} of 4: {steps[currentStep - 1].title}
              </p>
            </div>
          </div>
        </div>

        <ProgressSteps currentStep={currentStep} steps={steps} />

        <div className="mb-8">
          {currentStep === 1 && (
            <BasicInformation courseData={courseData} setCourseData={setCourseData} />
          )}
          {currentStep === 2 && (
            <Curriculum modules={modules} setModules={setModules} />
          )}
          {currentStep === 3 && (
            <PricingSettings
              courseData={courseData}
              setCourseData={setCourseData}
              totalDuration={getTotalDuration()}
              totalLessons={getTotalLessons()}
            />
          )}
          {currentStep === 4 && (
            <ReviewPublish
              courseData={courseData}
              modules={modules}
              totalDuration={getTotalDuration()}
              totalLessons={getTotalLessons()}
            />
          )}
        </div>

        <Navigation
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          canProceed={canProceed}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
          isPublished={courseData.isPublished}
          steps={steps}
        />
      </div>
    </div>
  );
}
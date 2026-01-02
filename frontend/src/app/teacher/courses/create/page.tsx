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

import { CourseData, CourseModule, CourseLesson } from '@/types/teacher/course';

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
    isTechnicalCourse: false,
    currency: 'INR',
    coverImage: null,
    tags: [],
    learningOutcomes: [''],
    requirements: [''],
    isPublished: false,
    allowDiscounts: true,
    totalDuration: 0,
  });

  const [modules, setModules] = useState<CourseModule[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTotalDuration = (): number => {
    return modules.reduce(
      (total, module) =>
        total + module.lessons.reduce((sum, lesson) => sum + lesson.duration, 0),
      0
    );
  };

  const getTotalLessons = (): number => {
    return modules.reduce((total, module) => total + module.lessons.length, 0);
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(
          courseData.title.trim() &&
          courseData.description.trim() &&
          courseData.category &&
          courseData.coverImage
        );

      case 2:
        // Enforce exactly 7 modules (days)
        if (modules.length !== 7) {
          showErrorToast('You must create exactly 7 days in the curriculum.');
          return false;
        }

        // Each module must have at least one lesson
        const hasEmptyModule = modules.some((m) => m.lessons.length === 0);
        if (hasEmptyModule) {
          showErrorToast('Every day must contain at least one lesson.');
          return false;
        }

        // Every lesson must have a video file
        const missingVideo = modules
          .flatMap((m) => m.lessons)
          .some((lesson) => !lesson.videoFile);

        if (missingVideo) {
          showErrorToast('All lessons must have a video uploaded.');
          return false;
        }

        return true;

      case 3:
        return courseData.price >= 0;

      case 4:
        return true;

      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Basic fields
      formData.append('title', courseData.title);
      formData.append('subtitle', courseData.subtitle || '');
      formData.append('description', courseData.description);
      formData.append('category', courseData.category);
      formData.append('level', courseData.level);
      formData.append('language', courseData.language);
      formData.append('price', courseData.price.toString());
      formData.append('currency', courseData.currency);
      formData.append('totalDuration', getTotalDuration().toString());

      // Booleans → string
      formData.append('isTechnicalCourse', String(courseData.isTechnicalCourse));
      formData.append('isPublished', String(courseData.isPublished));
      formData.append('allowDiscounts', String(courseData.allowDiscounts));

      // Arrays → JSON string
      formData.append('tags', JSON.stringify(courseData.tags));
      formData.append(
        'learningOutcomes',
        JSON.stringify(courseData.learningOutcomes.filter((o) => o.trim()))
      );
      formData.append(
        'requirements',
        JSON.stringify(courseData.requirements.filter((r) => r.trim()))
      );

      // Modules structure (without files)
      const modulesWithoutFiles = modules.map((module) => ({
        ...module,
        lessons: module.lessons.map((lesson) => ({
          ...lesson,
          videoFile: null,
          thumbnail: lesson.thumbnail ? null : null, // keep only metadata
        })),
      }));
      formData.append('modules', JSON.stringify(modulesWithoutFiles));

      // Cover image
      if (courseData.coverImage) {
        formData.append('coverImage', courseData.coverImage);
      }

      // Video & thumbnail files with clean keys
      modules.forEach((module, moduleIdx) => {
        module.lessons.forEach((lesson, lessonIdx) => {
          if (lesson.videoFile) {
            formData.append(
              `video_${moduleIdx}_${lessonIdx}`,
              lesson.videoFile
            );
          }
          if (lesson.thumbnail) {
            formData.append(
              `thumbnail_${moduleIdx}_${lessonIdx}`,
              lesson.thumbnail
            );
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
    } catch (error: unknown) {
      console.error('Error creating course:', error);
      const errMsg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Something went wrong. Please try again.";
      showErrorToast(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div>
              <h1 className="text-3xl font-bold" data-testid="text-page-title">
                Create New Course
              </h1>
              <p className="text-muted-foreground">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
              </p>
            </div>
          </div>
        </div>

        <ProgressSteps currentStep={currentStep} steps={steps} />

        <div className="my-10">
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